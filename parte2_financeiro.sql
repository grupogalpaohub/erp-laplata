-- =====================================================
-- PARTE 2: FUNÇÕES FINANCEIRAS
-- Execute esta parte após a Parte 1
-- =====================================================

-- 1. Função FI para recebimentos de compra
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

-- 2. Função FI para vendas
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

SELECT 'Parte 2 executada com sucesso!' as status;
