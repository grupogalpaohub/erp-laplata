-- =====================================================
-- PARTE 5: PROCESSAR DADOS EXISTENTES
-- Execute esta parte por último
-- =====================================================

-- Processar recebimentos já existentes
DO $$
DECLARE
  r record;
  processed_count INTEGER := 0;
BEGIN
  FOR r IN
    SELECT tenant_id, plant_id, mm_material, qty_received, recv_id, mm_order
    FROM mm_receiving
    WHERE status IN ('received', 'completed')
  LOOP
    -- Entrada de estoque
    PERFORM post_inventory_movement(
      r.tenant_id,
      r.plant_id,
      r.mm_material,
      r.qty_received,
      'purchase_receive',
      'mm_receiving',
      r.recv_id::text
    );
    
    processed_count := processed_count + 1;
  END LOOP;
  
  RAISE NOTICE 'Processados % recebimentos existentes', processed_count;
END $$;

-- Executar MRP inicial
SELECT refresh_mrp('LaplataLunaria', 60);

-- Verificar resultados
SELECT 
  'Sistema de automação implementado com sucesso!' as status,
  (SELECT COUNT(*) FROM wh_inventory_ledger WHERE tenant_id = 'LaplataLunaria') as movimentacoes_criadas,
  (SELECT COUNT(*) FROM wh_mrp_suggestion WHERE tenant_id = 'LaplataLunaria') as sugestoes_mrp;
