-- Function to get next document number atomically
CREATE OR REPLACE FUNCTION next_doc_number(
    p_tenant_id TEXT,
    p_doc_type TEXT
) RETURNS TEXT AS $$
DECLARE
    v_next_seq INTEGER;
    v_prefix TEXT;
    v_format TEXT;
    v_doc_number TEXT;
BEGIN
    -- Get the next sequence number atomically
    UPDATE doc_numbering 
    SET next_seq = next_seq + 1
    WHERE tenant_id = p_tenant_id 
      AND doc_type = p_doc_type 
      AND is_active = TRUE
    RETURNING next_seq, prefix, format INTO v_next_seq, v_prefix, v_format;
    
    -- If no row was updated, create a new one
    IF NOT FOUND THEN
        INSERT INTO doc_numbering (tenant_id, doc_type, prefix, format, next_seq, is_active)
        VALUES (p_tenant_id, p_doc_type, p_doc_type, 'YYYYMM-SEQ6', 1, TRUE)
        ON CONFLICT (tenant_id, doc_type) DO UPDATE SET
            next_seq = doc_numbering.next_seq + 1,
            is_active = TRUE
        RETURNING next_seq, prefix, format INTO v_next_seq, v_prefix, v_format;
    END IF;
    
    -- Format the document number
    v_doc_number := v_prefix || '-' || TO_CHAR(CURRENT_DATE, 'YYYYMM') || '-' || LPAD(v_next_seq::TEXT, 6, '0');
    
    RETURN v_doc_number;
END;
$$ LANGUAGE plpgsql;

-- Function to update inventory balance
CREATE OR REPLACE FUNCTION update_inventory_balance(
    p_tenant_id TEXT,
    p_plant_id TEXT,
    p_mm_material TEXT,
    p_qty_change NUMERIC,
    p_movement_type TEXT
) RETURNS VOID AS $$
BEGIN
    -- Update or insert inventory balance
    INSERT INTO wh_inventory_balance (tenant_id, plant_id, mm_material, on_hand_qty, reserved_qty)
    VALUES (p_tenant_id, p_plant_id, p_mm_material, 
            CASE WHEN p_movement_type = 'IN' THEN p_qty_change ELSE 0 END,
            CASE WHEN p_movement_type = 'RESERVE' THEN p_qty_change ELSE 0 END)
    ON CONFLICT (tenant_id, plant_id, mm_material) DO UPDATE SET
        on_hand_qty = wh_inventory_balance.on_hand_qty + 
            CASE WHEN p_movement_type = 'IN' THEN p_qty_change
                 WHEN p_movement_type = 'OUT' THEN -p_qty_change
                 ELSE 0 END,
        reserved_qty = wh_inventory_balance.reserved_qty + 
            CASE WHEN p_movement_type = 'RESERVE' THEN p_qty_change
                 WHEN p_movement_type = 'RELEASE' THEN -p_qty_change
                 ELSE 0 END;
    
    -- Insert ledger entry
    INSERT INTO wh_inventory_ledger (tenant_id, plant_id, mm_material, movement, qty, ref_type, ref_id)
    VALUES (p_tenant_id, p_plant_id, p_mm_material, p_movement_type::movement_type, p_qty_change, 'MANUAL', 'SYSTEM');
END;
$$ LANGUAGE plpgsql;

-- Function to validate warehouse default constraint
CREATE OR REPLACE FUNCTION validate_warehouse_default()
RETURNS TRIGGER AS $$
BEGIN
    -- If setting is_default to true, ensure no other warehouse for this tenant is default
    IF NEW.is_default = TRUE THEN
        UPDATE wh_warehouse 
        SET is_default = FALSE 
        WHERE tenant_id = NEW.tenant_id 
          AND plant_id != NEW.plant_id 
          AND is_default = TRUE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for warehouse default validation
CREATE TRIGGER trg_validate_warehouse_default
    BEFORE INSERT OR UPDATE ON wh_warehouse
    FOR EACH ROW
    EXECUTE FUNCTION validate_warehouse_default();

-- Function to calculate line totals for purchase order items
CREATE OR REPLACE FUNCTION calculate_po_item_totals()
RETURNS TRIGGER AS $$
BEGIN
    NEW.line_total_cents := NEW.mm_qtt * NEW.unit_cost_cents;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for purchase order item totals
CREATE TRIGGER trg_calculate_po_item_totals
    BEFORE INSERT OR UPDATE ON mm_purchase_order_item
    FOR EACH ROW
    EXECUTE FUNCTION calculate_po_item_totals();

-- Function to calculate line totals for sales order items
CREATE OR REPLACE FUNCTION calculate_so_item_totals()
RETURNS TRIGGER AS $$
BEGIN
    NEW.line_total_cents := NEW.quantity * NEW.unit_price_cents;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for sales order item totals
