#!/usr/bin/env bash
set -euo pipefail

# ===================== CONFIG ======================
PROJECT="erp-laplata"          # nome do projeto no Cloudflare Pages
PROD_BRANCH="erp-git"          # branch de produção
ROUTES=(
  "" login setup analytics
  co/dashboard co/reports co/costs
  mm/catalog mm/vendors mm/purchases
  sd sd/orders sd/customers sd/invoices
  wh/inventory wh/movements wh/reports
  crm/leads crm/opportunities crm/activities
  fi/payables fi/receivables fi/cashflow
)
# ===================================================

say(){ printf "\n\033[1;34m%s\033[0m\n" "$*"; }
warn(){ printf "\n\033[1;33m%s\033[0m\n" "$*"; }
fail(){ printf "\n\033[1;31mERRO:\033[0m %s\n" "$*"; exit 1; }

# 0) Ferramentas
command -v git >/dev/null      || fail "git não encontrado"
command -v npx >/dev/null      || fail "npm/npx não encontrado"
command -v curl >/dev/null     || fail "curl não encontrado"
command -v jq  >/dev/null 2>&1 || warn "jq não encontrado (logs da API ficarão simples)"

# 1) Garantir que estamos na branch de PRODUÇÃO
say "1) Mudando para a branch de produção: ${PROD_BRANCH}"
git fetch origin
git checkout "${PROD_BRANCH}"
git pull origin "${PROD_BRANCH}"

# 2) Detectar onde está o app (frontend/ ou raiz)
say "2) Detectando diretório do app (frontend/ ou raiz)"
APP_DIR=""
for cand in frontend . ; do
  if [ -e "$cand/package.json" ] && { [ -d "$cand/app" ] || [ -e "$cand/next.config.js" ]; }; then
    APP_DIR="$cand"; break
  fi
done
[ -z "${APP_DIR}" ] && fail "Não achei app Next (package.json + app/). Coloque o código em 'frontend/' ou na raiz."
say "→ App detectado em: ${APP_DIR:-.}"

# 3) Limpar do GIT tudo que é artefato de build/estático (sem apagar local)
say "3) Limpando artefatos estáticos COMMITADOS (matam Edge Functions)"
# raiz
git rm -rf --cached .vercel           2>/dev/null || true
git rm -rf --cached out               2>/dev/null || true
git rm -f  --cached public/index.html 2>/dev/null || true
git rm -f  --cached public/login.html 2>/dev/null || true
git rm -f  --cached .vercel/output/index.html      2>/dev/null || true
git rm -rf --cached .vercel/output/static          2>/dev/null || true
# app dir (ex.: frontend)
git rm -rf --cached "${APP_DIR}/.vercel"           2>/dev/null || true
git rm -rf --cached "${APP_DIR}/out"               2>/dev/null || true
git rm -f  --cached "${APP_DIR}/public/index.html" 2>/dev/null || true
git rm -f  --cached "${APP_DIR}/public/login.html" 2>/dev/null || true
git rm -f  --cached "${APP_DIR}/.vercel/output/index.html" 2>/dev/null || true
git rm -rf --cached "${APP_DIR}/.vercel/output/static"     2>/dev/null || true

# 4) .gitignore forte (na raiz e no app) para impedir voltar sujeira
say "4) Escrevendo .gitignore (raiz e ${APP_DIR}/)"
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

mkdir -p "${APP_DIR}"
cat > "${APP_DIR}/.gitignore" <<'EOF'
.vercel/
.next/
out/
node_modules/
EOF
git add "${APP_DIR}/.gitignore" || true

# 5) Garantir next.config.js edge-safe (sem output:'export')
say "5) next.config.js (edge-safe)"
if [ ! -f "${APP_DIR}/next.config.js" ] && [ ! -f "${APP_DIR}/next.config.mjs" ]; then
  cat > "${APP_DIR}/next.config.js" <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  experimental: { serverActions: { allowedOrigins: ['*'] } }
};
module.exports = nextConfig;
EOF
  git add "${APP_DIR}/next.config.js"
