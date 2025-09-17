-- Simple Schema Standardization Migration
-- Focus on essential changes only

-- ========================================
-- 1. Add missing columns for proper functionality
-- ========================================

-- Add commercial_name if it doesn't exist
ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS commercial_name text;

-- Add missing columns to wh_warehouse
ALTER TABLE wh_warehouse ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE wh_warehouse ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE wh_warehouse ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE wh_warehouse ADD COLUMN IF NOT EXISTS zip_code text;
ALTER TABLE wh_warehouse ADD COLUMN IF NOT EXISTS country text DEFAULT 'Brasil';
ALTER TABLE wh_warehouse ADD COLUMN IF NOT EXISTS contact_person text;
ALTER TABLE wh_warehouse ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE wh_warehouse ADD COLUMN IF NOT EXISTS email text;

-- Add missing columns to mm_vendor
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS contact_person text;
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS zip_code text;
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS country text DEFAULT 'Brasil';
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS tax_id text;
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS payment_terms integer DEFAULT 30;
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS rating text DEFAULT 'B';
ALTER TABLE mm_vendor ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Add missing columns to mm_material
ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS unit_of_measure text DEFAULT 'unidade';
ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS weight_grams numeric(10,2);
ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS dimensions text;
ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS purity text;
ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS color text;
ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS finish text;
ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS min_stock integer DEFAULT 0;
ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS max_stock integer DEFAULT 1000;
ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS lead_time_days integer DEFAULT 7;
ALTER TABLE mm_material ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Add missing columns to wh_inventory_balance
ALTER TABLE wh_inventory_balance ADD COLUMN IF NOT EXISTS last_count_date date;
ALTER TABLE wh_inventory_balance ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Add quantity_available as computed column only if the required columns exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wh_inventory_balance' AND column_name = 'quantity_on_hand') 
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wh_inventory_balance' AND column_name = 'quantity_reserved') THEN
        ALTER TABLE wh_inventory_balance ADD COLUMN IF NOT EXISTS quantity_available integer GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED;
    END IF;
END $$;

-- Add missing columns to mm_purchase_order
ALTER TABLE mm_purchase_order ADD COLUMN IF NOT EXISTS total_amount bigint DEFAULT 0;
ALTER TABLE mm_purchase_order ADD COLUMN IF NOT EXISTS currency text DEFAULT 'BRL';
ALTER TABLE mm_purchase_order ADD COLUMN IF NOT EXISTS notes text;

-- Add missing columns to mm_purchase_order_item
ALTER TABLE mm_purchase_order_item ADD COLUMN IF NOT EXISTS currency text DEFAULT 'BRL';
ALTER TABLE mm_purchase_order_item ADD COLUMN IF NOT EXISTS notes text;

-- Add total_price as computed column only if the required columns exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mm_purchase_order_item' AND column_name = 'quantity') 
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mm_purchase_order_item' AND column_name = 'unit_price') THEN
        ALTER TABLE mm_purchase_order_item ADD COLUMN IF NOT EXISTS total_price bigint GENERATED ALWAYS AS (quantity * unit_price) STORED;
    END IF;
END $$;

-- Add missing columns to mm_receiving
ALTER TABLE mm_receiving ADD COLUMN IF NOT EXISTS received_by text;
ALTER TABLE mm_receiving ADD COLUMN IF NOT EXISTS status text DEFAULT 'received';
ALTER TABLE mm_receiving ADD COLUMN IF NOT EXISTS notes text;

-- ========================================
-- 2. Create essential indexes for Free Tier optimization
-- ========================================

