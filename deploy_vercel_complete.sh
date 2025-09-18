#!/usr/bin/env bash
set -euo pipefail

# ❗ Substitua se seu app estiver na raiz:
APP_DIR="frontend"

# ❗ Seu token do Vercel (você me passou):
VERCEL_TOKEN="nzRv8ZFqBVSocI5z5kDNfy7w"
PROJECT_NAME="erp-laplata"

say(){ printf "\n\033[1;34m%s\033[0m\n" "$*"; }

command -v vercel >/dev/null 2>&1 || npm i -g vercel

say "Autenticando na Vercel (token)…"
export VERCEL_TOKEN
vercel logout || true
vercel login --token "$VERCEL_TOKEN" || true

# ---- Coleta segura dos valores (NÃO ficam no histórico do shell) ----
read -r -p "Digite a NOVA URL do Supabase (ex: https://xxxx.supabase.co): " SUPABASE_URL
read -r -s -p "Cole a NOVA NEXT_PUBLIC_SUPABASE_ANON_KEY: " NEXT_PUBLIC_SUPABASE_ANON_KEY; echo
read -r -s -p "Cole a NOVA SUPABASE_SERVICE_ROLE_KEY (apenas backend): " SUPABASE_SERVICE_ROLE_KEY; echo
read -r -s -p "Cole a NOVA senha do Postgres (se for usar DATABASE_URL no server): " DB_PASSWORD; echo

# Se usa DATABASE_URL no server (API routes/SSR), monte-a com a senha nova aqui:
# Ajuste host/porta/nome do db conforme seu projeto. O supabase pool comum:
DB_URL="postgresql://postgres:${DB_PASSWORD}@aws-1-sa-south-1.pooler.supabase.com:6543/postgres"

say "Configurando variáveis em Production…"
# As que o frontend usa (sempre NEXT_PUBLIC_*):
printf "%s" "$SUPABASE_URL"                | vercel env add NEXT_PUBLIC_SUPABASE_URL production --token "$VERCEL_TOKEN"
printf "%s" "$NEXT_PUBLIC_SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --token "$VERCEL_TOKEN"

# Opcional: duplicamos as públicas como privadas também (server pode ler sem NEXT_PUBLIC)
printf "%s" "$SUPABASE_URL"                | vercel env add SUPABASE_URL production --token "$VERCEL_TOKEN"

# Apenas backend/node (NUNCA use no cliente)
printf "%s" "$SUPABASE_SERVICE_ROLE_KEY"   | vercel env add SUPABASE_SERVICE_ROLE_KEY production --token "$VERCEL_TOKEN"
printf "%s" "$DB_URL"                      | vercel env add DATABASE_URL production --token "$VERCEL_TOKEN"

say "Fazendo deploy (produção)…"
if [ -d "$APP_DIR" ]; then
  vercel --cwd "$APP_DIR" --prod --yes --token "$VERCEL_TOKEN" --name "$PROJECT_NAME"
else
  vercel             --prod --yes --token "$VERCEL_TOKEN" --name "$PROJECT_NAME"
fi

say "Testando HTTP das rotas principais…"
BASE="https://${PROJECT_NAME}.vercel.app"
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

say "✅ Pronto. Se aparecer 401/403 em páginas com dados, confira policies/RLS e se o cliente está usando a ANON key correta."