#!/usr/bin/env bash
set -euo pipefail

echo "=== [1] Checando ambiente Node/Next ==="
node -v
npm -v
npx envinfo --system --binaries --npmPackages next,supabase-js

echo "=== [2] Validando variáveis de ambiente ==="
for var in NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY DATABASE_URL
do
  if [ -z "${!var:-}" ]; then
    echo "❌ Variável faltando: $var"
    exit 1
  else
    echo "✅ $var presente"
  fi
done

echo "=== [3] Testando build do Next.js ==="
cd frontend
npm run build || { echo "❌ Build falhou"; exit 1; }
echo "✅ Build ok"

echo "=== [4] Testando conexão com Supabase ==="
cat > supabase_test.mjs <<'EOF'
import { createClient } from "@supabase/supabase-js";

const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const test = async () => {
  const { data, error } = await client.from("mm_material").select("sku").limit(1);
  if (error) {
    console.error("❌ Erro Supabase:", error.message);
    process.exit(1);
  } else {
    console.log("✅ Supabase respondeu:", data);
    process.exit(0);
  }
};
test();
EOF

node supabase_test.mjs
rm supabase_test.mjs

echo "=== [5] Health-check final ==="
echo "🎉 Ambiente verificado com sucesso!"