else
  # se existir e tiver export estático, remove
  sed -E 's/output\s*:\s*["'\'']export["'\'']\s*,?//g' -i "${APP_DIR}/next.config."* 2>/dev/null || true
  git add "${APP_DIR}/next.config."* 2>/dev/null || true
fi

# 6) Garantir scripts do package.json (sem export)
say "6) Ajustando scripts do package.json"
[ -f "${APP_DIR}/package.json" ] || fail "package.json não encontrado em ${APP_DIR}"
node - <<'NODE' "${APP_DIR}/package.json" > "${APP_DIR}/package.json.tmp"
const fs=require('fs'), p=process.argv[2];
const j=JSON.parse(fs.readFileSync(p,'utf8'));
j.scripts=j.scripts||{};
j.scripts.dev   = "next dev";
j.scripts.build = "next build";
fs.writeFileSync(p+".tmp", JSON.stringify(j,null,2));
NODE
mv "${APP_DIR}/package.json.tmp" "${APP_DIR}/package.json"
git add "${APP_DIR}/package.json"

# 7) Criar **somente se faltarem** as páginas mínimas (não sobrescreve as reais)
say "7) Garantindo páginas mínimas para TODAS as rotas (apenas se faltarem)"
mkdir -p "${APP_DIR}/app"
mk_if_missing(){
  local path="$1"
  local file="${APP_DIR}/app/${path:+$path/}page.tsx"
  if [ ! -f "$file" ]; then
    mkdir -p "$(dirname "$file")"
    cat > "$file" <<EOF
export const runtime = 'edge';
export default function Page(){ return <div>OK: /${path}</div>; }
EOF
    git add "$file"
  fi
}
for r in "${ROUTES[@]}"; do mk_if_missing "$r"; done

# 8) Commit do saneamento (se houver mudanças)
git diff --cached --quiet || git commit -m "chore(pages): limpar estáticos; .gitignore; garantir next/package; rotas mínimas (sem sobrescrever existentes)"

# 9) (Re)Criar o projeto Cloudflare Pages e configurar
say "8) (Re)criando projeto Pages '${PROJECT}'"
if [ -n "${CF_ACCOUNT_ID:-}" ] && [ -n "${CF_API_TOKEN:-}" ]; then
  # Tenta criar; se já existir, ignora erro
  npx wrangler pages project create "${PROJECT}" --production-branch "${PROD_BRANCH}" --no-d1 --no-kv || true

  # Ajustar build settings via API (Root dir, build cmd, output dir)
  ROOT_DIR_JSON=$([ "${APP_DIR}" = "." ] && echo '""' || printf '"%s"' "${APP_DIR}")
  read -r -d '' PAYLOAD <<JSON || true
{
  "build_config": {
    "build_command": "npm ci && npm run build && npx @cloudflare/next-on-pages",
    "destination_dir": ".vercel/output",
    "root_dir": ${ROOT_DIR_JSON}
  },
  "source": { "type": "github", "config": { "production_branch": "${PROD_BRANCH}" } }
}
JSON
  curl -sS -X PATCH \
    "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/${PROJECT}" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data "${PAYLOAD}" >/dev/null || warn "Não consegui aplicar build_config via API (ok se o projeto é novo)."

else
  say "⚠️ CF_ACCOUNT_ID/CF_API_TOKEN não definidos — farei login interativo do Wrangler."
  npx wrangler login
  npx wrangler pages project create "${PROJECT}" --production-branch "${PROD_BRANCH}" --no-d1 --no-kv || true
fi

# 10) Build do app + gerar bundle Next on Pages
say "9) Build do Next + gerar .vercel/output (next-on-pages)"
pushd "${APP_DIR}" >/dev/null
rm -rf .vercel/output .next node_modules
npm ci
npm run build
npx @cloudflare/next-on-pages@latest
popd >/dev/null

# 11) Deploy de PRODUÇÃO (Direct Upload)
say "10) Deploy de produção (Direct Upload)"
npx wrangler pages deploy "${APP_DIR}/.vercel/output" --project-name "${PROJECT}" --branch production

# 12) (Opcional) Compatibility flags de runtime (não obrigatório, mas recomendado)
if [ -n "${CF_ACCOUNT_ID:-}" ] && [ -n "${CF_API_TOKEN:-}" ]; then
  say "11) Ajustando compatibility_date/flags (opcional)"
  curl -sS -X PATCH \
    "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/${PROJECT}" \
    -H "Authorization: Bearer ${CF_API_TOKEN}" \
    -H "Content-Type: application/json" \
    --data '{"deployment_configs":{"production":{"compatibility_date":"2025-09-17","compatibility_flags":["nodejs_compat_populate_process_env"]}}}' >/dev/null || true
fi

# 13) Checar status das rotas em produção
say "12) Checando rotas públicas"
BASE="https://${PROJECT}.pages.dev"
for p in "${ROUTES[@]}"; do
  url="${BASE}/${p}"
  url="${url//\/\/+//}"   # normalizar //
  code=$(curl -s -o /dev/null -w "%{http_code}" "$url" || true)
  printf "%-30s %s\n" "$url" "$code"
done

say "✅ Concluído."
echo "→ Abra o painel do Cloudflare Pages > ${PROJECT} > Deployments (Production)."
echo "   - A aba 'Functions' deve listar as rotas."
echo "   - Se alguma rota ainda mostrar 'OK', é porque a página REAL não existe no repo;"
echo "     substitua o placeholder criando 'app/<rota>/page.tsx' real e faça git push."