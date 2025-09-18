#!/usr/bin/env bash
set -euo pipefail

# ======================== CONFIG =========================
PROD_BRANCH="erp-git"     # branch usada no Cloudflare Pages (Production)
APP_DIR_CANDIDATES=("frontend" ".")  # onde pode estar seu Next app
# =========================================================

say(){ printf "\n\033[1;34m%s\033[0m\n" "$*"; }
warn(){ printf "\n\033[1;33m%s\033[0m\n" "$*"; }
die(){ printf "\n\033[1;31mERRO:\033[0m %s\n" "$*"; exit 1; }

# 0) GIT OK e branch correta
say "0) Garantindo branch de produção: $PROD_BRANCH"
git fetch origin
git checkout "$PROD_BRANCH"
git pull origin "$PROD_BRANCH"

# 1) Detectar diretório do app (frontend/ ou raiz)
APP_DIR=""
for cand in "${APP_DIR_CANDIDATES[@]}"; do
  if [ -e "$cand/package.json" ] && [ -e "$cand/next.config.js" ] || [ -d "$cand/app" ] || [ -d "$cand/pages" ]; then
    APP_DIR="$cand"
    break
  fi
done
[ -z "$APP_DIR" ] && die "Não achei package.json/next.config.js/app/. Verifique onde está seu app (frontend/ ou raiz)."

say "1) Diretório do app detectado: $APP_DIR"

# 2) Remover TUDO que é build/estático do Git (mas sem apagar sua cópia local)
say "2) Removendo artefatos COMMITADOS por engano (static, out, .vercel/output etc.)"
# na raiz
git rm -rf --cached .vercel 2>/dev/null || true
git rm -rf --cached out     2>/dev/null || true
git rm -f  --cached public/index.html public/login.html 2>/dev/null || true
git rm -f  --cached .vercel/output/index.html 2>/dev/null || true
git rm -rf --cached .vercel/output/static 2>/dev/null || true
# no APP_DIR (ex.: frontend)
git rm -rf --cached "$APP_DIR/.vercel" 2>/dev/null || true
git rm -rf --cached "$APP_DIR/out"     2>/dev/null || true
git rm -f  --cached "$APP_DIR/public/index.html" "$APP_DIR/public/login.html" 2>/dev/null || true
git rm -f  --cached "$APP_DIR/.vercel/output/index.html" 2>/dev/null || true
git rm -rf --cached "$APP_DIR/.vercel/output/static" 2>/dev/null || true

# 3) .gitignore para impedir voltar lixo
say "3) Criando/atualizando .gitignore (raiz e no app)"
cat > .gitignore <<'EOF'
.vercel/
.next/
node_modules/
out/
EOF
git add .gitignore

mkdir -p "$APP_DIR"
cat > "$APP_DIR/.gitignore" <<'EOF'
.vercel/
.next/
node_modules/
out/
EOF
git add "$APP_DIR/.gitignore"

# 4) Garantir next.config.js sem export e edge-safe (no APP_DIR)
say "4) next.config.js correto (sem output:'export')"
cat > "$APP_DIR/next.config.js" <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  experimental: { serverActions: { allowedOrigins: ['*'] } },
  // NUNCA usar output:'export'
};
module.exports = nextConfig;
EOF
git add "$APP_DIR/next.config.js"

# 5) Ajustar package.json (sem export; com build padrão)
say "5) package.json scripts (dev/build) corrigidos"
if [ -f "$APP_DIR/package.json" ]; then
  node - <<'NODE' "$APP_DIR/package.json" > "$APP_DIR/package.json.tmp"
const fs = require('fs');
const path = process.argv[2];
const p = JSON.parse(fs.readFileSync(path, 'utf8'));
p.scripts = p.scripts || {};
p.scripts.dev   = 'next dev';
p.scripts.build = 'next build';
fs.writeFileSync(path, JSON.stringify(p,null,2));
NODE
  mv "$APP_DIR/package.json.tmp" "$APP_DIR/package.json"
  git add "$APP_DIR/package.json"
else
  die "package.json não encontrado em $APP_DIR — verifique estrutura."
fi

# 6) Criar todas as rotas mínimas (inclui /sd e /login)
say "6) Criando páginas mínimas (edge) para TODAS as rotas solicitadas"
mkdir -p "$APP_DIR/app"
mk(){ mkdir -p "$APP_DIR/app/$1"; cat > "$APP_DIR/app/$1/page.tsx" <<EOF
export const runtime = 'edge';
export default function Page(){ return <div>OK: /$1</div>; }
EOF
}

# home
mk ""
# login + setup + analytics
mk "login"; mk "setup"; mk "analytics"
# CO
mk "co/dashboard"; mk "co/reports"; mk "co/costs"
# MM
mk "mm/catalog"; mk "mm/vendors"; mk "mm/purchases"
# SD (RAIZ + subrotas)
mk "sd"; mk "sd/orders"; mk "sd/customers"; mk "sd/invoices"
# WH
mk "wh/inventory"; mk "wh/movements"; mk "wh/reports"
# CRM
mk "crm/leads"; mk "crm/opportunities"; mk "crm/activities"
# FI
mk "fi/payables"; mk "fi/receivables"; mk "fi/cashflow"

git add "$APP_DIR/app"

# 7) Layout com navegação (edge-safe)
say "7) Root layout com navegação (links absolutos)"
cat > "$APP_DIR/app/layout.tsx" <<'EOF'
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
git add "$APP_DIR/app/layout.tsx"

# 8) loading/error para evitar tela branca
say "8) loading/error"
cat > "$APP_DIR/app/loading.tsx" <<'EOF'
export default function Loading(){ return <div>Carregando…</div>; }
EOF
cat > "$APP_DIR/app/error.tsx" <<'EOF'
'use client';
export default function Error({error}:{error:Error}){ return <div>Erro: {error.message}</div>; }
EOF
git add "$APP_DIR/app/loading.tsx" "$APP_DIR/app/error.tsx"

# 9) Commit + Push (deploy automático no Pages: Production=erp-git)
say "9) Commit + Push → branch $PROD_BRANCH"
git commit -m "fix(pages): limpar static/out; forçar .gitignore; corrigir next/package; criar rotas mínimas (incl. /sd e /login); layout edge-safe"
git push origin "$PROD_BRANCH"

say "✅ PRONTO. Agora vá ao Cloudflare Pages → 'erp-laplata' → Deployments e acompanhe o Production build."
say "   Depois de publicado, a aba Functions deve listar TODAS as rotas. Teste: /login, /sd, /setup, etc."