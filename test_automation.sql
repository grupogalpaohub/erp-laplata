-- =====================================================
-- SCRIPT DE TESTE DA AUTOMAÇÃO
-- Execute após aplicar o script principal
-- =====================================================

-- 1. Verificar se as funções foram criadas
SELECT 
  routine_name, 
  routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
  'post_inventory_movement',
  'fi_post_purchase_receipt',
  'fi_post_sales_shipment',
  'refresh_mrp',
  'next_doc_number'
)
ORDER BY routine_name;

-- 2. Verificar se os triggers foram criados
SELECT 
  trigger_name, 
  event_object_table, 
  action_timing, 
  event_manipulation
FROM information_schema.triggers 
WHERE trigger_name IN (
  'trg_mm_receiving_after',
  'trg_sd_order_reserve',
  'trg_sd_shipment_issue'
)
ORDER BY event_object_table;

-- 3. Verificar se a tabela MRP foi criada
SELECT 
  table_name, 
  column_name, 
  data_type
FROM information_schema.columns 
WHERE table_name = 'wh_mrp_suggestion'
ORDER BY ordinal_position;

-- 4. Testar a função de movimentação de estoque
SELECT post_inventory_movement(
  'LaplataLunaria',
  'WH-001',
  'B_175',
  5,
  'test_movement',
  'test_table',
  'test_id'
);

-- 5. Verificar se a movimentação foi registrada
SELECT 
  ledger_id,
  tenant_id,
  plant_id,
  sku,
  qty_delta,
  reason,
  ref_table,
  ref_id,
  moved_at
FROM wh_inventory_ledger 
WHERE tenant_id = 'LaplataLunaria' 
AND sku = 'B_175'
ORDER BY moved_at DESC
LIMIT 5;

-- 6. Verificar se o saldo foi atualizado
SELECT 
  tenant_id,
  plant_id,
  mm_material,
  on_hand_qty,
  reserved_qty,
  updated_at
FROM wh_inventory_balance 
WHERE tenant_id = 'LaplataLunaria' 
AND mm_material = 'B_175';

-- 7. Testar MRP
SELECT refresh_mrp('LaplataLunaria', 30);

-- 8. Verificar sugestões MRP
SELECT 
  tenant_id,
  plant_id,
  sku,
  daily_avg,
  lead_time_days,
  safety_stock,
  target_month_qty,
  snapshot_at
FROM wh_mrp_suggestion 
WHERE tenant_id = 'LaplataLunaria'
ORDER BY snapshot_at DESC
LIMIT 10;

-- 9. Verificar recebimentos existentes
SELECT 
  recv_id,
  mm_order,
  mm_material,
  qty_received,
  status,
  received_at
FROM mm_receiving 
WHERE tenant_id = 'LaplataLunaria'
ORDER BY received_at DESC
LIMIT 5;

-- 10. Verificar movimentações geradas pelos recebimentos
SELECT 
  l.ledger_id,
  l.sku,
  l.qty_delta,
  l.reason,
  l.ref_table,
  l.ref_id,
  l.moved_at,
  r.mm_order,
  r.qty_received
FROM wh_inventory_ledger l
LEFT JOIN mm_receiving r ON r.recv_id::text = l.ref_id
WHERE l.tenant_id = 'LaplataLunaria'
AND l.reason = 'purchase_receive'
ORDER BY l.moved_at DESC
LIMIT 10;

SELECT 'Teste de automação concluído!' as status;
