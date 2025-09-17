-- Setup Tables for each module

-- MM - Materiais Setup
CREATE TABLE mm_setup (
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

CREATE TABLE mm_category_def (
    tenant_id TEXT NOT NULL,
    category TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id, category)
);

CREATE TABLE mm_classification_def (
    tenant_id TEXT NOT NULL,
    classification TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id, classification)
);

CREATE TABLE mm_price_channel_def (
    tenant_id TEXT NOT NULL,
    channel TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id, channel)
);

CREATE TABLE mm_currency_def (
    tenant_id TEXT NOT NULL,
    currency TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id, currency)
);

CREATE TABLE mm_vendor_rating_def (
    tenant_id TEXT NOT NULL,
    rating TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id, rating)
);

CREATE TABLE mm_status_def (
    tenant_id TEXT NOT NULL,
    object_type TEXT NOT NULL,
    status TEXT NOT NULL,
    description TEXT,
    is_final BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    PRIMARY KEY (tenant_id, object_type, status)
);

-- WH - Depósitos Setup
CREATE TABLE wh_setup (
    tenant_id TEXT NOT NULL,
    default_plant_id TEXT,
    reserve_policy TEXT DEFAULT 'no_backorder',
    negative_stock_allowed BOOLEAN DEFAULT FALSE,
    picking_strategy TEXT DEFAULT 'fifo',
    PRIMARY KEY (tenant_id)
);

CREATE TABLE wh_inventory_status_def (
    tenant_id TEXT NOT NULL,
    status TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id, status)
);

-- SD - Vendas Setup
CREATE TABLE sd_setup (
    tenant_id TEXT NOT NULL,
    backorder_policy TEXT DEFAULT 'block',
    pricing_mode TEXT DEFAULT 'material',
    default_channel TEXT DEFAULT 'site',
    auto_reserve_on_confirm BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id)
);

CREATE TABLE sd_order_status_def (
    tenant_id TEXT NOT NULL,
    status TEXT NOT NULL,
    description TEXT,
    is_final BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    PRIMARY KEY (tenant_id, status)
);

CREATE TABLE sd_shipment_status_def (
    tenant_id TEXT NOT NULL,
    status TEXT NOT NULL,
    description TEXT,
    is_final BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    PRIMARY KEY (tenant_id, status)
);

CREATE TABLE sd_carrier_def (
    tenant_id TEXT NOT NULL,
    carrier_code TEXT NOT NULL,
    carrier_name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id, carrier_code)
);

CREATE TABLE sd_channel_def (
    tenant_id TEXT NOT NULL,
    channel TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id, channel)
);

-- CRM - Leads Setup
CREATE TABLE crm_setup (
    tenant_id TEXT NOT NULL,
    require_contact_info BOOLEAN DEFAULT TRUE,
    auto_convert_on_first_order BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (tenant_id)
);

CREATE TABLE crm_source_def (
    tenant_id TEXT NOT NULL,
    source TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id, source)
);

CREATE TABLE crm_lead_status_def (
    tenant_id TEXT NOT NULL,
    status TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    is_final BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (tenant_id, status)
);

CREATE TABLE crm_opp_stage_def (
    tenant_id TEXT NOT NULL,
    stage TEXT NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    is_final BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (tenant_id, stage)
);

-- FI - Financeiro Setup
CREATE TABLE fi_setup (
    tenant_id TEXT NOT NULL,
    currency TEXT DEFAULT 'BRL',
    tax_inclusive BOOLEAN DEFAULT FALSE,
    default_ar_account_id TEXT,
    default_ap_account_id TEXT,
    rounding_policy TEXT DEFAULT 'bankers',
    PRIMARY KEY (tenant_id)
);

CREATE TABLE fi_payment_method_def (
    tenant_id TEXT NOT NULL,
    method TEXT NOT NULL,
    display_name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id, method)
);

CREATE TABLE fi_payment_terms_def (
    tenant_id TEXT NOT NULL,
    terms_code TEXT NOT NULL,
    description TEXT,
    days INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (tenant_id, terms_code)
);

CREATE TABLE fi_tax_code_def (
    tenant_id TEXT NOT NULL,
    tax_code TEXT NOT NULL,
    description TEXT,
    rate_bp INTEGER DEFAULT 0,
    PRIMARY KEY (tenant_id, tax_code)
);

-- CO - Controladoria Setup
CREATE TABLE co_setup (
    tenant_id TEXT NOT NULL,
    timezone TEXT DEFAULT 'America/Sao_Paulo',
    kpi_refresh_cron TEXT DEFAULT '0 */15 * * * *',
    PRIMARY KEY (tenant_id)
);

-- Import/Export Logs
CREATE TABLE import_job (
    tenant_id TEXT NOT NULL,
    job_id BIGSERIAL PRIMARY KEY,
    job_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    total_records INTEGER DEFAULT 0,
    processed_records INTEGER DEFAULT 0,
    error_records INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE import_log (
    tenant_id TEXT NOT NULL,
    log_id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL REFERENCES import_job(job_id),
    record_number INTEGER,
    status TEXT NOT NULL,
    error_message TEXT,
    data_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);