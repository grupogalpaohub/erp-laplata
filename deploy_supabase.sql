-- ERP Laplata - Deploy Completo no Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- ==============================================
-- 1. ENABLE EXTENSIONS
-- ==============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- 2. CREATE CUSTOM TYPES
-- ==============================================
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'manager', 'user', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE material_type AS ENUM ('raw_material', 'finished_good', 'component', 'service');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE material_class AS ENUM ('prata', 'ouro', 'acabamento', 'embalagem');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('draft', 'approved', 'received', 'cancelled', 'shipped', 'delivered', 'invoiced');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE customer_type AS ENUM ('PF', 'PJ');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('pix', 'cartao', 'boleto', 'transferencia');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE account_type AS ENUM ('caixa', 'banco');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('credito', 'debito');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE movement_type AS ENUM ('IN', 'OUT', 'RESERVE', 'RELEASE', 'ADJUST');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================
-- 3. CREATE TABLES
-- ==============================================

-- Setup & Security Tables
CREATE TABLE IF NOT EXISTS tenant (
    tenant_id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    locale TEXT DEFAULT 'pt-BR',
    timezone TEXT DEFAULT 'America/Sao_Paulo',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_profile (
    tenant_id TEXT NOT NULL,
    user_id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permission (
    tenant_id TEXT NOT NULL,
    role user_role NOT NULL,
    resource TEXT NOT NULL,
    action TEXT NOT NULL,
    allowed BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (tenant_id, role, resource, action)
);

CREATE TABLE IF NOT EXISTS app_setting (
    tenant_id TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (tenant_id, key)
);

CREATE TABLE IF NOT EXISTS doc_numbering (
    tenant_id TEXT NOT NULL,
    doc_type TEXT NOT NULL,
    prefix TEXT NOT NULL,
    format TEXT NOT NULL,
    next_seq INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id, doc_type)
);

CREATE TABLE IF NOT EXISTS audit_log (
    audit_id BIGSERIAL PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_pk TEXT NOT NULL,
    action TEXT NOT NULL,
    diff_json JSONB,
    actor_user UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MM - Materiais & Fornecedores
CREATE TABLE IF NOT EXISTS mm_vendor (
    tenant_id TEXT NOT NULL,
    vendor_id TEXT PRIMARY KEY,
    vendor_name TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    cidade TEXT,
    estado TEXT,
    vendor_rating TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mm_material (
    tenant_id TEXT NOT NULL,
    mm_material TEXT PRIMARY KEY,
    mm_comercial TEXT,
    mm_desc TEXT NOT NULL,
    mm_mat_type material_type,
    mm_mat_class material_class,
    mm_price_cents INTEGER DEFAULT 0,
    barcode TEXT,
    weight_grams INTEGER,
    status TEXT DEFAULT 'active',
    mm_pur_link TEXT,
    mm_vendor_id TEXT REFERENCES mm_vendor(vendor_id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mm_purchase_order (
    tenant_id TEXT NOT NULL,
    mm_order TEXT PRIMARY KEY,
    vendor_id TEXT NOT NULL REFERENCES mm_vendor(vendor_id),
    status order_status DEFAULT 'draft',
    po_date DATE DEFAULT CURRENT_DATE,
    expected_delivery DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mm_purchase_order_item (
    tenant_id TEXT NOT NULL,
    po_item_id BIGSERIAL PRIMARY KEY,
    mm_order TEXT NOT NULL REFERENCES mm_purchase_order(mm_order),
    plant_id TEXT NOT NULL,
    mm_material TEXT NOT NULL REFERENCES mm_material(mm_material),
    mm_qtt NUMERIC NOT NULL DEFAULT 0,
    unit_cost_cents INTEGER NOT NULL DEFAULT 0,
    line_total_cents INTEGER NOT NULL DEFAULT 0,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS mm_receiving (
    tenant_id TEXT NOT NULL,
    recv_id BIGSERIAL PRIMARY KEY,
    mm_order TEXT NOT NULL REFERENCES mm_purchase_order(mm_order),
    plant_id TEXT NOT NULL,
    mm_material TEXT NOT NULL REFERENCES mm_material(mm_material),
    qty_received NUMERIC NOT NULL DEFAULT 0,
    received_at TIMESTAMPTZ DEFAULT NOW()
);

-- WH - Depósitos & Estoque
CREATE TABLE IF NOT EXISTS wh_warehouse (
    tenant_id TEXT NOT NULL,
    plant_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wh_inventory_balance (
    tenant_id TEXT NOT NULL,
    plant_id TEXT NOT NULL,
    mm_material TEXT NOT NULL,
    on_hand_qty NUMERIC DEFAULT 0,
    reserved_qty NUMERIC DEFAULT 0,
    PRIMARY KEY (tenant_id, plant_id, mm_material)
);

CREATE TABLE IF NOT EXISTS wh_inventory_ledger (
    ledger_id BIGSERIAL PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    plant_id TEXT NOT NULL,
    mm_material TEXT NOT NULL,
    movement movement_type NOT NULL,
    qty NUMERIC NOT NULL,
    ref_type TEXT,
    ref_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SD - Vendas
CREATE TABLE IF NOT EXISTS crm_customer (
    tenant_id TEXT NOT NULL,
    customer_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    customer_type customer_type DEFAULT 'PF',
    status TEXT DEFAULT 'active',
    created_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS sd_sales_order (
    tenant_id TEXT NOT NULL,
    so_id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL REFERENCES crm_customer(customer_id),
    status order_status DEFAULT 'draft',
    order_date DATE DEFAULT CURRENT_DATE,
    expected_ship DATE,
    total_cents INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sd_sales_order_item (
    tenant_id TEXT NOT NULL,
    so_id TEXT NOT NULL REFERENCES sd_sales_order(so_id),
    sku TEXT NOT NULL,
    quantity NUMERIC NOT NULL DEFAULT 0,
    unit_price_cents INTEGER NOT NULL DEFAULT 0,
    line_total_cents INTEGER NOT NULL DEFAULT 0,
    row_no INTEGER DEFAULT 1,
    PRIMARY KEY (tenant_id, so_id, sku, row_no)
);

CREATE TABLE IF NOT EXISTS sd_shipment (
    tenant_id TEXT NOT NULL,
    shipment_id TEXT PRIMARY KEY,
    so_id TEXT NOT NULL REFERENCES sd_sales_order(so_id),
    warehouse_id TEXT NOT NULL,
    ship_date DATE,
    status order_status DEFAULT 'pending',
    carrier TEXT,
    tracking_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sd_payment (
    tenant_id TEXT NOT NULL,
    payment_id TEXT PRIMARY KEY,
    so_id TEXT NOT NULL REFERENCES sd_sales_order(so_id),
    amount_cents INTEGER NOT NULL DEFAULT 0,
    payment_date DATE DEFAULT CURRENT_DATE,
    payment_method payment_method NOT NULL,
    status order_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM - Leads & Oportunidades
CREATE TABLE IF NOT EXISTS crm_lead (
    tenant_id TEXT NOT NULL,
    lead_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    source TEXT,
    status TEXT DEFAULT 'novo',
    score INTEGER,
    owner_user UUID,
    created_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS crm_opportunity (
    tenant_id TEXT NOT NULL,
    opp_id TEXT PRIMARY KEY,
    lead_id TEXT NOT NULL REFERENCES crm_lead(lead_id),
    stage TEXT DEFAULT 'discovery',
    est_value_cents INTEGER,
    probability INTEGER,
    next_action_at DATE,
    status TEXT DEFAULT 'active',
    created_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS crm_interaction (
    tenant_id TEXT NOT NULL,
    interaction_id BIGSERIAL PRIMARY KEY,
    lead_id TEXT NOT NULL REFERENCES crm_lead(lead_id),
    channel TEXT NOT NULL,
    content TEXT NOT NULL,
    sentiment TEXT,
    created_date DATE DEFAULT CURRENT_DATE
);

-- FI - Financeiro
CREATE TABLE IF NOT EXISTS fi_account (
    tenant_id TEXT NOT NULL,
    account_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type account_type NOT NULL,
    currency TEXT DEFAULT 'BRL',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fi_invoice (
    tenant_id TEXT NOT NULL,
    invoice_id TEXT PRIMARY KEY,
    source_type TEXT NOT NULL,
    source_id TEXT NOT NULL,
    customer_id TEXT REFERENCES crm_customer(customer_id),
    vendor_id TEXT REFERENCES mm_vendor(vendor_id),
    amount_cents INTEGER NOT NULL DEFAULT 0,
    due_date DATE,
    status order_status DEFAULT 'pending',
    created_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS fi_payment (
    tenant_id TEXT NOT NULL,
    payment_id TEXT PRIMARY KEY,
    invoice_id TEXT NOT NULL REFERENCES fi_invoice(invoice_id),
    account_id TEXT NOT NULL REFERENCES fi_account(account_id),
    amount_cents INTEGER NOT NULL DEFAULT 0,
    payment_date DATE DEFAULT CURRENT_DATE,
    method payment_method NOT NULL,
    status order_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fi_transaction (
    tenant_id TEXT NOT NULL,
    transaction_id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL REFERENCES fi_account(account_id),
    type transaction_type NOT NULL,
    amount_cents INTEGER NOT NULL DEFAULT 0,
    ref_type TEXT,
    ref_id TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CO - Controladoria & Dashboard
CREATE TABLE IF NOT EXISTS co_cost_center (
    tenant_id TEXT NOT NULL,
    cc_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    parent_cc_id TEXT REFERENCES co_cost_center(cc_id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS co_fiscal_period (
    tenant_id TEXT NOT NULL,
    period_id TEXT PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS co_kpi_definition (
    tenant_id TEXT NOT NULL,
    kpi_key TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    unit TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS co_kpi_snapshot (
    tenant_id TEXT NOT NULL,
    kpi_key TEXT NOT NULL REFERENCES co_kpi_definition(kpi_key),
    snapshot_at TIMESTAMPTZ NOT NULL,
    value_number NUMERIC,
    meta_json TEXT,
    PRIMARY KEY (tenant_id, kpi_key, snapshot_at)
);

CREATE TABLE IF NOT EXISTS co_dashboard_tile (
    tenant_id TEXT NOT NULL,
    tile_id TEXT PRIMARY KEY,
    kpi_key TEXT NOT NULL REFERENCES co_kpi_definition(kpi_key),
    title TEXT NOT NULL,
    subtitle TEXT,
    order_index INTEGER DEFAULT 0,
    color TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Setup Tables
CREATE TABLE IF NOT EXISTS mm_setup (
    tenant_id TEXT NOT NULL,
    default_payment_terms INTEGER DEFAULT 30,
    default_currency TEXT DEFAULT 'BRL',
    default_wh_id TEXT,
    require_mat_type BOOLEAN DEFAULT TRUE,
    require_mat_class BOOLEAN DEFAULT TRUE,
    allow_zero_price BOOLEAN DEFAULT FALSE,
    default_uom TEXT DEFAULT 'UN',
    PRIMARY KEY (tenant_id)
);

CREATE TABLE IF NOT EXISTS mm_category_def (
    tenant_id TEXT NOT NULL,
    category TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id, category)
);

CREATE TABLE IF NOT EXISTS mm_classification_def (
    tenant_id TEXT NOT NULL,
    classification TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id, classification)
);

CREATE TABLE IF NOT EXISTS mm_currency_def (
    tenant_id TEXT NOT NULL,
    currency TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id, currency)
);

CREATE TABLE IF NOT EXISTS mm_vendor_rating_def (
    tenant_id TEXT NOT NULL,
    rating TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id, rating)
);

CREATE TABLE IF NOT EXISTS mm_status_def (
    tenant_id TEXT NOT NULL,
    object_type TEXT NOT NULL,
    status TEXT NOT NULL,
    description TEXT,
    is_final BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    PRIMARY KEY (tenant_id, object_type, status)
);

-- Continue with other setup tables...
CREATE TABLE IF NOT EXISTS wh_setup (
    tenant_id TEXT NOT NULL,
    default_plant_id TEXT,
    reserve_policy TEXT DEFAULT 'no_backorder',
    negative_stock_allowed BOOLEAN DEFAULT FALSE,
    picking_strategy TEXT DEFAULT 'fifo',
    PRIMARY KEY (tenant_id)
);

CREATE TABLE IF NOT EXISTS sd_setup (
    tenant_id TEXT NOT NULL,
    backorder_policy TEXT DEFAULT 'block',
    pricing_mode TEXT DEFAULT 'material',
    default_channel TEXT DEFAULT 'site',
    auto_reserve_on_confirm BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id)
);

CREATE TABLE IF NOT EXISTS crm_setup (
    tenant_id TEXT NOT NULL,
    require_contact_info BOOLEAN DEFAULT TRUE,
    auto_convert_on_first_order BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (tenant_id)
);

CREATE TABLE IF NOT EXISTS fi_setup (
    tenant_id TEXT NOT NULL,
    currency TEXT DEFAULT 'BRL',
    tax_inclusive BOOLEAN DEFAULT FALSE,
    default_ar_account_id TEXT,
    default_ap_account_id TEXT,
    rounding_policy TEXT DEFAULT 'bankers',
    PRIMARY KEY (tenant_id)
);

CREATE TABLE IF NOT EXISTS co_setup (
    tenant_id TEXT NOT NULL,
    timezone TEXT DEFAULT 'America/Sao_Paulo',
    kpi_refresh_cron TEXT DEFAULT '0 */15 * * * *',
    PRIMARY KEY (tenant_id)
);

-- ==============================================
-- 4. CREATE CONSTRAINTS AND INDEXES
-- ==============================================

-- Constraint to ensure only one default warehouse per tenant
CREATE UNIQUE INDEX IF NOT EXISTS wh_warehouse_default_unique ON wh_warehouse (tenant_id) WHERE is_default = TRUE;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_mm_purchase_order_item_tenant_order ON mm_purchase_order_item(tenant_id, mm_order);
CREATE INDEX IF NOT EXISTS idx_mm_receiving_tenant_order ON mm_receiving(tenant_id, mm_order);
CREATE INDEX IF NOT EXISTS idx_wh_inventory_balance_tenant_plant_material ON wh_inventory_balance(tenant_id, plant_id, mm_material);
CREATE INDEX IF NOT EXISTS idx_sd_sales_order_item_tenant_so ON sd_sales_order_item(tenant_id, so_id);
CREATE INDEX IF NOT EXISTS idx_co_kpi_snapshot_tenant_key_time ON co_kpi_snapshot(tenant_id, kpi_key, snapshot_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_tenant_table ON audit_log(tenant_id, table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);

-- ==============================================
-- 5. CREATE FUNCTIONS
-- ==============================================

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

-- ==============================================
-- 6. ENABLE ROW LEVEL SECURITY
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE tenant ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permission ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_setting ENABLE ROW LEVEL SECURITY;
ALTER TABLE doc_numbering ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- MM Tables
ALTER TABLE mm_vendor ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_material ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_purchase_order ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_purchase_order_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_receiving ENABLE ROW LEVEL SECURITY;

-- WH Tables
ALTER TABLE wh_warehouse ENABLE ROW LEVEL SECURITY;
ALTER TABLE wh_inventory_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE wh_inventory_ledger ENABLE ROW LEVEL SECURITY;

-- SD Tables
ALTER TABLE crm_customer ENABLE ROW LEVEL SECURITY;
ALTER TABLE sd_sales_order ENABLE ROW LEVEL SECURITY;
ALTER TABLE sd_sales_order_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE sd_shipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE sd_payment ENABLE ROW LEVEL SECURITY;

-- CRM Tables
ALTER TABLE crm_lead ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_opportunity ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_interaction ENABLE ROW LEVEL SECURITY;

-- FI Tables
ALTER TABLE fi_account ENABLE ROW LEVEL SECURITY;
ALTER TABLE fi_invoice ENABLE ROW LEVEL SECURITY;
ALTER TABLE fi_payment ENABLE ROW LEVEL SECURITY;
ALTER TABLE fi_transaction ENABLE ROW LEVEL SECURITY;

-- CO Tables
ALTER TABLE co_cost_center ENABLE ROW LEVEL SECURITY;
ALTER TABLE co_fiscal_period ENABLE ROW LEVEL SECURITY;
ALTER TABLE co_kpi_definition ENABLE ROW LEVEL SECURITY;
ALTER TABLE co_kpi_snapshot ENABLE ROW LEVEL SECURITY;
ALTER TABLE co_dashboard_tile ENABLE ROW LEVEL SECURITY;

-- Setup Tables
ALTER TABLE mm_setup ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_category_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_classification_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_currency_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_vendor_rating_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_status_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE wh_setup ENABLE ROW LEVEL SECURITY;
ALTER TABLE sd_setup ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_setup ENABLE ROW LEVEL SECURITY;
ALTER TABLE fi_setup ENABLE ROW LEVEL SECURITY;
ALTER TABLE co_setup ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- 7. CREATE RLS POLICIES
-- ==============================================

-- Core tables policies
CREATE POLICY "tenant_isolation_tenant" ON tenant
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_user_profile" ON user_profile
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_role_permission" ON role_permission
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_app_setting" ON app_setting
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_doc_numbering" ON doc_numbering
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_audit_log" ON audit_log
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

-- MM tables policies
CREATE POLICY "tenant_isolation_mm_vendor" ON mm_vendor
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_mm_material" ON mm_material
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_mm_purchase_order" ON mm_purchase_order
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_mm_purchase_order_item" ON mm_purchase_order_item
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_mm_receiving" ON mm_receiving
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

-- WH tables policies
CREATE POLICY "tenant_isolation_wh_warehouse" ON wh_warehouse
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_wh_inventory_balance" ON wh_inventory_balance
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_wh_inventory_ledger" ON wh_inventory_ledger
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

-- SD tables policies
CREATE POLICY "tenant_isolation_crm_customer" ON crm_customer
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_sd_sales_order" ON sd_sales_order
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_sd_sales_order_item" ON sd_sales_order_item
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_sd_shipment" ON sd_shipment
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_sd_payment" ON sd_payment
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

-- CRM tables policies
CREATE POLICY "tenant_isolation_crm_lead" ON crm_lead
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_crm_opportunity" ON crm_opportunity
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_crm_interaction" ON crm_interaction
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

-- FI tables policies
CREATE POLICY "tenant_isolation_fi_account" ON fi_account
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_fi_invoice" ON fi_invoice
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_fi_payment" ON fi_payment
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_fi_transaction" ON fi_transaction
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

-- CO tables policies
CREATE POLICY "tenant_isolation_co_cost_center" ON co_cost_center
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_co_fiscal_period" ON co_fiscal_period
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_co_kpi_definition" ON co_kpi_definition
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_co_kpi_snapshot" ON co_kpi_snapshot
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_co_dashboard_tile" ON co_dashboard_tile
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

-- Setup tables policies
CREATE POLICY "tenant_isolation_mm_setup" ON mm_setup
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_mm_category_def" ON mm_category_def
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_mm_classification_def" ON mm_classification_def
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_mm_currency_def" ON mm_currency_def
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_mm_vendor_rating_def" ON mm_vendor_rating_def
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_mm_status_def" ON mm_status_def
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_wh_setup" ON wh_setup
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_sd_setup" ON sd_setup
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_crm_setup" ON crm_setup
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_fi_setup" ON fi_setup
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_co_setup" ON co_setup
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

-- ==============================================
-- 8. INSERT INITIAL DATA
-- ==============================================

-- Insert initial tenant
INSERT INTO tenant (tenant_id, display_name, locale, timezone) 
VALUES ('LaplataLunaria', 'Laplata Lunaria', 'pt-BR', 'America/Sao_Paulo')
ON CONFLICT (tenant_id) DO NOTHING;

-- Insert document numbering configurations
INSERT INTO doc_numbering (tenant_id, doc_type, prefix, format, next_seq, is_active)
VALUES 
    ('LaplataLunaria', 'SO', 'SO', 'YYYYMM-SEQ6', 1, TRUE),
    ('LaplataLunaria', 'MM', 'MM', 'YYYYMM-SEQ6', 1, TRUE),
    ('LaplataLunaria', 'SH', 'SH', 'YYYYMM-SEQ6', 1, TRUE),
    ('LaplataLunaria', 'PAY', 'PAY', 'YYYYMM-SEQ6', 1, TRUE),
    ('LaplataLunaria', 'INV', 'INV', 'YYYYMM-SEQ6', 1, TRUE)
ON CONFLICT (tenant_id, doc_type) DO NOTHING;

-- Insert default warehouse
INSERT INTO wh_warehouse (tenant_id, plant_id, name, is_default)
VALUES ('LaplataLunaria', 'GOIANIA', 'Depósito Goiânia', TRUE)
ON CONFLICT (plant_id) DO NOTHING;

-- Insert setup configurations
INSERT INTO mm_setup (tenant_id, default_payment_terms, default_currency, default_wh_id, require_mat_type, require_mat_class, allow_zero_price, default_uom)
VALUES ('LaplataLunaria', 30, 'BRL', 'GOIANIA', TRUE, TRUE, FALSE, 'UN')
ON CONFLICT (tenant_id) DO NOTHING;

INSERT INTO wh_setup (tenant_id, default_plant_id, reserve_policy, negative_stock_allowed, picking_strategy)
VALUES ('LaplataLunaria', 'GOIANIA', 'no_backorder', FALSE, 'fifo')
ON CONFLICT (tenant_id) DO NOTHING;

INSERT INTO sd_setup (tenant_id, backorder_policy, pricing_mode, default_channel, auto_reserve_on_confirm)
VALUES ('LaplataLunaria', 'block', 'material', 'site', TRUE)
ON CONFLICT (tenant_id) DO NOTHING;

INSERT INTO crm_setup (tenant_id, require_contact_info, auto_convert_on_first_order)
VALUES ('LaplataLunaria', TRUE, FALSE)
ON CONFLICT (tenant_id) DO NOTHING;

INSERT INTO fi_setup (tenant_id, currency, tax_inclusive, rounding_policy)
VALUES ('LaplataLunaria', 'BRL', FALSE, 'bankers')
ON CONFLICT (tenant_id) DO NOTHING;

INSERT INTO co_setup (tenant_id, timezone, kpi_refresh_cron)
VALUES ('LaplataLunaria', 'America/Sao_Paulo', '0 */15 * * * *')
ON CONFLICT (tenant_id) DO NOTHING;

-- Insert definition tables for MM
INSERT INTO mm_category_def (tenant_id, category, is_active)
VALUES 
    ('LaplataLunaria', 'brinco', TRUE),
    ('LaplataLunaria', 'colar', TRUE),
    ('LaplataLunaria', 'anel', TRUE),
    ('LaplataLunaria', 'pulseira', TRUE)
ON CONFLICT (tenant_id, category) DO NOTHING;

INSERT INTO mm_classification_def (tenant_id, classification, is_active)
VALUES 
    ('LaplataLunaria', 'prata', TRUE),
    ('LaplataLunaria', 'ouro', TRUE),
    ('LaplataLunaria', 'acabamento', TRUE),
    ('LaplataLunaria', 'embalagem', TRUE)
ON CONFLICT (tenant_id, classification) DO NOTHING;

INSERT INTO mm_currency_def (tenant_id, currency, is_active)
VALUES ('LaplataLunaria', 'BRL', TRUE)
ON CONFLICT (tenant_id, currency) DO NOTHING;

INSERT INTO mm_vendor_rating_def (tenant_id, rating, is_active)
VALUES 
    ('LaplataLunaria', 'A', TRUE),
    ('LaplataLunaria', 'B', TRUE),
    ('LaplataLunaria', 'C', TRUE)
ON CONFLICT (tenant_id, rating) DO NOTHING;

INSERT INTO mm_status_def (tenant_id, object_type, status, description, is_final, order_index)
VALUES 
    ('LaplataLunaria', 'material', 'active', 'Ativo', FALSE, 1),
    ('LaplataLunaria', 'material', 'draft', 'Rascunho', FALSE, 2),
    ('LaplataLunaria', 'material', 'archived', 'Arquivado', TRUE, 3),
    ('LaplataLunaria', 'purchase_order', 'draft', 'Rascunho', FALSE, 1),
    ('LaplataLunaria', 'purchase_order', 'approved', 'Aprovado', FALSE, 2),
    ('LaplataLunaria', 'purchase_order', 'received', 'Recebido', TRUE, 3),
    ('LaplataLunaria', 'purchase_order', 'cancelled', 'Cancelado', TRUE, 4)
ON CONFLICT (tenant_id, object_type, status) DO NOTHING;

-- Insert KPI definitions
INSERT INTO co_kpi_definition (tenant_id, kpi_key, name, unit, description)
VALUES 
    ('LaplataLunaria', 'kpi_orders_today', 'Pedidos Hoje', 'un', 'Número de pedidos criados hoje'),
    ('LaplataLunaria', 'kpi_month_revenue_cents', 'Receita do Mês', 'R$', 'Receita total do mês em centavos'),
    ('LaplataLunaria', 'kpi_active_leads', 'Leads Ativos', 'un', 'Número de leads ativos na semana'),
    ('LaplataLunaria', 'kpi_stock_critical_count', 'Estoque Crítico', 'un', 'Número de itens com estoque crítico')
ON CONFLICT (tenant_id, kpi_key) DO NOTHING;

-- Insert dashboard tiles
INSERT INTO co_dashboard_tile (tenant_id, tile_id, kpi_key, title, subtitle, order_index, color, is_active)
VALUES 
    ('LaplataLunaria', 'tile_1', 'kpi_orders_today', 'Pedidos Hoje', 'Média diária do mês', 1, 'blue', TRUE),
    ('LaplataLunaria', 'tile_2', 'kpi_month_revenue_cents', 'Receita do Mês', 'Média mensal histórica', 2, 'green', TRUE),
    ('LaplataLunaria', 'tile_3', 'kpi_active_leads', 'Leads Ativos (semana)', 'Média mensal', 3, 'purple', TRUE),
    ('LaplataLunaria', 'tile_4', 'kpi_stock_critical_count', 'Estoque Crítico (itens)', 'PNs críticos · Tendência de consumo', 4, 'red', TRUE)
ON CONFLICT (tenant_id, tile_id) DO NOTHING;

-- ==============================================
-- 9. INSERT SAMPLE DATA
-- ==============================================

-- Sample vendor
INSERT INTO mm_vendor (tenant_id, vendor_id, vendor_name, email, telefone, cidade, estado, vendor_rating)
VALUES ('LaplataLunaria', 'SUP_00001', 'Fornecedor Principal', 'contato@fornecedor.com', '(62) 99999-9999', 'Goiânia', 'GO', 'A')
ON CONFLICT (vendor_id) DO NOTHING;

-- Sample materials
INSERT INTO mm_material (tenant_id, mm_material, mm_comercial, mm_desc, mm_mat_type, mm_mat_class, mm_price_cents, barcode, weight_grams, status, mm_vendor_id)
VALUES 
    ('LaplataLunaria', 'BR-001', 'BR001', 'Brinco de Prata 925', 'finished_good', 'prata', 4500, '7891234567890', 5, 'active', 'SUP_00001'),
    ('LaplataLunaria', 'BR-002', 'BR002', 'Colar de Prata 925', 'finished_good', 'prata', 3200, '7891234567891', 8, 'active', 'SUP_00001'),
    ('LaplataLunaria', 'BR-003', 'BR003', 'Anel de Prata 925', 'finished_good', 'prata', 2800, '7891234567892', 3, 'active', 'SUP_00001')
ON CONFLICT (mm_material) DO NOTHING;

-- Sample customer
INSERT INTO crm_customer (tenant_id, customer_id, name, email, telefone, customer_type, status)
VALUES ('LaplataLunaria', 'CUST-0001', 'Cliente Exemplo', 'cliente@exemplo.com', '(62) 88888-8888', 'PF', 'active')
ON CONFLICT (customer_id) DO NOTHING;

-- Sample financial account
INSERT INTO fi_account (tenant_id, account_id, name, type, currency, is_active)
VALUES ('LaplataLunaria', 'ACC-0001', 'Conta Corrente Principal', 'banco', 'BRL', TRUE)
ON CONFLICT (account_id) DO NOTHING;

-- Sample inventory balance
INSERT INTO wh_inventory_balance (tenant_id, plant_id, mm_material, on_hand_qty, reserved_qty)
VALUES 
    ('LaplataLunaria', 'GOIANIA', 'BR-001', 100, 0),
    ('LaplataLunaria', 'GOIANIA', 'BR-002', 50, 0),
    ('LaplataLunaria', 'GOIANIA', 'BR-003', 75, 0)
ON CONFLICT (tenant_id, plant_id, mm_material) DO NOTHING;

-- Insert initial KPI snapshots
INSERT INTO co_kpi_snapshot (tenant_id, kpi_key, snapshot_at, value_number)
VALUES 
    ('LaplataLunaria', 'kpi_orders_today', NOW(), 0),
    ('LaplataLunaria', 'kpi_month_revenue_cents', NOW(), 0),
    ('LaplataLunaria', 'kpi_active_leads', NOW(), 0),
    ('LaplataLunaria', 'kpi_stock_critical_count', NOW(), 0)
ON CONFLICT (tenant_id, kpi_key, snapshot_at) DO NOTHING;

-- ==============================================
-- DEPLOY COMPLETO!
-- ==============================================

SELECT 'ERP Laplata deployado com sucesso!' as status;