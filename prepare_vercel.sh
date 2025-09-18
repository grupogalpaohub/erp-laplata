#!/usr/bin/env bash
set -euo pipefail

say(){ printf "\n\033[1;34m%s\033[0m\n" "$*"; }
fail(){ printf "\n\033[1;31mERRO:\033[0m %s\n" "$*"; exit 1; }

PROD_BRANCH="erp-git"
APP_DIR=""

# 1) Branch e detecção do app
git fetch origin
git checkout "${PROD_BRANCH}"
git pull origin "${PROD_BRANCH}"

for cand in frontend . ; do
  if [ -f "$cand/package.json" ] && [ -d "$cand/app" ]; then APP_DIR="$cand"; break; fi
done
[ -z "$APP_DIR" ] && fail "Não achei app Next (package.json + app/)."

say "→ App em: ${APP_DIR}"

# 2) Remover vestígios do Cloudflare do repo (sem apagar seu código de app)
git rm -rf --cached .vercel "${APP_DIR}/.vercel" out "${APP_DIR}/out" 2>/dev/null || true
git rm -f  --cached _worker.js "${APP_DIR}/_worker.js" 2>/dev/null || true
git rm -f  --cached public/index.html public/login.html "${APP_DIR}/public/index.html" "${APP_DIR}/public/login.html" 2>/dev/null || true
rm -rf .vercel .next "${APP_DIR}/.vercel" "${APP_DIR}/.next" 2>/dev/null || true

# 3) .gitignore adequado p/ Vercel
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

# 4) Normalizar next.config e package.json para build padrão
if [ -f "${APP_DIR}/next.config.js" ]; then
  # remove qualquer output:'export'
  sed -E 's/output\s*:\s*["'\'']export["'\'']\s*,?//g' -i "${APP_DIR}/next.config.js" || true
fi

# package.json: garantir scripts corretos e remover next-on-pages
node - <<'NODE' "${APP_DIR}/package.json" > "${APP_DIR}/package.json.tmp"
const fs=require('fs'), p=process.argv[2];
const j=JSON.parse(fs.readFileSync(p,'utf8'));
j.scripts=j.scripts||{};
j.scripts.dev="next dev";
j.scripts.build="next build";
if (j.devDependencies && j.devDependencies['@cloudflare/next-on-pages']) delete j.devDependencies['@cloudflare/next-on-pages'];
if (j.dependencies   && j.dependencies['@cloudflare/next-on-pages'])   delete j.dependencies['@cloudflare/next-on-pages'];
fs.writeFileSync(p+".tmp", JSON.stringify(j,null,2));
NODE
mv "${APP_DIR}/package.json.tmp" "${APP_DIR}/package.json"
git add "${APP_DIR}/package.json" || true

# 5) Trocar runtime das páginas para Node.js (temporário, só p/ estabilizar no Vercel)
# remove linhas 'export const runtime = "edge"' nos pages/route handlers
find "${APP_DIR}/app" -type f \( -name "page.*" -o -name "route.*" -o -name "layout.*" \) \
  -exec sed -i -E 's/export\s+const\s+runtime\s*=\s*["'\'']edge["'\'']\s*;?//g' {} +

git add "${APP_DIR}/app" || true

# 6) Commit
git commit -m "chore(vercel): preparar build padrão; remover next-on-pages; runtime Node.js para estabilizar" || true
git push origin "${PROD_BRANCH}"

say "✅ Repo pronto para Vercel."
echo
echo "PRÓXIMO PASSO (no painel da Vercel):"
echo "1) New Project → Importar do GitHub → repo do ERP → Branch: ${PROD_BRANCH}"
echo "2) Build Command:  npm run build"
echo "   Output Directory: (em branco)  # Vercel detecta Next automaticamente"
echo "   Root Directory:   ${APP_DIR}   # se seu app estiver em 'frontend'; deixe vazio se estiver na raiz"
echo "3) Variáveis de ambiente (Production):"
echo "   NEXT_PUBLIC_SUPABASE_URL      = <sua URL do Supabase>"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY = <sua anon key>"
echo "4) Deploy."
echo
echo "Dica: se algo acusar import de Node no server, agora no Vercel o runtime é Node.js → deve funcionar."