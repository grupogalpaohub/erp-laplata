-- =====================================================
-- AUTOMAÇÃO DE ESTOQUE E FINANCEIRO
-- =====================================================

-- 1. Função unificada de movimentação de estoque
CREATE OR REPLACE FUNCTION post_inventory_movement(
  p_tenant TEXT,
  p_plant_id TEXT,
  p_sku TEXT,
  p_qty_delta INTEGER,
  p_reason TEXT,           -- 'purchase_receive' | 'so_reserve' | 'so_release' | 'shipment' | ...
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

-- 2. Função FI para recebimentos de compra
CREATE OR REPLACE FUNCTION fi_post_purchase_receipt(
  p_tenant TEXT, 
  p_mm_order TEXT, 
  p_recv_id TEXT
) RETURNS VOID AS $$
DECLARE
  v_vendor_id TEXT;
  v_total_cents BIGINT;
BEGIN
  -- Buscar dados do pedido e recebimento
  SELECT 
    po.vendor_id, 
    COALESCE(SUM(ri.qty_received * COALESCE(poi.unit_cost_cents, 0)), 0)
  INTO v_vendor_id, v_total_cents
  FROM mm_purchase_order po
  JOIN mm_receiving ri ON ri.tenant_id = po.tenant_id AND ri.mm_order = po.mm_order
  LEFT JOIN mm_purchase_order_item poi ON poi.tenant_id = po.tenant_id AND poi.mm_order = po.mm_order AND poi.mm_material = ri.mm_material
  WHERE po.tenant_id = p_tenant AND po.mm_order = p_mm_order
  GROUP BY po.vendor_id;

  -- Criar fatura do fornecedor se não existir
  INSERT INTO fi_invoice(
    tenant_id, 
    invoice_id, 
    partner_id, 
    direction, 
    amount_cents, 
    currency, 
    ref_table, 
    ref_id, 
    status
  )
  VALUES (
    p_tenant, 
    next_doc_number(p_tenant,'INV'), 
    v_vendor_id, 
    'AP', 
    v_total_cents, 
    'BRL', 
    'mm_receiving', 
    p_recv_id, 
    'open'
  )
  ON CONFLICT DO NOTHING;

  -- Transação contábil
  INSERT INTO fi_transaction(
    tenant_id, 
    trx_id, 
    trx_date, 
    description, 
    amount_cents, 
    direction, 
    ref_table, 
    ref_id
  )
  VALUES (
    p_tenant, 
    next_doc_number(p_tenant,'TRX'), 
    NOW(),
    'MM Receive '||p_mm_order||'/'||p_recv_id, 
    v_total_cents, 
    'AP', 
    'mm_receiving', 
    p_recv_id
  );
END;
$$ LANGUAGE plpgsql;

-- 3. Trigger para recebimentos de compra
CREATE OR REPLACE FUNCTION trg_mm_receiving_post()
RETURNS TRIGGER AS $$
BEGIN
  -- Quando status muda para 'received' ou 'completed'
  IF NEW.status IN ('received','completed') AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    -- Entrada de estoque
    PERFORM post_inventory_movement(
      NEW.tenant_id, 
      NEW.plant_id, 
      NEW.mm_material, 
      NEW.qty_received,
      'purchase_receive', 
      'mm_receiving', 
      NEW.recv_id::text
    );

    -- Lançamento financeiro
    PERFORM fi_post_purchase_receipt(NEW.tenant_id, NEW.mm_order, NEW.recv_id::text);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger
DROP TRIGGER IF EXISTS trg_mm_receiving_after ON mm_receiving;
CREATE TRIGGER trg_mm_receiving_after
AFTER INSERT OR UPDATE OF status ON mm_receiving
FOR EACH ROW EXECUTE FUNCTION trg_mm_receiving_post();

-- 4. Função FI para vendas
CREATE OR REPLACE FUNCTION fi_post_sales_shipment(
  p_tenant TEXT, 
  p_so_id TEXT, 
  p_ship_id TEXT
) RETURNS VOID AS $$
DECLARE 
  v_total BIGINT;
  v_customer_id TEXT;
BEGIN
  -- Buscar total e cliente
  SELECT 
    COALESCE(total_final_cents, 0),
    customer_id
  INTO v_total, v_customer_id
  FROM sd_sales_order
  WHERE tenant_id = p_tenant AND so_id = p_so_id;

  -- Fatura do cliente (AR)
  INSERT INTO fi_invoice(
    tenant_id, 
    invoice_id, 
    partner_id, 
    direction, 
    amount_cents, 
    currency, 
    ref_table, 
    ref_id, 
    status
  )
  VALUES (
    p_tenant, 
    next_doc_number(p_tenant,'INV'), 
    v_customer_id, 
    'AR', 
    v_total, 
    'BRL', 
    'sd_shipment', 
    p_ship_id, 
    'open'
  )
  ON CONFLICT DO NOTHING;

  -- Transação contábil
  INSERT INTO fi_transaction(
    tenant_id, 
    trx_id, 
    trx_date, 
    description, 
    amount_cents, 
    direction, 
    ref_table, 
    ref_id
  )
  VALUES (
    p_tenant, 
    next_doc_number(p_tenant,'TRX'), 
    NOW(),
    'SD Shipment '||p_so_id||'/'||p_ship_id, 
    v_total, 
    'AR', 
    'sd_shipment', 
    p_ship_id
  );
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger para reserva de estoque em pedidos de venda
CREATE OR REPLACE FUNCTION trg_sd_order_reserve()
RETURNS TRIGGER AS $$
DECLARE 
  r record;
BEGIN
  -- Quando status muda para 'confirmed'
  IF NEW.status = 'confirmed' AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    -- Reservar cada item
    FOR r IN
      SELECT 
        tenant_id, 
        plant_id, 
        mm_material as sku, 
        quantity
      FROM sd_sales_order_item
      WHERE tenant_id = NEW.tenant_id AND so_id = NEW.so_id
    LOOP
      PERFORM post_inventory_movement(
        NEW.tenant_id, 
        r.plant_id, 
        r.sku, 
        r.quantity,
        'so_reserve', 
        'sd_sales_order', 
        NEW.so_id::text
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger
DROP TRIGGER IF EXISTS trg_sd_order_reserve ON sd_sales_order;
CREATE TRIGGER trg_sd_order_reserve
AFTER UPDATE OF status ON sd_sales_order
FOR EACH ROW EXECUTE FUNCTION trg_sd_order_reserve();

-- 6. Trigger para baixa de estoque em expedições
CREATE OR REPLACE FUNCTION trg_sd_shipment_issue()
RETURNS TRIGGER AS $$
DECLARE 
  r record;
BEGIN
  -- Quando status muda para 'complete' ou 'shipped'
  IF NEW.status IN ('complete','shipped') AND (OLD.status IS DISTINCT FROM NEW.status) THEN
    -- Baixar cada item
    FOR r IN
      SELECT 
        i.tenant_id, 
        i.plant_id, 
        i.mm_material as sku, 
        i.quantity
      FROM sd_sales_order_item i
      WHERE i.tenant_id = NEW.tenant_id AND i.so_id = NEW.so_id
    LOOP
      -- Baixa on_hand (negativo)
      PERFORM post_inventory_movement(
        NEW.tenant_id, 
        r.plant_id, 
        r.sku, 
        -r.quantity, 
        'shipment', 
        'sd_shipment', 
        NEW.shipment_id::text
      );
      
      -- Libera reservado (negativo do reservado)
      PERFORM post_inventory_movement(
        NEW.tenant_id, 
        r.plant_id, 
        r.sku, 
        -r.quantity, 
        'so_release', 
        'sd_shipment', 
        NEW.shipment_id::text
      );
    END LOOP;

    -- Lançamento financeiro
    PERFORM fi_post_sales_shipment(NEW.tenant_id, NEW.so_id::text, NEW.shipment_id::text);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger
DROP TRIGGER IF EXISTS trg_sd_shipment_issue ON sd_shipment;
CREATE TRIGGER trg_sd_shipment_issue
AFTER UPDATE OF status ON sd_shipment
FOR EACH ROW EXECUTE FUNCTION trg_sd_shipment_issue();

-- 7. Tabela MRP
CREATE TABLE IF NOT EXISTS wh_mrp_suggestion(
  tenant_id TEXT NOT NULL,
  plant_id TEXT NOT NULL,
  sku TEXT NOT NULL,
  snapshot_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  daily_avg NUMERIC(12,4) NOT NULL,
  lead_time_days INTEGER NOT NULL,
  safety_stock INTEGER NOT NULL,
  target_month_qty INTEGER NOT NULL,
  PRIMARY KEY (tenant_id, plant_id, sku, snapshot_at)
);

-- 8. Função MRP
CREATE OR REPLACE FUNCTION refresh_mrp(p_tenant TEXT, p_days INT DEFAULT 60)
RETURNS VOID AS $$
INSERT INTO wh_mrp_suggestion(
  tenant_id, 
  plant_id, 
  sku, 
  snapshot_at, 
  daily_avg, 
  lead_time_days, 
  safety_stock, 
  target_month_qty
)
SELECT
  m.tenant_id,
  COALESCE(b.plant_id, 'WH-001') as plant_id,
  m.mm_material as sku,
  NOW(),
  COALESCE(o.qty_sum / GREATEST(p_days,1), 0) AS daily_avg,
  COALESCE(m.lead_time_days, 0) as lead_time_days,
  GREATEST(
    CEIL((COALESCE(o.qty_sum / GREATEST(p_days,1),0)) * (COALESCE(m.lead_time_days, 0) + 10)), 
    COALESCE(m.min_stock, 0)
  ) AS safety_stock,
  CEIL(COALESCE(o.qty_sum / GREATEST(p_days,1),0) * 30) + 
  GREATEST(
    CEIL((COALESCE(o.qty_sum / GREATEST(p_days,1),0)) * (COALESCE(m.lead_time_days, 0) + 10)), 
    COALESCE(m.min_stock, 0)
  ) AS target_month_qty
FROM mm_material m
LEFT JOIN (
  SELECT 
    tenant_id, 
    mm_material as sku, 
    SUM(quantity)::numeric AS qty_sum
  FROM sd_sales_order_item
  WHERE order_date >= CURRENT_DATE - (p_days || ' days')::interval
  GROUP BY tenant_id, mm_material
) o ON o.tenant_id = m.tenant_id AND o.sku = m.mm_material
LEFT JOIN wh_inventory_balance b
  ON b.tenant_id = COALESCE(o.tenant_id, m.tenant_id) AND b.mm_material = m.mm_material
WHERE m.tenant_id = p_tenant;
$$ LANGUAGE sql;

-- 9. RLS para wh_mrp_suggestion
ALTER TABLE wh_mrp_suggestion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wh_mrp_suggestion_tenant_policy" ON wh_mrp_suggestion
  FOR ALL USING (tenant_id = current_setting('app.current_tenant', true));

-- 10. Processar dados existentes (backfill)
-- Executar movimentações para recebimentos já existentes
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT tenant_id, plant_id, mm_material, qty_received, recv_id, mm_order
    FROM mm_receiving
    WHERE status IN ('received', 'completed')
  LOOP
    PERFORM post_inventory_movement(
      r.tenant_id,
      r.plant_id,
      r.mm_material,
      r.qty_received,
      'purchase_receive',
      'mm_receiving',
      r.recv_id::text
    );
  END LOOP;
END $$;
