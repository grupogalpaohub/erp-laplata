#!/usr/bin/env bash
set -euo pipefail

PROJECT="erp-laplata"
PROD_BRANCH="erp-git"

say(){ printf "\n\033[1;34m%s\033[0m\n" "$*"; }
fail(){ printf "\n\033[1;31mERRO:\033[0m %s\n" "$*"; exit 1; }

command -v git >/dev/null || fail "git não encontrado"
command -v npx >/dev/null || fail "npm/npx não encontrado"
command -v curl >/dev/null || fail "curl não encontrado"

# 0) Branch + app dir
say "0) Branch de produção"
git fetch origin
git checkout "${PROD_BRANCH}"
git pull origin "${PROD_BRANCH}"

say "Detectando app dir (frontend/ ou raiz)"
APP_DIR=""
for cand in frontend . ; do
  if [ -e "$cand/package.json" ] && { [ -d "$cand/app" ] || [ -e "$cand/next.config.js" ]; }; then APP_DIR="$cand"; break; fi
done
[ -z "$APP_DIR" ] && fail "Não achei app Next (package.json + app/)."
echo "→ APP_DIR=${APP_DIR}"

# 1) SAFE MODE – salvar originais e escrever layout/page mínimos (sem imports)
say "1) Ativando SAFE MODE (layout/page mínimos, sem imports externos)"
mkdir -p "${APP_DIR}/app"
# backup se ainda não existir
[ -f "${APP_DIR}/app/layout.tsx" ] && cp -n "${APP_DIR}/app/layout.tsx" "${APP_DIR}/app/layout.tsx.bak" || true
[ -f "${APP_DIR}/app/page.tsx" ] && cp -n "${APP_DIR}/app/page.tsx" "${APP_DIR}/app/page.tsx.bak" || true

cat > "${APP_DIR}/app/layout.tsx" <<'EOF'
export const runtime = 'edge';
export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="pt-BR"><body>
      <nav style={{padding:12,borderBottom:'1px solid #eee',display:'flex',gap:12,flexWrap:'wrap'}}>
        <a href="/">/</a>
        <a href="/login">/login</a>
        <a href="/setup">/setup</a>
        <a href="/analytics">/analytics</a>
        <a href="/co/dashboard">/co/dashboard</a>
        <a href="/mm/catalog">/mm/catalog</a>
        <a href="/sd">/sd</a>
        <a href="/wh/inventory">/wh/inventory</a>
        <a href="/crm/leads">/crm/leads</a>
        <a href="/fi/payables">/fi/payables</a>
      </nav>
      <main style={{padding:24}}>{children}</main>
    </body></html>
  );
}
EOF

cat > "${APP_DIR}/app/page.tsx" <<'EOF'
export const runtime = 'edge';
export default function Page(){ return <div style={{padding:24,fontFamily:'ui-sans-serif'}}>SAFE MODE ✅</div>; }
EOF

# 2) Garantir que NADA de estático/worker manual está commitado
say "2) Limpando resíduos do repo (sem apagar seu código)"
git rm -f --cached _worker.js "${APP_DIR}/_worker.js" 2>/dev/null || true
git rm -rf --cached .vercel "${APP_DIR}/.vercel" out "${APP_DIR}/out" 2>/dev/null || true
git rm -f  --cached public/index.html public/login.html "${APP_DIR}/public/index.html" "${APP_DIR}/public/login.html" 2>/dev/null || true
cat > .gitignore <<'EOF'
.vercel/
.next/
out/
node_modules/
.env
.env.*
!.env.example
EOF
git add .gitignore "${APP_DIR}/app/layout.tsx" "${APP_DIR}/app/page.tsx" || true
git commit -m "chore(safe-mode): layout/page mínimos para isolar 500; limpar artefatos do repo" || true
git push origin "${PROD_BRANCH}" || true

# 3) (Re)criar Pages se preciso
say "3) (Re)criando projeto Pages"
if [ -z "${CF_ACCOUNT_ID:-}" ] || [ -z "${CF_API_TOKEN:-}" ]; then
  npx wrangler login
fi
npx wrangler pages project create "${PROJECT}" --production-branch "${PROD_BRANCH}" --no-d1 --no-kv || true

# 4) Build limpo + next-on-pages (sem CSS globais, sem imports)
say "4) Build + next-on-pages (limpo)"
pushd "${APP_DIR}" >/dev/null
rm -rf .vercel/output .next node_modules
npm ci
npm run build
npx @cloudflare/next-on-pages@latest
popd >/dev/null

# sanity do bundle
[ -f "${APP_DIR}/.vercel/output/functions/_routes.json" ] || { echo "❌ next-on-pages não gerou _routes.json"; exit 1; }
COUNT=$(find "${APP_DIR}/.vercel/output/functions" -maxdepth 2 -type d -name "*.func" | wc -l | xargs)
[ "$COUNT" -ge 1 ] || { echo "❌ bundle sem functions"; exit 1; }

# 5) Deploy produção (Direct Upload)
say "5) Deploy produção (Direct Upload)"
npx wrangler pages deploy "${APP_DIR}/.vercel/output" --project-name "${PROJECT}" --branch production \
  --compatibility-date "$(date +%F)" --compatibility-flags nodejs_compat,nodejs_compat_populate_process_env

# 6) Testes e logs
say "6) Testando / e coletando logs"
BASE="https://${PROJECT}.pages.dev"
code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/")
echo "/  -> $code"
if command -v jq >/dev/null 2>&1; then
  DEPLOY_ID=$(npx wrangler pages deployment list --project-name="${PROJECT}" --format=json | jq -r '.[0].id' 2>/dev/null || true)
  [ -n "$DEPLOY_ID" ] && timeout 20s npx wrangler pages deployment tail --project-name="${PROJECT}" --deployment-id="${DEPLOY_ID}" || true
fi

echo
if [ "$code" = "200" ]; then
  echo "✅ SAFE MODE OK (200). O 500 vinha de algum import/estilo/middleware/layout original."
  echo "Próximo: reativar layout real por partes. Diga 'reativar' que eu mando o script de reintrodução gradual."
else
  echo "❌ Ainda 500 no SAFE MODE. Isso aponta para ambiente/config (não para seu código)."
  echo "Verifique no painel do Pages se o deploy aponta functions e se há erros de inicialização do worker."
fi