-- Purchase Order indexes (only if columns exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mm_purchase_order_item' AND column_name = 'mm_order') THEN
        CREATE INDEX IF NOT EXISTS ix_po_item_order ON mm_purchase_order_item(tenant_id, mm_order);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mm_receiving' AND column_name = 'mm_order') THEN
        CREATE INDEX IF NOT EXISTS ix_receiving_order ON mm_receiving(tenant_id, mm_order);
    END IF;
END $$;

-- Inventory indexes (only if columns exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'wh_inventory_balance' AND column_name = 'sku') THEN
        CREATE INDEX IF NOT EXISTS ix_inv_balance_key ON wh_inventory_balance(tenant_id, plant_id, sku);
    END IF;
END $$;

-- Sales Order indexes (only if columns exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sd_sales_order_item' AND column_name = 'so_id') THEN
        CREATE INDEX IF NOT EXISTS ix_so_item_order ON sd_sales_order_item(tenant_id, so_id);
    END IF;
END $$;

-- KPI indexes (only if columns exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'co_kpi_snapshot' AND column_name = 'kpi_key') THEN
        CREATE INDEX IF NOT EXISTS ix_kpi_snapshot ON co_kpi_snapshot(tenant_id, kpi_key, snapshot_at DESC);
    END IF;
END $$;

-- Customer indexes (only if columns exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'crm_customer' AND column_name = 'customer_id') THEN
        CREATE INDEX IF NOT EXISTS ix_customer ON crm_customer(tenant_id, customer_id);
    END IF;
END $$;

-- Material indexes (only if columns exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mm_material' AND column_name = 'sku') THEN
        CREATE INDEX IF NOT EXISTS ix_material ON mm_material(tenant_id, sku);
    END IF;
END $$;

-- ========================================
-- 3. Add unique constraint for default warehouse per tenant
-- ========================================

-- Create unique index for default warehouse per tenant
CREATE UNIQUE INDEX IF NOT EXISTS ux_wh_default_per_tenant
ON wh_warehouse(tenant_id) WHERE is_default = true;

-- ========================================
-- 4. Update function for document numbering
-- ========================================

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS next_doc_number(text, text);

CREATE OR REPLACE FUNCTION next_doc_number(p_tenant text, p_doc_type text)
RETURNS text LANGUAGE plpgsql AS $$
DECLARE
  v_prefix text;
  v_format text;
  v_next integer;
  v_num text;
BEGIN
  UPDATE doc_numbering
     SET next_seq = next_seq + 1
   WHERE tenant_id = p_tenant AND doc_type = p_doc_type AND is_active = true
  RETURNING prefix, format, next_seq INTO v_prefix, v_format, v_next;

  IF v_prefix IS NULL THEN
    RAISE EXCEPTION 'doc_numbering missing for tenant=% and type=%', p_tenant, p_doc_type;
  END IF;

  -- Suporta formato 'YYYYMM-SEQ6'
  v_num := to_char(now(), 'YYYYMM') || '-' || lpad(v_next::text, 6, '0');
  RETURN v_prefix || v_num;
END $$;

-- ========================================
-- 5. Create triggers for calculated fields
-- ========================================

-- Trigger to update purchase order total when items change
CREATE OR REPLACE FUNCTION trg_update_po_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE mm_purchase_order 
  SET total_amount = (
    SELECT COALESCE(SUM(total_price), 0) 
    FROM mm_purchase_order_item 
    WHERE tenant_id = NEW.tenant_id AND mm_order = NEW.mm_order
  )
  WHERE tenant_id = NEW.tenant_id AND mm_order = NEW.mm_order;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_calculate_po_item_totals ON mm_purchase_order_item;
CREATE TRIGGER trg_calculate_po_item_totals
  AFTER INSERT OR UPDATE OR DELETE ON mm_purchase_order_item
  FOR EACH ROW EXECUTE FUNCTION trg_update_po_total();

-- Trigger to validate only one default warehouse per tenant
CREATE OR REPLACE FUNCTION trg_validate_warehouse_default()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE wh_warehouse 
    SET is_default = false 
    WHERE tenant_id = NEW.tenant_id AND warehouse_id != NEW.warehouse_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validate_warehouse_default ON wh_warehouse;
CREATE TRIGGER trg_validate_warehouse_default
  BEFORE INSERT OR UPDATE ON wh_warehouse
  FOR EACH ROW EXECUTE FUNCTION trg_validate_warehouse_default();