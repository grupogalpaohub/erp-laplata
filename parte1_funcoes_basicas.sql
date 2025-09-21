-- =====================================================
-- PARTE 1: FUNÇÕES BÁSICAS
-- Execute esta parte primeiro no Supabase Dashboard
-- =====================================================

-- 1. Função para gerar números de documento
CREATE OR REPLACE FUNCTION next_doc_number(p_tenant TEXT, p_type TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN p_type || '-' || EXTRACT(EPOCH FROM NOW())::BIGINT;
END;
$$ LANGUAGE plpgsql;

-- 2. Função unificada de movimentação de estoque
CREATE OR REPLACE FUNCTION post_inventory_movement(
  p_tenant TEXT,
  p_plant_id TEXT,
  p_sku TEXT,
  p_qty_delta INTEGER,
  p_reason TEXT,
  p_ref_table TEXT,
  p_ref_id TEXT
) RETURNS VOID AS $$
BEGIN
  -- Inserir no ledger
  INSERT INTO wh_inventory_ledger(
    tenant_id, 
    plant_id, 
    sku, 
    qty_delta, 
    reason, 
    ref_table, 
    ref_id, 
    moved_at
  )
  VALUES (
    p_tenant, 
    p_plant_id, 
    p_sku, 
    p_qty_delta, 
    p_reason, 
    p_ref_table, 
    p_ref_id, 
    NOW()
  );

  -- Atualizar balance (UPSERT)
  INSERT INTO wh_inventory_balance(
    tenant_id, 
    plant_id, 
    mm_material, 
    on_hand_qty, 
    reserved_qty
  )
  VALUES (
    p_tenant, 
    p_plant_id, 
    p_sku,
    CASE WHEN p_reason IN ('purchase_receive','shipment_return') THEN p_qty_delta ELSE 0 END,
    CASE WHEN p_reason IN ('so_reserve','so_release') THEN p_qty_delta ELSE 0 END
  )
  ON CONFLICT (tenant_id, plant_id, mm_material)
  DO UPDATE SET
    on_hand_qty = wh_inventory_balance.on_hand_qty
      + CASE WHEN EXCLUDED.on_hand_qty <> 0 THEN EXCLUDED.on_hand_qty ELSE 0 END,
    reserved_qty = wh_inventory_balance.reserved_qty
      + CASE WHEN EXCLUDED.reserved_qty <> 0 THEN EXCLUDED.reserved_qty ELSE 0 END,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- 3. Adicionar campos necessários se não existirem
DO $$
BEGIN
  -- Adicionar updated_at em wh_inventory_balance
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'wh_inventory_balance' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE wh_inventory_balance ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
  
  -- Adicionar campos em mm_material
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mm_material' 
    AND column_name = 'lead_time_days'
  ) THEN
    ALTER TABLE mm_material ADD COLUMN lead_time_days INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mm_material' 
    AND column_name = 'min_stock'
  ) THEN
    ALTER TABLE mm_material ADD COLUMN min_stock INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mm_material' 
    AND column_name = 'max_stock'
  ) THEN
    ALTER TABLE mm_material ADD COLUMN max_stock INTEGER DEFAULT 0;
  END IF;
END $$;

SELECT 'Parte 1 executada com sucesso!' as status;
