#!/usr/bin/env bash
set -euo pipefail

say(){ printf "\n\033[1;34m%s\033[0m\n" "$*"; }
fail(){ printf "\n\033[1;31mERRO:\033[0m %s\n" "$*"; exit 1; }

APP_DIR="frontend"
BRANCH="erp-git"

git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

[ -d "$APP_DIR/app" ] || fail "Não achei $APP_DIR/app (Root Directory errado?)."

say "1) Garantindo package.json com Next em ${APP_DIR}"
if [ ! -f "$APP_DIR/package.json" ]; then
  cat > "$APP_DIR/package.json" <<'JSON'
{
  "name": "erp-laplata-frontend",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@supabase/supabase-js": "2.45.3",
    "next": "14.2.5",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}
JSON
fi

# Se já existe, garante que tem next/react/react-dom
node - <<'JS'
const fs = require('fs');
const p = './frontend/package.json';
const pkg = JSON.parse(fs.readFileSync(p,'utf8'));
pkg.dependencies = pkg.dependencies || {};
let changed = false;
for (const [k,v] of Object.entries({
  "next":"14.2.5","react":"18.2.0","react-dom":"18.2.0"
})) {
  if (!pkg.dependencies[k]) { pkg.dependencies[k]=v; changed=true; }
}
if (changed) fs.writeFileSync(p, JSON.stringify(pkg, null, 2));
JS

say "2) Garantindo next.config.js simples (sem export)"
if [ ! -f "$APP_DIR/next.config.js" ]; then
  cat > "$APP_DIR/next.config.js" <<'JS'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true }
}
module.exports = nextConfig
JS
fi

say "3) .gitignore básico"
if [ ! -f "$APP_DIR/.gitignore" ]; then
  cat > "$APP_DIR/.gitignore" <<'TXT'
.next
node_modules
.env
TXT
fi

say "4) Install + build local (validação rápida)"
cd "$APP_DIR"
npm ci
npm run build
cd ..

say "5) Commit & push"
git add "$APP_DIR/package.json" "$APP_DIR/next.config.js" "$APP_DIR/.gitignore"
git commit -m "chore(frontend): garantir Next.js config e dependências" || true
git push origin "$BRANCH"

say "✅ Pronto. O Vercel vai buildar a partir do Root Directory 'frontend'."
echo "Se ainda houver erro, confira se os Overrides estão desligados e se a Production Branch = ${BRANCH}."