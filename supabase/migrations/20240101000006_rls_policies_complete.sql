-- Complete RLS Policies for All Tables
-- Enable RLS and create policies for all business and customizing tables

-- ========================================
-- Enable RLS on all tables
-- ========================================

-- Business tables
ALTER TABLE tenant ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permission ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_setting ENABLE ROW LEVEL SECURITY;
ALTER TABLE doc_numbering ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_job ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_log ENABLE ROW LEVEL SECURITY;

-- MM (Materials Management)
ALTER TABLE mm_vendor ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_material ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_purchase_order ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_purchase_order_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_receiving ENABLE ROW LEVEL SECURITY;

-- WH (Warehouse)
ALTER TABLE wh_warehouse ENABLE ROW LEVEL SECURITY;
ALTER TABLE wh_inventory_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE wh_inventory_ledger ENABLE ROW LEVEL SECURITY;

-- SD (Sales & Distribution)
ALTER TABLE crm_customer ENABLE ROW LEVEL SECURITY;
ALTER TABLE sd_sales_order ENABLE ROW LEVEL SECURITY;
ALTER TABLE sd_sales_order_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE sd_shipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE sd_payment ENABLE ROW LEVEL SECURITY;

-- CRM
ALTER TABLE crm_lead ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_opportunity ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_interaction ENABLE ROW LEVEL SECURITY;

-- FI (Finance)
ALTER TABLE fi_account ENABLE ROW LEVEL SECURITY;
ALTER TABLE fi_invoice ENABLE ROW LEVEL SECURITY;
ALTER TABLE fi_payment ENABLE ROW LEVEL SECURITY;
ALTER TABLE fi_transaction ENABLE ROW LEVEL SECURITY;

-- CO (Controlling)
ALTER TABLE co_cost_center ENABLE ROW LEVEL SECURITY;
ALTER TABLE co_fiscal_period ENABLE ROW LEVEL SECURITY;
ALTER TABLE co_kpi_definition ENABLE ROW LEVEL SECURITY;
ALTER TABLE co_kpi_snapshot ENABLE ROW LEVEL SECURITY;
ALTER TABLE co_dashboard_tile ENABLE ROW LEVEL SECURITY;

-- Setup tables
ALTER TABLE mm_setup ENABLE ROW LEVEL SECURITY;
ALTER TABLE wh_setup ENABLE ROW LEVEL SECURITY;
ALTER TABLE sd_setup ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_setup ENABLE ROW LEVEL SECURITY;
ALTER TABLE fi_setup ENABLE ROW LEVEL SECURITY;
ALTER TABLE co_setup ENABLE ROW LEVEL SECURITY;

-- Definition tables
ALTER TABLE mm_category_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_classification_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_price_channel_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_currency_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_vendor_rating_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE mm_status_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE wh_inventory_status_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE sd_order_status_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE sd_shipment_status_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE sd_carrier_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE sd_channel_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_source_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_lead_status_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_opp_stage_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE fi_payment_method_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE fi_payment_terms_def ENABLE ROW LEVEL SECURITY;
ALTER TABLE fi_tax_code_def ENABLE ROW LEVEL SECURITY;

-- ========================================
-- Create RLS Policies for all tables
-- ========================================

