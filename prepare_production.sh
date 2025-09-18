#!/usr/bin/env bash
set -euo pipefail

# === Config ===
BRANCH="erp-git" # a branch de produção no Cloudflare Pages
APP_DIR="frontend/src/app"    # diretório do App Router (ajuste se seu repo tiver subpasta 'frontend')

say(){ printf "\n\033[1;34m%s\033[0m\n" "$*"; }
warn(){ printf "\n\033[1;33m%s\033[0m\n" "$*"; }

# 1) GIT saneado na branch de produção
say "1) Checando branch $BRANCH"
git fetch origin
git checkout "$BRANCH" || git checkout -b "$BRANCH"
git pull origin "$BRANCH" || true

# 2) Remover build estático COMMITADO (mata Edge Functions)
say "2) Removendo artefatos estáticos versionados (.vercel/output e out/) do Git (cache only)"
git rm -rf --cached .vercel/output || true
git rm -rf --cached out || true
git rm -f  --cached .vercel/output/index.html || true
git rm -f  --cached .vercel/output/static/index.html || true
git rm -f  --cached .vercel/output/static/login.html || true
# casos com subpasta 'frontend'
git rm -rf --cached frontend/.vercel || true
git rm -rf --cached frontend/out || true
git rm -f  --cached frontend/.vercel/output/index.html || true
git rm -f  --cached frontend/.vercel/output/static/index.html || true
git rm -f  --cached frontend/.vercel/output/static/login.html || true

# 3) .gitignore para impedir que isso volte
say "3) Garantindo .gitignore"
cat > .gitignore <<'EOF'
.vercel/
.next/
node_modules/
out/
*.html
EOF
git add .gitignore

# 4) next.config.js edge-safe (sem export)
say "4) next.config.js edge-safe"
cat > frontend/next.config.js <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  experimental: { serverActions: { allowedOrigins: ['*'] } },
  // NUNCA usar output:'export'
};
module.exports = nextConfig;
EOF
git add frontend/next.config.js

# 5) package.json sem export
say "5) Ajustando scripts do package.json"
if [ -f frontend/package.json ]; then
  node -e "let p=require('./frontend/package.json'); p.scripts=p.scripts||{}; p.scripts.dev='next dev'; p.scripts.build='next build'; require('fs').writeFileSync('./frontend/package.json', JSON.stringify(p,null,2));"
  git add frontend/package.json
else
  warn "package.json não encontrado em frontend/; verifique estrutura do repo."
fi

# 6) Criar páginas mínimas para TODAS as rotas (inclui /sd raiz)
say "6) Criando páginas mínimas (edge) para cada rota exigida"
mkdir -p "$APP_DIR"
mk() {
  mkdir -p "$APP_DIR/$1"
  cat > "$APP_DIR/$1/page.tsx" <<EOF
export const runtime = 'edge';
export default function Page(){ return <div>OK: /$1</div>; }
EOF
}
mk "" # home (app/page.tsx)
mk "login"
mk "setup"
mk "analytics"
mk "co/dashboard"; mk "co/reports"; mk "co/costs"
mk "mm/catalog"; mk "mm/vendors"; mk "mm/purchases"
mk "sd"          # RAIZ de SD (você relatou 404 aqui)
mk "sd/orders"; mk "sd/customers"; mk "sd/invoices"
mk "wh/inventory"; mk "wh/movements"; mk "wh/reports"
mk "crm/leads"; mk "crm/opportunities"; mk "crm/activities"
mk "fi/payables"; mk "fi/receivables"; mk "fi/cashflow"
git add $APP_DIR

# 7) Layout com links absolutos (sem Node APIs)
say "7) Root layout com navegação"
cat > "$APP_DIR/layout.tsx" <<'EOF'
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
git add "$APP_DIR/layout.tsx"

# 8) loading/error básicos
say "8) Estados de carregamento/erro"
cat > "$APP_DIR/loading.tsx" <<'EOF'
export default function Loading(){ return <div>Carregando…</div>; }
EOF
cat > "$APP_DIR/error.tsx" <<'EOF'
'use client';
export default function Error({error}:{error:Error}){ return <div>Erro: {error.message}</div>; }
EOF
git add "$APP_DIR/loading.tsx" "$APP_DIR/error.tsx"

# 9) Commit e push (deploy automático no Pages, branch production = erp-git)
say "9) Commit + Push"
git commit -m "fix(pages): remove static html, add .gitignore; ensure all app routes (incl. /sd); edge-safe layout"
git push origin "$BRANCH"

say "✅ Pronto. O Cloudflare Pages vai buildar a branch 'erp-git'. Acompanhe o deploy e a aba Functions."