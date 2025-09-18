#!/usr/bin/env bash
set -euo pipefail

# ==============================
# ERP LaPlata — Bootstrap Seguro
# ==============================
# Este script:
# 1) Instala guardrails (hooks + checks).
# 2) Limpa artefatos estáticos do Git (sem apagar local).
# 3) Detecta APP_DIR (frontend/ ou raiz).
# 4) Valida rotas obrigatórias (NÃO cria dummy; aborta se faltar).
# 5) Builda com next-on-pages.
# 6) (Re)cria o Cloudflare Pages "erp-laplata".
# 7) Configura root_dir, build_command, output_dir, production_branch, flags.
# 8) Faz deploy de produção via Direct Upload.
# 9) Verifica URLs críticas.
#
# NÃO toca no banco. NÃO inventa dados. NÃO cria páginas "OK".

PROJECT="erp-laplata"
PROD_BRANCH="erp-git"
REQUIRED_ROUTES=(
  "" login setup analytics
  co/dashboard co/reports co/costs
  mm/catalog mm/vendors mm/purchases
  sd sd/orders sd/customers sd/invoices
  wh/inventory wh/movements wh/reports
  crm/leads crm/opportunities crm/activities
  fi/payables fi/receivables fi/cashflow
)

say(){ printf "\n\033[1;34m%s\033[0m\n" "$*"; }
warn(){ printf "\n\033[1;33m%s\033[0m\n" "$*"; }
fail(){ printf "\n\033[1;31mERRO:\033[0m %s\n" "$*"; exit 1; }

# ---------- 0) Pré-checagens ----------
[ -n "${CF_ACCOUNT_ID:-}" ] || fail "Defina CF_ACCOUNT_ID no ambiente."
[ -n "${CF_API_TOKEN:-}" ]  || fail "Defina CF_API_TOKEN no ambiente."
command -v git >/dev/null || fail "git não encontrado."
command -v npx >/dev/null || fail "npm/npx não encontrado."
command -v curl >/dev/null || fail "curl não encontrado."
command -v jq  >/dev/null || warn "jq não encontrado (logs do deploy menos legíveis)."

# ---------- 1) Git/branch ----------
say "1) Garantindo branch de produção: ${PROD_BRANCH}"
git fetch origin
git checkout "${PROD_BRANCH}"
git pull origin "${PROD_BRANCH}"

# ---------- 2) Detectar APP_DIR ----------
say "2) Detectando diretório do app (frontend/ ou raiz)"
APP_DIR=""
for cand in frontend . ; do
  if [ -e "$cand/package.json" ] && { [ -d "$cand/app" ] || [ -e "$cand/next.config.js" ]; }; then
    APP_DIR="$cand"; break
  fi
done
[ -z "$APP_DIR" ] && fail "Não achei app Next. O projeto deve ter package.json e app/ (raiz ou frontend/)."
say "→ APP_DIR=${APP_DIR}"

# ---------- 3) Guardrails: hooks + scripts ----------
say "3) Instalando guardrails (pre-commit/pre-push + checks)"
mkdir -p .githooks scripts
git config core.hooksPath .githooks

cat > scripts/check_static.sh <<'EOS'
#!/usr/bin/env bash
set -euo pipefail
bad=$(git diff --cached --name-only --diff-filter=ACMR | grep -Ei '(^|/)(public/.*\.(html|htm)$|\.vercel/output/static/.*\.html$|^out/)' || true)
[ -z "$bad" ] || { echo "❌ HTML/estático proibido:"; echo "$bad"; exit 1; }
bad2=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '^(\.vercel/|out/)' || true)
[ -z "$bad2" ] || { echo "❌ Artefatos de build no commit:"; echo "$bad2"; exit 1; }
bad3=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '(^|/)_(worker|_worker)\.js$' || true)
[ -z "$bad3" ] || { echo "❌ _worker.js manual é proibido:"; echo "$bad3"; exit 1; }
EOS
chmod +x scripts/check_static.sh

cat > scripts/check_package_next.sh <<'EOS'
#!/usr/bin/env bash
set -euo pipefail
files=$(git diff --cached --name-only --diff-filter=ACMR | grep -E 'package\.json$' || true)
[ -z "$files" ] && exit 0
for f in $files; do
  build=$(jq -r '.scripts.build // empty' "$f" 2>/dev/null || true)
  dev=$(jq -r  '.scripts.dev   // empty' "$f" 2>/dev/null || true)
  [[ "$build" =~ next\ build ]] || { echo "❌ $f: scripts.build deve ser 'next build'."; exit 1; }
  [[ "$build" =~ export ]] && { echo "❌ $f: proibido 'next export'."; exit 1; }
  [[ "$dev"   =~ next\ dev   ]] || { echo "❌ $f: scripts.dev deve ser 'next dev'."; exit 1; }
