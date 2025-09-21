-- =====================================================
-- PARTE 4: SISTEMA MRP
-- Execute esta parte após as Partes 1, 2 e 3
-- =====================================================

-- 1. Tabela MRP
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

-- 2. Função MRP
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

-- 3. RLS para wh_mrp_suggestion
ALTER TABLE wh_mrp_suggestion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wh_mrp_suggestion_tenant_policy" ON wh_mrp_suggestion
  FOR ALL USING (tenant_id = current_setting('app.current_tenant', true));

SELECT 'Parte 4 executada com sucesso!' as status;