CREATE TRIGGER trg_calculate_so_item_totals
    BEFORE INSERT OR UPDATE ON sd_sales_order_item
    FOR EACH ROW
    EXECUTE FUNCTION calculate_so_item_totals();

-- Function to update sales order total
CREATE OR REPLACE FUNCTION update_sales_order_total()
RETURNS TRIGGER AS $$
DECLARE
    v_total_cents INTEGER;
BEGIN
    -- Calculate total from all items
    SELECT COALESCE(SUM(line_total_cents), 0)
    INTO v_total_cents
    FROM sd_sales_order_item
    WHERE so_id = COALESCE(NEW.so_id, OLD.so_id);
    
    -- Update the sales order total
    UPDATE sd_sales_order
    SET total_cents = v_total_cents
    WHERE so_id = COALESCE(NEW.so_id, OLD.so_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for sales order total update
CREATE TRIGGER trg_update_sales_order_total
    AFTER INSERT OR UPDATE OR DELETE ON sd_sales_order_item
    FOR EACH ROW
    EXECUTE FUNCTION update_sales_order_total();

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION create_audit_log(
    p_tenant_id TEXT,
    p_table_name TEXT,
    p_record_pk TEXT,
    p_action TEXT,
    p_diff_json JSONB,
    p_actor_user UUID
) RETURNS VOID AS $$
BEGIN
    INSERT INTO audit_log (tenant_id, table_name, record_pk, action, diff_json, actor_user)
    VALUES (p_tenant_id, p_table_name, p_record_pk, p_action, p_diff_json, p_actor_user);
END;
$$ LANGUAGE plpgsql;

-- Function to refresh KPI snapshots
CREATE OR REPLACE FUNCTION refresh_kpi_snapshots(p_tenant_id TEXT)
RETURNS VOID AS $$
DECLARE
    v_orders_today INTEGER;
    v_month_revenue_cents INTEGER;
    v_active_leads INTEGER;
    v_stock_critical_count INTEGER;
    v_snapshot_at TIMESTAMPTZ := NOW();
BEGIN
    -- Orders today
    SELECT COUNT(*)
    INTO v_orders_today
    FROM sd_sales_order
    WHERE tenant_id = p_tenant_id
      AND order_date = CURRENT_DATE;
    
    -- Month revenue
    SELECT COALESCE(SUM(total_cents), 0)
    INTO v_month_revenue_cents
    FROM sd_sales_order
    WHERE tenant_id = p_tenant_id
      AND order_date >= DATE_TRUNC('month', CURRENT_DATE)
      AND order_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month';
    
    -- Active leads (last 7 days)
    SELECT COUNT(*)
    INTO v_active_leads
    FROM crm_lead
    WHERE tenant_id = p_tenant_id
      AND created_date >= CURRENT_DATE - INTERVAL '7 days'
      AND status != 'convertido';
    
    -- Stock critical count (assuming critical = on_hand_qty < 10)
    SELECT COUNT(*)
    INTO v_stock_critical_count
    FROM wh_inventory_balance
    WHERE tenant_id = p_tenant_id
      AND on_hand_qty < 10;
    
    -- Insert/update KPI snapshots
    INSERT INTO co_kpi_snapshot (tenant_id, kpi_key, snapshot_at, value_number)
    VALUES 
        (p_tenant_id, 'kpi_orders_today', v_snapshot_at, v_orders_today),
        (p_tenant_id, 'kpi_month_revenue_cents', v_snapshot_at, v_month_revenue_cents),
        (p_tenant_id, 'kpi_active_leads', v_snapshot_at, v_active_leads),
        (p_tenant_id, 'kpi_stock_critical_count', v_snapshot_at, v_stock_critical_count)
    ON CONFLICT (tenant_id, kpi_key, snapshot_at) DO UPDATE SET
        value_number = EXCLUDED.value_number;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX idx_mm_purchase_order_item_tenant_order ON mm_purchase_order_item(tenant_id, mm_order);
CREATE INDEX idx_mm_receiving_tenant_order ON mm_receiving(tenant_id, mm_order);
CREATE INDEX idx_wh_inventory_balance_tenant_plant_material ON wh_inventory_balance(tenant_id, plant_id, mm_material);
CREATE INDEX idx_sd_sales_order_item_tenant_so ON sd_sales_order_item(tenant_id, so_id);
CREATE INDEX idx_co_kpi_snapshot_tenant_key_time ON co_kpi_snapshot(tenant_id, kpi_key, snapshot_at DESC);
CREATE INDEX idx_audit_log_tenant_table ON audit_log(tenant_id, table_name);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);