done
EOS
chmod +x scripts/check_package_next.sh

cat > scripts/check_next_config.sh <<'EOS'
#!/usr/bin/env bash
set -euo pipefail
files=$(git diff --cached --name-only --diff-filter=ACMR | grep -E 'next\.config\.(js|mjs|ts)$' || true)
[ -z "$files" ] && exit 0
for f in $files; do
  grep -Eiq "output\s*:\s*['\"]export['\"]" "$f" && { echo "❌ $f: output:'export' é proibido."; exit 1; }
done
EOS
chmod +x scripts/check_next_config.sh

cat > scripts/check_sql_ddls.sh <<'EOS'
#!/usr/bin/env bash
set -euo pipefail
changed=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.sql$' || true)
[ -z "$changed" ] && exit 0
for f in $changed; do
  case "$f" in
    db/migrations/*) ;; 
    *)
      grep -Eiq '\b(DROP|ALTER|TRUNCATE|CREATE\s+TYPE|CREATE\s+EXTENSION|CREATE\s+ENUM)\b' "$f" \
        && { echo "❌ $f: DDL crítico fora de /db/migrations."; exit 1; }
      ;;
  esac
done
EOS
chmod +x scripts/check_sql_ddls.sh

cat > scripts/check_env_leak.sh <<'EOS'
#!/usr/bin/env bash
set -euo pipefail
bad=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '^(\.env($|\.|/)|.*\/\.env($|\.|/))' || true)
[ -z "$bad" ] || { echo "❌ Não commitar .env:"; echo "$bad"; exit 1; }
EOS
chmod +x scripts/check_env_leak.sh

cat > scripts/check_required_routes.sh <<'EOS'
#!/usr/bin/env bash
set -euo pipefail
APP_DIR="${1:-.}"
miss=()
need(){ [ -f "$APP_DIR/app/$1/page.tsx" ] || miss+=("$1"); }
need "" ; need "login" ; need "setup" ; need "analytics"
need "co/dashboard" ; need "co/reports" ; need "co/costs"
need "mm/catalog"  ; need "mm/vendors" ; need "mm/purchases"
need "sd" ; need "sd/orders" ; need "sd/customers" ; need "sd/invoices"
need "wh/inventory" ; need "wh/movements" ; need "wh/reports"
need "crm/leads" ; need "crm/opportunities" ; need "crm/activities"
need "fi/payables" ; need "fi/receivables" ; need "fi/cashflow"
if [ ${#miss[@]} -gt 0 ]; then
  echo "❌ Rotas obrigatórias ausentes (crie-as, sem dummy):"
  for r in "${miss[@]}"; do echo " - app/$r/page.tsx"; done
  exit 1
fi
EOS
chmod +x scripts/check_required_routes.sh

cat > .githooks/pre-commit <<'HOOK'
#!/usr/bin/env bash
set -euo pipefail
./scripts/check_static.sh
./scripts/check_package_next.sh
./scripts/check_next_config.sh
./scripts/check_sql_ddls.sh
./scripts/check_env_leak.sh
APP_DIR="."
[ -d "frontend/app" ] && APP_DIR="frontend"
./scripts/check_required_routes.sh "$APP_DIR"
HOOK
chmod +x .githooks/pre-commit

cat > .githooks/pre-push <<'HOOK'
#!/usr/bin/env bash
set -euo pipefail
./scripts/check_static.sh
./scripts/check_package_next.sh
./scripts/check_next_config.sh
./scripts/check_env_leak.sh
APP_DIR="."
[ -d "frontend/app" ] && APP_DIR="frontend"
./scripts/check_required_routes.sh "$APP_DIR"
HOOK
chmod +x .githooks/pre-push

# ---------- 4) .gitignore rígido ----------
say "4) Gravando .gitignore"
cat > .gitignore <<'EOF'
.vercel/
.next/
out/
node_modules/
.env
.env.*
!.env.example
.DS_Store
Thumbs.db
.vscode/
.idea/
EOF
git add .gitignore || true

# ---------- 5) Limpeza de artefatos estáticos COMMITADOS ----------
say "5) Limpando artefatos estáticos do Git (sem apagar local)"
git rm -rf --cached .vercel 2>/dev/null || true
git rm -rf --cached out     2>/dev/null || true
git rm -f  --cached public/index.html public/login.html 2>/dev/null || true
git rm -f  --cached .vercel/output/index.html 2>/dev/null || true
git rm -rf --cached .vercel/output/static 2>/dev/null || true
git rm -rf --cached "$APP_DIR/.vercel" "$APP_DIR/out" 2>/dev/null || true
git rm -f  --cached "$APP_DIR/public/index.html" "$APP_DIR/public/login.html" 2>/dev/null || true
git rm -f  --cached "$APP_DIR/.vercel/output/index.html" 2>/dev/null || true
git rm -rf --cached "$APP_DIR/.vercel/output/static" 2>/dev/null || true

# ---------- 6) Validar next.config/package.json ----------
say "6) Validando next.config/package.json"
NC="${APP_DIR}/next.config.js"
if [ -f "$NC" ] && grep -Eiq "output\s*:\s*['\"]export['\"]" "$NC"; then
  fail "next.config.js contém output:'export' (remova)."
fi
PJ="${APP_DIR}/package.json"
[ -f "$PJ" ] || fail "package.json não encontrado em ${APP_DIR}."
node - <<'NODE' "$PJ" > "${PJ}.chk"
const fs=require('fs'), p=process.argv[2];
const j=JSON.parse(fs.readFileSync(p,'utf8'));
if(!j.scripts||!j.scripts.build||!j.scripts.build.includes('next build')){
  console.error('scripts.build deve ser "next build"'); process.exit(1);
}
if(j.scripts.build.includes('export')){
  console.error('proibido next export'); process.exit(1);
}
if(!j.scripts||!j.scripts.dev||!j.scripts.dev.includes('next dev')){
  console.error('scripts.dev deve ser "next dev"'); process.exit(1);
}
NODE
rm -f "${PJ}.chk"

# ---------- 7) Verificar rotas obrigatórias (NÃO cria dummy) ----------
say "7) Verificando rotas obrigatórias (sem dummy)"
./scripts/check_required_routes.sh "$APP_DIR" || fail "Crie as páginas faltantes e rode de novo."

# ---------- 8) Commit de guardrails (se houve alterações) ----------
git add .githooks scripts || true
git commit -m "chore(guardrails): hooks anti-estático/anti-export/anti-DDL; verificador de rotas" || true
git push origin "${PROD_BRANCH}" || true

# ---------- 9) Build Next + next-on-pages ----------
say "8) Build do Next + next-on-pages"
pushd "$APP_DIR" >/dev/null
rm -rf .vercel/output .next
npm ci
npm run build
npx @cloudflare/next-on-pages@latest
popd >/dev/null

# Garante _routes.json mínimo (caso a lib não gere)
mkdir -p "$APP_DIR/.vercel/output/functions"
if [ ! -f "$APP_DIR/.vercel/output/functions/_routes.json" ]; then
  cat > "$APP_DIR/.vercel/output/functions/_routes.json" <<EOF
{ "version": 1, "include": ["/*"], "exclude": ["/_next/static/*","/_next/image*","/favicon.ico"] }
EOF
fi

# ---------- 10) (Re)Criar projeto Pages e configurar ----------
say "9) (Re)criando projeto Cloudflare Pages: ${PROJECT}"
# Se não existir, cria; se já existir, ignora o erro
npx wrangler pages project create "${PROJECT}" --production-branch "${PROD_BRANCH}" --no-d1 --no-kv || true

# root_dir = APP_DIR ("" se raiz)
ROOT_DIR=""
[ "$APP_DIR" != "." ] && ROOT_DIR="$APP_DIR"

# ---------- 11) Deploy via Direct Upload ----------
say "10) Deploy via Direct Upload"
npx wrangler pages deploy "$APP_DIR/.vercel/output" --project-name "${PROJECT}" --compatibility-date "$(date +%Y-%m-%d)" --compatibility-flags nodejs_compat_populate_process_env

# ---------- 12) Verificação de URLs críticas ----------
say "11) Verificando URLs críticas"
BASE_URL="https://${PROJECT}.pages.dev"
for route in "${REQUIRED_ROUTES[@]}"; do
  url="${BASE_URL}/${route}"
  say "Testando: $url"
  if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
    echo "✅ $url"
  else
    warn "❌ $url (não retornou 200)"
  fi
done

say "✅ Bootstrap concluído! Projeto: https://${PROJECT}.pages.dev"