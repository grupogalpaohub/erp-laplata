-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'user', 'viewer');
CREATE TYPE material_type AS ENUM ('raw_material', 'finished_good', 'component', 'service');
CREATE TYPE material_class AS ENUM ('prata', 'ouro', 'acabamento', 'embalagem');
CREATE TYPE order_status AS ENUM ('draft', 'approved', 'received', 'cancelled', 'shipped', 'delivered', 'invoiced');
CREATE TYPE customer_type AS ENUM ('PF', 'PJ');
CREATE TYPE payment_method AS ENUM ('pix', 'cartao', 'boleto', 'transferencia');
CREATE TYPE account_type AS ENUM ('caixa', 'banco');
CREATE TYPE transaction_type AS ENUM ('credito', 'debito');
CREATE TYPE movement_type AS ENUM ('IN', 'OUT', 'RESERVE', 'RELEASE', 'ADJUST');

-- Setup & Security Tables
CREATE TABLE tenant (
    tenant_id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    locale TEXT DEFAULT 'pt-BR',
    timezone TEXT DEFAULT 'America/Sao_Paulo',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_profile (
    tenant_id TEXT NOT NULL,
    user_id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE role_permission (
    tenant_id TEXT NOT NULL,
    role user_role NOT NULL,
    resource TEXT NOT NULL,
    action TEXT NOT NULL,
    allowed BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (tenant_id, role, resource, action)
);

CREATE TABLE app_setting (
    tenant_id TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (tenant_id, key)
);

CREATE TABLE doc_numbering (
    tenant_id TEXT NOT NULL,
    doc_type TEXT NOT NULL,
    prefix TEXT NOT NULL,
    format TEXT NOT NULL,
    next_seq INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id, doc_type)
);

CREATE TABLE audit_log (
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
CREATE TABLE mm_vendor (
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

CREATE TABLE mm_material (
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

CREATE TABLE mm_purchase_order (
    tenant_id TEXT NOT NULL,
    mm_order TEXT PRIMARY KEY,
    vendor_id TEXT NOT NULL REFERENCES mm_vendor(vendor_id),
    status order_status DEFAULT 'draft',
    po_date DATE DEFAULT CURRENT_DATE,
    expected_delivery DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE mm_purchase_order_item (
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

CREATE TABLE mm_receiving (
    tenant_id TEXT NOT NULL,
    recv_id BIGSERIAL PRIMARY KEY,
    mm_order TEXT NOT NULL REFERENCES mm_purchase_order(mm_order),
    plant_id TEXT NOT NULL,
    mm_material TEXT NOT NULL REFERENCES mm_material(mm_material),
    qty_received NUMERIC NOT NULL DEFAULT 0,
    received_at TIMESTAMPTZ DEFAULT NOW()
);

-- WH - Depósitos & Estoque
CREATE TABLE wh_warehouse (
    tenant_id TEXT NOT NULL,
    plant_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Constraint to ensure only one default warehouse per tenant
CREATE UNIQUE INDEX wh_warehouse_default_unique ON wh_warehouse (tenant_id) WHERE is_default = TRUE;

CREATE TABLE wh_inventory_balance (
    tenant_id TEXT NOT NULL,
    plant_id TEXT NOT NULL,
    mm_material TEXT NOT NULL,
    on_hand_qty NUMERIC DEFAULT 0,
    reserved_qty NUMERIC DEFAULT 0,
    PRIMARY KEY (tenant_id, plant_id, mm_material)
);

CREATE TABLE wh_inventory_ledger (
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
CREATE TABLE crm_customer (
    tenant_id TEXT NOT NULL,
    customer_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    customer_type customer_type DEFAULT 'PF',
    status TEXT DEFAULT 'active',
    created_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE sd_sales_order (
    tenant_id TEXT NOT NULL,
    so_id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL REFERENCES crm_customer(customer_id),
    status order_status DEFAULT 'draft',
    order_date DATE DEFAULT CURRENT_DATE,
    expected_ship DATE,
    total_cents INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sd_sales_order_item (
    tenant_id TEXT NOT NULL,
    so_id TEXT NOT NULL REFERENCES sd_sales_order(so_id),
    sku TEXT NOT NULL,
    quantity NUMERIC NOT NULL DEFAULT 0,
    unit_price_cents INTEGER NOT NULL DEFAULT 0,
    line_total_cents INTEGER NOT NULL DEFAULT 0,
    row_no INTEGER DEFAULT 1,
    PRIMARY KEY (tenant_id, so_id, sku, row_no)
);

CREATE TABLE sd_shipment (
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

CREATE TABLE sd_payment (
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
CREATE TABLE crm_lead (
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

CREATE TABLE crm_opportunity (
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

CREATE TABLE crm_interaction (
    tenant_id TEXT NOT NULL,
    interaction_id BIGSERIAL PRIMARY KEY,
    lead_id TEXT NOT NULL REFERENCES crm_lead(lead_id),
    channel TEXT NOT NULL,
    content TEXT NOT NULL,
    sentiment TEXT,
    created_date DATE DEFAULT CURRENT_DATE
);

-- FI - Financeiro
CREATE TABLE fi_account (
    tenant_id TEXT NOT NULL,
    account_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type account_type NOT NULL,
    currency TEXT DEFAULT 'BRL',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE fi_invoice (
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

CREATE TABLE fi_payment (
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

CREATE TABLE fi_transaction (
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
CREATE TABLE co_cost_center (
    tenant_id TEXT NOT NULL,
    cc_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    parent_cc_id TEXT REFERENCES co_cost_center(cc_id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE co_fiscal_period (
    tenant_id TEXT NOT NULL,
    period_id TEXT PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE co_kpi_definition (
    tenant_id TEXT NOT NULL,
    kpi_key TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    unit TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE co_kpi_snapshot (
    tenant_id TEXT NOT NULL,
    kpi_key TEXT NOT NULL REFERENCES co_kpi_definition(kpi_key),
    snapshot_at TIMESTAMPTZ NOT NULL,
    value_number NUMERIC,
    meta_json TEXT,
    PRIMARY KEY (tenant_id, kpi_key, snapshot_at)
);

CREATE TABLE co_dashboard_tile (
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