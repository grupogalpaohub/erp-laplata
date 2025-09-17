-- Enable Row Level Security on all tables
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
ALTER TABLE mm_price_channel_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_currency_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_vendor_rating_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_status_def ENABLE ROW LEVEL SECURITY;

ALTER TABLE wh_setup ENABLE ROW LEVEL SECURITY;
ALTER TABLE wh_inventory_status_def ENABLE ROW LEVEL SECURITY;

ALTER TABLE sd_setup ENABLE ROW LEVEL SECURITY;
ALTER TABLE sd_order_status_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE sd_shipment_status_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE sd_carrier_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE sd_channel_def ENABLE ROW LEVEL SECURITY;

ALTER TABLE crm_setup ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_source_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_lead_status_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_opp_stage_def ENABLE ROW LEVEL SECURITY;

ALTER TABLE fi_setup ENABLE ROW LEVEL SECURITY;
ALTER TABLE fi_payment_method_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE fi_payment_terms_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE fi_tax_code_def ENABLE ROW LEVEL SECURITY;

ALTER TABLE co_setup ENABLE ROW LEVEL SECURITY;

ALTER TABLE import_job ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tenant isolation
-- All policies follow the pattern: tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id'

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

CREATE POLICY "tenant_isolation_mm_price_channel_def" ON mm_price_channel_def
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_mm_currency_def" ON mm_currency_def
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_mm_vendor_rating_def" ON mm_vendor_rating_def
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_mm_status_def" ON mm_status_def
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_wh_setup" ON wh_setup
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_wh_inventory_status_def" ON wh_inventory_status_def
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_sd_setup" ON sd_setup
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_sd_order_status_def" ON sd_order_status_def
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_sd_shipment_status_def" ON sd_shipment_status_def
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_sd_carrier_def" ON sd_carrier_def
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_sd_channel_def" ON sd_channel_def
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_crm_setup" ON crm_setup
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_crm_source_def" ON crm_source_def
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_crm_lead_status_def" ON crm_lead_status_def
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_crm_opp_stage_def" ON crm_opp_stage_def
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_fi_setup" ON fi_setup
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_fi_payment_method_def" ON fi_payment_method_def
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_fi_payment_terms_def" ON fi_payment_terms_def
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_fi_tax_code_def" ON fi_tax_code_def
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_co_setup" ON co_setup
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_import_job" ON import_job
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');

CREATE POLICY "tenant_isolation_import_log" ON import_log
    FOR ALL USING (tenant_id = current_setting('request.jwt.claims', true)::json->>'tenant_id');