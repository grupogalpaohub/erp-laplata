#!/usr/bin/env bash
set -euo pipefail

PROJECT="erp-laplata"
PROD_BRANCH="erp-git"

say(){ printf "\n\033[1;34m%s\033[0m\n" "$*"; }
warn(){ printf "\n\033[1;33m%s\033[0m\n" "$*"; }
fail(){ printf "\n\033[1;31mERRO:\033[0m %s\n" "$*"; exit 1; }

command -v git >/dev/null || fail "git não encontrado"
command -v npx >/dev/null || fail "npm/npx não encontrado"
command -v curl >/dev/null || fail "curl não encontrado"
command -v jq  >/dev/null || warn "jq ausente (logs menos legíveis)"

# 0) branch e app dir
say "0) Branch de produção"
git fetch origin
git checkout "${PROD_BRANCH}"
git pull origin "${PROD_BRANCH}"

say "Detectando app dir (frontend/ ou raiz)"
APP_DIR=""
for cand in frontend . ; do
  if [ -e "$cand/package.json" ] && { [ -d "$cand/app" ] || [ -e "$cand/next.config.js" ]; }; then
    APP_DIR="$cand"; break
  fi
done
[ -z "$APP_DIR" ] && fail "Não achei app Next (package.json + app/)."
echo "→ APP_DIR=${APP_DIR}"

# 1) limpeza forte (sem apagar seu código)
say "1) Limpeza forte de resíduos de build e workers manuais"
git rm -f --cached _worker.js "${APP_DIR}/_worker.js" 2>/dev/null || true
git rm -rf --cached .vercel "${APP_DIR}/.vercel" out "${APP_DIR}/out" 2>/dev/null || true
git rm -f  --cached public/index.html public/login.html "${APP_DIR}/public/index.html" "${APP_DIR}/public/login.html" 2>/dev/null || true
rm -rf .vercel .next "${APP_DIR}/.vercel" "${APP_DIR}/.next" 2>/dev/null || true

# 2) checagens de código: imports proibidos e process.env
say "2) Scanner Edge: procurando imports proibidos e uso indevido de process.env"
REPORT="edge_diagnostics.txt"
: > "$REPORT"

EDGE_DIRS="${APP_DIR}/app ${APP_DIR}/components ${APP_DIR}/lib ${APP_DIR}/src"
NODE_BUILTINS='(fs|path|os|crypto|stream|zlib|http|https|net|tls|child_process|worker_threads|perf_hooks|async_hooks)'
echo "== Imports Node proibidos =="        | tee -a "$REPORT"
grep -RInE "from ['\"]${NODE_BUILTINS}['\"]|require\(['\"]${NODE_BUILTINS}['\"]\)" $EDGE_DIRS 2>/dev/null | tee -a "$REPORT" || echo "OK (não encontrados)" | tee -a "$REPORT"

echo -e "\n== 'use client' + process.env NÃO-NEXT_PUBLIC ==" | tee -a "$REPORT"
grep -RIl --include='*.{ts,tsx,js,jsx}' "^'use client'|^\"use client\"" $EDGE_DIRS 2>/dev/null | while read -r f; do
  if grep -q "process\.env\.(?!NEXT_PUBLIC_)" -P "$f"; then
    echo "CLIENT ENV SUSPEITA → $f" | tee -a "$REPORT"
    grep -n "process\.env\." -n "$f" | tee -a "$REPORT"
  fi
done || true

echo -e "\n== process.env no server (Edge) ==" | tee -a "$REPORT"
grep -RIn "process\.env\.(?!NEXT_PUBLIC_)" -P $EDGE_DIRS 2>/dev/null | tee -a "$REPORT" || echo "OK (não encontrados)" | tee -a "$REPORT"

echo -e "\n== middleware.ts usa Node APIs? ==" | tee -a "$REPORT"
if [ -f "${APP_DIR}/middleware.ts" ] || [ -f "${APP_DIR}/middleware.js" ]; then
  M="${APP_DIR}/middleware.ts"
  [ -f "${APP_DIR}/middleware.js" ] && M="${APP_DIR}/middleware.js"
  if grep -Eiq "require\(|from ['\"]${NODE_BUILTINS}['\"]" "$M"; then
    echo "MIDDLEWARE SUSPEITO → $M" | tee -a "$REPORT"
    grep -nE "require\(|from ['\"]${NODE_BUILTINS}['\"]" "$M" | tee -a "$REPORT"
  else
    echo "OK ($M sem Node APIs)" | tee -a "$REPORT"
  fi
else
  echo "Sem middleware (OK)" | tee -a "$REPORT"
fi

echo -e "\n== Server Actions com Node APIs? ==" | tee -a "$REPORT"
grep -RIn --include='*.{ts,tsx,js,jsx}' "export async function " ${APP_DIR}/app 2>/dev/null | while read -r line; do
  f=$(echo "$line" | cut -d: -f1)
  if grep -Eiq "require\(|from ['\"]${NODE_BUILTINS}['\"]" "$f"; then
    echo "SERVER ACTION SUSPEITA → $f" | tee -a "$REPORT"
  fi