-- Function to create standard RLS policies for a table
CREATE OR REPLACE FUNCTION create_rls_policies(table_name text)
RETURNS void AS $$
BEGIN
  EXECUTE format('
    DROP POLICY IF EXISTS sel_%I ON %I;
    CREATE POLICY sel_%I ON %I
    FOR SELECT USING (tenant_id = current_setting(''request.jwt.claims'', true)::json->>''tenant_id'');
  ', table_name, table_name, table_name, table_name);
  
  EXECUTE format('
    DROP POLICY IF EXISTS ins_%I ON %I;
    CREATE POLICY ins_%I ON %I
    FOR INSERT WITH CHECK (tenant_id = current_setting(''request.jwt.claims'', true)::json->>''tenant_id'');
  ', table_name, table_name, table_name, table_name);
  
  EXECUTE format('
    DROP POLICY IF EXISTS upd_%I ON %I;
    CREATE POLICY upd_%I ON %I
    FOR UPDATE USING (tenant_id = current_setting(''request.jwt.claims'', true)::json->>''tenant_id'')
             WITH CHECK (tenant_id = current_setting(''request.jwt.claims'', true)::json->>''tenant_id'');
  ', table_name, table_name, table_name, table_name);
  
  EXECUTE format('
    DROP POLICY IF EXISTS del_%I ON %I;
    CREATE POLICY del_%I ON %I
    FOR DELETE USING (tenant_id = current_setting(''request.jwt.claims'', true)::json->>''tenant_id'');
  ', table_name, table_name, table_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Apply RLS policies to all tables
SELECT create_rls_policies('tenant');
SELECT create_rls_policies('user_profile');
SELECT create_rls_policies('role_permission');
SELECT create_rls_policies('app_setting');
SELECT create_rls_policies('doc_numbering');
SELECT create_rls_policies('audit_log');
SELECT create_rls_policies('import_job');
SELECT create_rls_policies('import_log');

-- MM tables
SELECT create_rls_policies('mm_vendor');
SELECT create_rls_policies('mm_material');
SELECT create_rls_policies('mm_purchase_order');
SELECT create_rls_policies('mm_purchase_order_item');
SELECT create_rls_policies('mm_receiving');

-- WH tables
SELECT create_rls_policies('wh_warehouse');
SELECT create_rls_policies('wh_inventory_balance');
SELECT create_rls_policies('wh_inventory_ledger');

-- SD tables
SELECT create_rls_policies('crm_customer');
SELECT create_rls_policies('sd_sales_order');
SELECT create_rls_policies('sd_sales_order_item');
SELECT create_rls_policies('sd_shipment');
SELECT create_rls_policies('sd_payment');

-- CRM tables
SELECT create_rls_policies('crm_lead');
SELECT create_rls_policies('crm_opportunity');
SELECT create_rls_policies('crm_interaction');

-- FI tables
SELECT create_rls_policies('fi_account');
SELECT create_rls_policies('fi_invoice');
SELECT create_rls_policies('fi_payment');
SELECT create_rls_policies('fi_transaction');

-- CO tables
SELECT create_rls_policies('co_cost_center');
SELECT create_rls_policies('co_fiscal_period');
SELECT create_rls_policies('co_kpi_definition');
SELECT create_rls_policies('co_kpi_snapshot');
SELECT create_rls_policies('co_dashboard_tile');

-- Setup tables
SELECT create_rls_policies('mm_setup');
SELECT create_rls_policies('wh_setup');
SELECT create_rls_policies('sd_setup');
SELECT create_rls_policies('crm_setup');
SELECT create_rls_policies('fi_setup');
SELECT create_rls_policies('co_setup');

-- Definition tables
SELECT create_rls_policies('mm_category_def');
SELECT create_rls_policies('mm_classification_def');
SELECT create_rls_policies('mm_price_channel_def');
SELECT create_rls_policies('mm_currency_def');
SELECT create_rls_policies('mm_vendor_rating_def');
SELECT create_rls_policies('mm_status_def');
SELECT create_rls_policies('wh_inventory_status_def');
SELECT create_rls_policies('sd_order_status_def');
SELECT create_rls_policies('sd_shipment_status_def');
SELECT create_rls_policies('sd_carrier_def');
SELECT create_rls_policies('sd_channel_def');
SELECT create_rls_policies('crm_source_def');
SELECT create_rls_policies('crm_lead_status_def');
SELECT create_rls_policies('crm_opp_stage_def');
SELECT create_rls_policies('fi_payment_method_def');
SELECT create_rls_policies('fi_payment_terms_def');
SELECT create_rls_policies('fi_tax_code_def');

-- Drop the helper function
DROP FUNCTION create_rls_policies(text);