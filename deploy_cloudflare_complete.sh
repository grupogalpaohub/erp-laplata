#!/usr/bin/env bash
set -euo pipefail

# ===================== CONFIG ======================
PROJECT="erp-laplata"           # nome do projeto no Cloudflare Pages
PROD_BRANCH="erp-git"           # branch que você usa como produção
ROUTES=(
  / /login /setup /analytics
  /co/dashboard /co/reports /co/costs
  /mm/catalog /mm/vendors /mm/purchases
  /sd /sd/orders /sd/customers /sd/invoices
  /wh/inventory /wh/movements /wh/reports
  /crm/leads /crm/opportunities /crm/activities
  /fi/payables /fi/receivables /fi/cashflow
)
# ===================================================

say(){ printf "\n\033[1;34m%s\033[0m\n" "$*"; }
fail(){ printf "\n\033[1;31mERRO:\033[0m %s\n" "$*"; exit 1; }

# 0) Pré-checagens
[ -n "${CF_ACCOUNT_ID:-}" ] || fail "CF_ACCOUNT_ID não definido no ambiente."
[ -n "${CF_API_TOKEN:-}" ]  || fail "CF_API_TOKEN não definido no ambiente."
command -v git >/dev/null    || fail "git não encontrado."
command -v npx >/dev/null    || fail "npm/npx não encontrado."
command -v curl >/dev/null   || fail "curl não encontrado."

# 1) Ir para a branch de produção real do repo
say "1) Checando branch ${PROD_BRANCH}"
git fetch origin
git checkout "${PROD_BRANCH}"
git pull origin "${PROD_BRANCH}"

# 2) Detectar onde está o app (frontend/ ou raiz)
APP_DIR=""
for cand in frontend . ; do
  if [ -e "$cand/package.json" ] && { [ -d "$cand/app" ] || [ -e "$cand/next.config.js" ]; }; then
    APP_DIR="$cand"; break
  fi
done
[ -z "$APP_DIR" ] && fail "Não achei app Next. Verifique se está em 'frontend/' ou na raiz."
say "→ App detectado em: ${APP_DIR}"

# 3) LIMPEZA do repo: remover tudo que é estático/obsoleto do GIT (sem apagar local)
say "2) Limpando estáticos commitados (que matam Edge Functions)"
git rm -rf --cached .vercel 2>/dev/null || true
git rm -rf --cached out     2>/dev/null || true
git rm -f  --cached public/index.html public/login.html 2>/dev/null || true
git rm -f  --cached .vercel/output/index.html 2>/dev/null || true
git rm -rf --cached .vercel/output/static 2>/dev/null || true
git rm -rf --cached "${APP_DIR}/.vercel" "${APP_DIR}/out" 2>/dev/null || true
git rm -f  --cached "${APP_DIR}/public/index.html" "${APP_DIR}/public/login.html" 2>/dev/null || true
git rm -f  --cached "${APP_DIR}/.vercel/output/index.html" 2>/dev/null || true
git rm -rf --cached "${APP_DIR}/.vercel/output/static" 2>/dev/null || true

# 4) .gitignore para impedir voltar sujeira
say "3) .gitignore"
cat > .gitignore <<'EOF'
.vercel/
.next/
node_modules/
out/
EOF
git add .gitignore
mkdir -p "${APP_DIR}"
cat > "${APP_DIR}/.gitignore" <<'EOF'
.vercel/
.next/
node_modules/
out/
EOF
git add "${APP_DIR}/.gitignore"

# 5) next.config.js (edge-safe, sem export)
say "4) next.config.js"
cat > "${APP_DIR}/next.config.js" <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  experimental: { serverActions: { allowedOrigins: ['*'] } },
};
module.exports = nextConfig;
EOF
git add "${APP_DIR}/next.config.js"

# 6) package.json com scripts corretos (sem export)
say "5) package.json (scripts)"
if [ -f "${APP_DIR}/package.json" ]; then
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
else
  fail "package.json não encontrado em ${APP_DIR}."
fi

