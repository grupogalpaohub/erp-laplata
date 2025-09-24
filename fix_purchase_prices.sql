-- ========================================
-- Fix Purchase Prices - Update mm_material with purchase prices from PO items
-- ========================================

-- Atualizar preços de compra baseado nos itens do pedido PO-2025-001
UPDATE mm_material 
SET mm_purchase_price_cents = po_item.unit_cost_cents
FROM mm_purchase_order_item po_item
WHERE mm_material.mm_material = po_item.mm_material
  AND mm_material.tenant_id = 'LaplataLunaria'
  AND po_item.tenant_id = 'LaplataLunaria'
  AND po_item.mm_order = 'PO-2025-001';

-- Verificar os resultados
SELECT 
  mm_material,
  mm_comercial,
  mm_price_cents,
  mm_purchase_price_cents,
  ROUND(mm_price_cents::numeric / 100, 2) as preco_venda_reais,
  ROUND(mm_purchase_price_cents::numeric / 100, 2) as preco_compra_reais
FROM mm_material 
WHERE tenant_id = 'LaplataLunaria'
ORDER BY mm_material
LIMIT 10;
