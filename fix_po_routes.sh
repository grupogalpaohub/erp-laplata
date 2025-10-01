#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Corrigindo rotas e queries de Purchase Order (PO) -> usar mm_order/vendor_id (schema real)…"

# 1) Guardrails básicos
[ -d .git ] || { echo "❌ Rode no raiz do repo (não encontrei .git)"; exit 1; }
[ -d app ]  || { echo "❌ Pasta app/ não encontrada"; exit 1; }

# Função utilitária sed cross-platform (Linux/macOS)
sed_i () {
  # GNU sed vs BSD sed
  if sed --version >/dev/null 2>&1; then
    sed -i "$@"
  else
    sed -i '' "$@"
  fi
}

# 2) Renomear rotas dinâmicas [po_id] -> [mm_order] (páginas e APIs)
rename_dynamic_route () {
  local from="$1"  # ex: app/(protected)/mm/purchases/[po_id]
  local to="$2"    # ex: app/(protected)/mm/purchases/[mm_order]
  if [ -d "$from" ] && [ ! -d "$to" ]; then
    echo "➡️  mv $from  ->  $to"
    git mv "$from" "$to" || mv "$from" "$to"
  fi
}

# Páginas
rename_dynamic_route "app/(protected)/mm/purchases/[po_id]" "app/(protected)/mm/purchases/[mm_order]"
rename_dynamic_route "app/mm/purchases/[po_id]"            "app/mm/purchases/[mm_order]"

# APIs
rename_dynamic_route "app/api/mm/purchase-orders/[po_id]"  "app/api/mm/purchase-orders/[mm_order]"
rename_dynamic_route "pages/api/mm/purchase-orders/[po_id]" "pages/api/mm/purchase-orders/[mm_order]" || true

# 3) Ajustar código: params, fetches e filtros (po_id -> mm_order) + vendor_id
echo "📝 Atualizando código (po_id -> mm_order; supplier_id -> vendor_id)…"

# a) Em arquivos de página e API que referenciam o param
rg --no-messages -l "params:\s*{[^}]*po_id" app 2>/dev/null | while read -r f; do
  echo "  • params em: $f"
  sed_i "s/params:\s*{[^}]*po_id/params: { mm_order/g" "$f"
done

rg --no-messages -l "\bpo_id\b" app 2>/dev/null | while read -r f; do
  # trocar variável de uso comum
  sed_i "s/\bpo_id\b/mm_order/g" "$f"
done

# b) Endpoints/fetch URL que usam po_id no caminho
rg --no-messages -l "/purchase-orders/\\\[po_id\\\]" app 2>/dev/null | while read -r f; do
  echo "  • rota api em: $f"
  sed_i "s/\\/purchase-orders\\/\\[po_id\\]/\\/purchase-orders\\/\\[mm_order\\]/g" "$f"
done

# c) Filtros Supabase que usam 'po_id'
rg --no-messages -l "\\.eq\\(['\"]po_id['\"]" app 2>/dev/null | while read -r f; do
  echo "  • filtro eq('po_id') em: $f"
  sed_i "s/\\.eq(['\"]po_id['\"]/\\.eq('mm_order'/g" "$f"
done

# d) Seleções de tabela: garantir nomes corretos
#    Tabela do header: mm_purchase_order (colunas: mm_order, vendor_id, status, order_date/po_date, total_cents…)
rg --no-messages -l "from\\(['\"][^'\"]*purchase_order[s]?['\"]" app 2>/dev/null | while read -r f; do
  echo "  • from(*) em: $f"
  sed_i "s/from(['\"][^'\"]*purchase_order[s]?['\"]/from('mm_purchase_order')/g" "$f"
done

#    Tabela de itens: mm_purchase_order_item (coluna chave mm_order)
rg --no-messages -l "from\\(['\"][^'\"]*purchase_order_item[s]?['\"]" app 2>/dev/null | while read -r f; do
  echo "  • from(items) em: $f"
  sed_i "s/from(['\"][^'\"]*purchase_order_item[s]?['\"]/from('mm_purchase_order_item')/g" "$f"
done

# e) Campos que não existem no schema: supplier_id -> vendor_id
rg --no-messages -l "\\bsupplier_id\\b" app 2>/dev/null | while read -r f; do
  echo "  • supplier_id -> vendor_id em: $f"
  sed_i "s/\\bsupplier_id\\b/vendor_id/g" "$f"
done

# 4) Opcional: criar fallback nas páginas que faziam fetch client-side para a nova API
#    Substituir fetch('/api/mm/purchase-orders/${po_id}') -> fetch('/api/mm/purchase-orders/${mm_order}')
rg --no-messages -l "purchase-orders/\\$\\{po_id\\}" app 2>/dev/null | while read -r f; do
  echo "  • template string po_id -> mm_order em: $f"
  sed_i "s/purchase-orders\\/\\\${po_id}/purchase-orders\\/\\\${mm_order}/g" "$f"
done

# 5) Limpar cache do Next.js (seguro)
if [ -d .next ]; then
  echo "🧹 Limpando .next/ (cache)…"
  rm -rf .next
fi

echo "✅ Concluído. Suba o dev server novamente (p.ex. npm run dev)."
echo "   Teste: /mm/purchases/PO-2025-001  (existe no dump) 😉"