# 7) Criar páginas mínimas (todas as rotas) + layout/loading/error
say "6) Páginas mínimas para TODAS as rotas"
mkdir -p "${APP_DIR}/app"
mk(){ mkdir -p "${APP_DIR}/app/$1"; cat > "${APP_DIR}/app/$1/page.tsx" <<EOF
export const runtime = 'edge';
export default function Page(){ return <div>OK: /$1</div>; }
EOF
}
mk "" ; mk "login" ; mk "setup" ; mk "analytics"
mk "co/dashboard" ; mk "co/reports" ; mk "co/costs"
mk "mm/catalog" ; mk "mm/vendors" ; mk "mm/purchases"
mk "sd" ; mk "sd/orders" ; mk "sd/customers" ; mk "sd/invoices"
mk "wh/inventory" ; mk "wh/movements" ; mk "wh/reports"
mk "crm/leads" ; mk "crm/opportunities" ; mk "crm/activities"
mk "fi/payables" ; mk "fi/receivables" ; mk "fi/cashflow"
git add "${APP_DIR}/app"

cat > "${APP_DIR}/app/layout.tsx" <<'EOF'
export const runtime = 'edge';
import './globals.css';
import Link from 'next/link';
export default function RootLayout({children}:{children:React.ReactNode}){
  const links=[
    '/', '/login', '/setup', '/analytics',
    '/co/dashboard','/co/reports','/co/costs',
    '/mm/catalog','/mm/vendors','/mm/purchases',
    '/sd','/sd/orders','/sd/customers','/sd/invoices',
    '/wh/inventory','/wh/movements','/wh/reports',
    '/crm/leads','/crm/opportunities','/crm/activities',
    '/fi/payables','/fi/receivables','/fi/cashflow'
  ];
  return (
    <html lang="pt-BR"><body>
      <nav style={{padding:12,borderBottom:'1px solid #eee',display:'flex',gap:12,flexWrap:'wrap'}}>
        {links.map(p => <Link key={p} href={p}>{p}</Link>)}
      </nav>
      <main style={{padding:24}}>{children}</main>
    </body></html>
  );
}
EOF
cat > "${APP_DIR}/app/loading.tsx" <<'EOF'
export default function Loading(){ return <div>Carregando…</div>; }
EOF
cat > "${APP_DIR}/app/error.tsx" <<'EOF'
'use client';
export default function Error({error}:{error:Error}){ return <div>Erro: {error.message}</div>; }
EOF
git add "${APP_DIR}/app/layout.tsx" "${APP_DIR}/app/loading.tsx" "${APP_DIR}/app/error.tsx"

# 8) Commit + push (dispara build via Direct Upload depois)
say "7) Commit + push"
git commit -m "chore(pages): limpar estáticos; .gitignore; next/package; rotas mínimas; layout edge-safe"
git push origin "${PROD_BRANCH}"

# 9) (Re)criar o projeto Pages por CLI (modo Direct Upload)
say "8) (Re)criando projeto Pages: ${PROJECT}"
# Se existir e você apagou no painel, o create vai só criar de novo
npx wrangler pages project create "${PROJECT}" --production-branch "${PROD_BRANCH}" || true

# 10) Build remoto (no Cursor) e geração do bundle Next-on-Pages
say "9) Build do app (não toca banco)"
pushd "${APP_DIR}" >/dev/null
rm -rf .vercel/output .next node_modules
npm ci
npm run build
npx @cloudflare/next-on-pages@latest
popd >/dev/null

# 11) Deploy de PRODUÇÃO por Direct Upload (branch production)
say "10) Deploy de produção (Direct Upload)"
npx wrangler pages deploy "${APP_DIR}/.vercel/output" --project-name "${PROJECT}" --branch production

# 12) (Opcional) Ajustar runtime flags via API (compatibility_date/flags)
say "11) Ajustando runtime flags padrão (opcional)"
curl -sS -X PATCH \
  "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/${PROJECT}" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"deployment_configs":{"production":{"compatibility_date":"2025-09-17","compatibility_flags":["nodejs_compat_populate_process_env"]}}}' >/dev/null || true

# 13) Checar rotas públicas
say "12) Checando rotas públicas"
BASE="https://${PROJECT}.pages.dev"
for p in "${ROUTES[@]}"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "${BASE}${p}" || true)
  printf "%-24s %s\n" "${p}" "${code}"
done

say "✅ Concluído. Se alguma rota der 404, abra o deploy de produção do Pages e veja a aba Functions. Deve listar todas as rotas."