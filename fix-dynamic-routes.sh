#!/usr/bin/env bash
set -euo pipefail

HEADER=$'export const dynamic = \'force-dynamic\';\nexport const revalidate = 0;\nexport const fetchCache = \'force-no-store\';\nexport const runtime = \'nodejs\';\n'

echo "▶️ Inserindo flags dinâmicas nas rotas API…"
# Em todas as rotas app/api/**/route.ts|js que AINDA não têm 'force-dynamic'
while IFS= read -r -d '' f; do
  if ! grep -q "export const dynamic = 'force-dynamic'" "$f"; then
    tmp="$(mktemp)"
    printf "%s\n\n" "$HEADER" > "$tmp"
    cat "$f" >> "$tmp"
    mv "$tmp" "$f"
    echo "  ✓ $f"
  fi
done < <(find app/api -type f \( -name 'route.ts' -o -name 'route.js' \) -print0)

echo "▶️ Inserindo flags dinâmicas em páginas/Server Components que usam cookies()/headers()…"
while IFS= read -r -d '' f; do
  if ! grep -q "export const dynamic = 'force-dynamic'" "$f"; then
    # Detecção melhorada: cookies/headers diretos + supabaseServer/getTenantId
    if grep -Eq "from 'next/(headers|cookies)'" "$f" || \
       grep -Eq "\\bcookies\\(|\\bheaders\\(" "$f" || \
       grep -Eq "supabaseServer|getTenantId" "$f"; then
      tmp="$(mktemp)"
      printf "export const dynamic = 'force-dynamic';\nexport const revalidate = 0;\nexport const fetchCache = 'force-no-store';\n\n" > "$tmp"
      cat "$f" >> "$tmp"
      mv "$tmp" "$f"
      echo "  ✓ $f"
    fi
  fi
done < <(find app -type f \( -name '*.tsx' -o -name '*.ts' \) ! -path 'app/api/*' -print0)

echo "✅ Concluído."
