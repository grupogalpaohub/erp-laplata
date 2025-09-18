#!/usr/bin/env bash
set -euo pipefail

PROJECT="erp-laplata"     # Cloudflare Pages project
PROD_BRANCH="erp-git"     # branch de produção

say(){ printf "\n\033[1;34m%s\033[0m\n" "$*"; }
fail(){ printf "\n\033[1;31mERRO:\033[0m %s\n" "$*"; exit 1; }

# 0) checagens básicas
command -v git >/dev/null || fail "git não encontrado"
command -v npx >/dev/null || fail "npm/npx não encontrado"
command -v curl >/dev/null || fail "curl não encontrado"
command -v jq  >/dev/null || { echo "⚠️ jq não encontrado (instale se puder)."; }

# 1) branch de produção
say "1) Garantindo branch ${PROD_BRANCH}"
git fetch origin
git checkout "${PROD_BRANCH}"
git pull origin "${PROD_BRANCH}"

# 2) detectar app dir (frontend/ ou raiz)
say "2) Detectando app dir"
APP_DIR=""
for cand in frontend . ; do
  if [ -e "$cand/package.json" ] && { [ -d "$cand/app" ] || [ -e "$cand/next.config.js" ]; }; then
    APP_DIR="$cand"; break
  fi
done
[ -z "$APP_DIR" ] && fail "Não achei app Next (package.json + app/)."
echo "→ APP_DIR=${APP_DIR}"

# 3) LIMPEZA FORTE: remover qualquer worker/manual e build sujo (SEM deletar seu código)
say "3) Limpeza de resíduos (_worker.js manual, .vercel/output sujo, out/)"
# do repo
git rm -f --cached _worker.js 2>/dev/null || true
git rm -f --cached "${APP_DIR}/_worker.js" 2>/dev/null || true
git rm -rf --cached .vercel 2>/dev/null || true
git rm -rf --cached "${APP_DIR}/.vercel" 2>/dev/null || true
git rm -rf --cached out "${APP_DIR}/out" 2>/dev/null || true
git rm -f  --cached public/index.html public/login.html 2>/dev/null || true
git rm -f  --cached "${APP_DIR}/public/index.html" "${APP_DIR}/public/login.html" 2>/dev/null || true
# local (workspace)
rm -rf .vercel/output .next "${APP_DIR}/.vercel/output" "${APP_DIR}/.next" 2>/dev/null || true
rm -f  _worker.js "${APP_DIR}/_worker.js" 2>/dev/null || true

# 4) .gitignore rígido (impede que isso volte)
say "4) .gitignore anti-estático"
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

# 5) next.config.js e package.json (sem export)
say "5) Conferindo next.config/package.json"
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

git commit -m "fix(pages): limpar worker/manual e build sujo; endurecer .gitignore; normalizar next/package" || true
git push origin "${PROD_BRANCH}" || true

# 6) (re)criar projeto Pages se não existir
say "6) (Re)criando projeto Pages ${PROJECT} (se preciso)"
if [ -z "${CF_ACCOUNT_ID:-}" ] || [ -z "${CF_API_TOKEN:-}" ]; then
  echo "⚠️ Sem CF_ACCOUNT_ID/CF_API_TOKEN — abrirei login interativo do Wrangler."
  npx wrangler login
fi
npx wrangler pages project create "${PROJECT}" --production-branch "${PROD_BRANCH}" --no-d1 --no-kv || true

# 7) Build limpo e geração next-on-pages
say "7) Build limpo + next-on-pages"
pushd "${APP_DIR}" >/dev/null
rm -rf .vercel/output .next node_modules
npm ci
npm run build
npx @cloudflare/next-on-pages@latest
popd >/dev/null

# sanity: precisa existir _routes.json e várias *.func
[ -f "${APP_DIR}/.vercel/output/functions/_routes.json" ] || fail "Faltou _routes.json no bundle."
FUNC_COUNT=$(find "${APP_DIR}/.vercel/output/functions" -maxdepth 2 -type d -name "*.func" | wc -l | xargs)
[ "${FUNC_COUNT}" -ge 10 ] || fail "Poucas functions geradas (${FUNC_COUNT}). Checar build."

# 8) Deploy de PRODUÇÃO (Direct Upload) — sem mover nada manual
say "8) Deploy de produção (Direct Upload)"
npx wrangler pages deploy "${APP_DIR}/.vercel/output" \
  --project-name "${PROJECT}" \
  --branch production \
  --compatibility-date "$(date +%F)" \
  --compatibility-flags nodejs_compat,nodejs_compat_populate_process_env

# 9) Pegar ID do último deployment e tail de logs (para achar a causa do 500)
say "9) Coletando logs do deployment"
DEPLOY_ID=$(npx wrangler pages deployment list --project-name="${PROJECT}" --format=json | jq -r '.[0].id' 2>/dev/null || true)
if [ -n "${DEPLOY_ID}" ]; then
  echo "→ Deployment ID: ${DEPLOY_ID}"
  echo "---- TAIL (20s) ----"
  timeout 20s npx wrangler pages deployment tail --project-name="${PROJECT}" --deployment-id="${DEPLOY_ID}" || true
  echo "--------------------"
else
  echo "⚠️ Não consegui ler o deployment id. Veja os logs no painel do Pages."
fi

# 10) Checar HTTP das rotas principais
say "10) Testando rotas"
BASE="https://${PROJECT}.pages.dev"
for p in / /login /setup /analytics \
         /co/dashboard /co/reports /co/costs \
         /mm/catalog /mm/vendors /mm/purchases \
         /sd /sd/orders /sd/customers /sd/invoices \
         /wh/inventory /wh/movements /wh/reports \
         /crm/leads /crm/opportunities /crm/activities \
         /fi/payables /fi/receivables /fi/cashflow
do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$p" || true)
  printf "%-28s %s\n" "$p" "$code"
done

say "✅ Pronto. Se ainda aparecer 500, os logs acima mostram a stack de erro do Worker (causa raiz)."
echo "Dica: 500 comum = import de módulo Node no server (Edge) ou variável de ambiente crítica ausente."