done || true

say "Relatório salvo em: $REPORT"
sed -n '1,200p' "$REPORT" || true

# 3) .gitignore forte (para não voltar sujeira)
say "3) .gitignore forte"
cat > .gitignore <<'EOF'
.vercel/
.next/
out/
node_modules/
.env
.env.*
!.env.example
EOF
git add .gitignore || true
git commit -m "chore: endurecer .gitignore (anti estático)" || true
git push origin "${PROD_BRANCH}" || true

# 4) next config / package scripts (sem export)
say "4) Conferindo next.config.js e package.json"
if [ -f "${APP_DIR}/next.config.js" ]; then
  sed -E 's/output\s*:\s*["'\'']export["'\'']\s*,?//g' -i "${APP_DIR}/next.config.js" || true
  git add "${APP_DIR}/next.config.js" || true
fi
if [ -f "${APP_DIR}/package.json" ]; then
  node - <<'NODE' "${APP_DIR}/package.json" > "${APP_DIR}/package.json.tmp"
const fs=require('fs'), p=process.argv[2];
const j=JSON.parse(fs.readFileSync(p,'utf8')); j.scripts=j.scripts||{};
j.scripts.dev="next dev"; j.scripts.build="next build";
fs.writeFileSync(p+".tmp", JSON.stringify(j,null,2));
NODE
  mv "${APP_DIR}/package.json.tmp" "${APP_DIR}/package.json"
  git add "${APP_DIR}/package.json" || true
fi
git commit -m "fix(build): remover output:export e normalizar scripts" || true
git push origin "${PROD_BRANCH}" || true

# 5) (re)criar projeto Pages se necessário
say "5) (Re)criando projeto Pages"
if [ -z "${CF_ACCOUNT_ID:-}" ] || [ -z "${CF_API_TOKEN:-}" ]; then
  warn "Sem CF tokens → abrindo 'wrangler login'."
  npx wrangler login
fi
npx wrangler pages project create "${PROJECT}" --production-branch "${PROD_BRANCH}" --no-d1 --no-kv || true

# 6) build limpo + next-on-pages
say "6) Build limpo + next-on-pages"
pushd "${APP_DIR}" >/dev/null
rm -rf .vercel/output .next node_modules
npm ci
npm run build
npx @cloudflare/next-on-pages@latest
popd >/dev/null

# sanity: o _routes.json deve existir (NÃO criar manual)
[ -f "${APP_DIR}/.vercel/output/functions/_routes.json" ] || fail "_routes.json não gerado. Falha do next-on-pages. Verificar versões e saída do build."

FUNC_COUNT=$(find "${APP_DIR}/.vercel/output/functions" -maxdepth 2 -type d -name "*.func" | wc -l | xargs)
[ "${FUNC_COUNT}" -ge 10 ] || fail "Poucas Edge Functions (${FUNC_COUNT}). O bundle não está correto."

# 7) deploy produção (Direct Upload) com flags compat
say "7) Deploy de produção (Direct Upload)"
npx wrangler pages deploy "${APP_DIR}/.vercel/output" \
  --project-name "${PROJECT}" \
  --branch production \
  --compatibility-date "$(date +%F)" \
  --compatibility-flags nodejs_compat,nodejs_compat_populate_process_env

# 8) logs do deployment
say "8) Logs do deployment (tail 25s)"
if command -v jq >/dev/null 2>&1; then
  DEPLOY_ID=$(npx wrangler pages deployment list --project-name="${PROJECT}" --format=json | jq -r '.[0].id' 2>/dev/null || true)
else
  DEPLOY_ID=""
fi
if [ -n "$DEPLOY_ID" ]; then
  echo "→ Deployment ID: $DEPLOY_ID"
  timeout 25s npx wrangler pages deployment tail --project-name="${PROJECT}" --deployment-id="${DEPLOY_ID}" || true
else
  warn "Sem jq/ID. Veja logs no painel do Pages."
fi

# 9) teste das URLs
say "9) Testando rotas"
BASE="https://${PROJECT}.pages.dev"
routes=(
  / /login /setup /analytics
  /co/dashboard /co/reports /co/costs
  /mm/catalog /mm/vendors /mm/purchases
  /sd /sd/orders /sd/customers /sd/invoices
  /wh/inventory /wh/movements /wh/reports
  /crm/leads /crm/opportunities /crm/activities
  /fi/payables /fi/receivables /fi/cashflow
)
for p in "${routes[@]}"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$p" || true)
  printf "%-26s %s\n" "$p" "$code"
done

say "✅ Fim. Veja o arquivo $REPORT para as causas prováveis (imports Node/process.env)."
echo "Se continuar 500, cole aqui os trechos do tail acima (stack do erro) e as linhas marcadas no $REPORT."