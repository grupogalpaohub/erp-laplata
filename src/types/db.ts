// src/types/db.ts
// Interfaces TypeScript baseadas no schema REAL do Supabase
// Fonte única de verdade: schema validado pelo usuário

export type TenantId = 'LaplataLunaria';

// ============================================================================
// MM - MATERIAL MANAGEMENT
// ============================================================================

export interface MM_Material {
  tenant_id: TenantId;
  mm_material: string;
  mm_comercial: string | null;
  mm_desc: string;
  mm_mat_type: string | null;
  mm_mat_class: string | null;
  mm_price_cents: number;
  barcode: string | null;
  weight_grams: number | null;
  status: string;
  mm_pur_link: string | null;
  mm_vendor_id: string | null;
  created_at: string | null;
  commercial_name: string | null;
  unit_of_measure: string;
  dimensions: string | null;
  purity: string | null;
  color: string | null;
  finish: string | null;
  min_stock: number;
  max_stock: number;
  lead_time_days: number;
  price_last_updated_at: string | null;
  mm_purchase_price_cents: number | null;
}

export interface MM_PurchaseOrder {
  tenant_id: TenantId;
  mm_order: string;                    // NOT NULL - campo correto
  vendor_id: string;                   // NOT NULL
  order_date: string;                  // NOT NULL - ISO date
  status?: string | null;              // enum
  po_date?: string | null;             // date
  expected_delivery?: string | null;   // date
  notes?: string | null;               // text
  created_at?: string | null;          // timestamptz
  total_amount?: number | null;        // bigint
  currency?: string | null;            // text
  total_cents?: number | null;         // bigint
}

export interface MM_PurchaseOrderItem {
  tenant_id: TenantId;
  po_item_id: number;                  // NOT NULL - BIGINT -> number
  mm_order: string;                    // NOT NULL
  plant_id: string;                    // NOT NULL
  mm_material: string;                 // NOT NULL
  mm_qtt: string;                      // NOT NULL - numeric -> string para precisão
  unit_cost_cents: number;             // NOT NULL - integer
  line_total_cents: number;            // NOT NULL - integer
  notes?: string | null;               // text
  currency?: string | null;            // text
  quantity?: number | null;            // integer
  material_id?: string | null;         // text
  freeze_item_price?: boolean | null;  // boolean
}

export interface MM_Vendor {
  tenant_id: TenantId;
  vendor_id: string;
  vendor_name: string;
  email: string | null;
  telefone: string | null;
  cidade: string | null;
  estado: string | null;
  vendor_rating: string | null;
  created_at: string | null;
}

// ============================================================================
// SD - SALES & DISTRIBUTION
// ============================================================================

export interface SD_SalesOrder {
  tenant_id: TenantId;
  so_id: string;                       // NOT NULL
  customer_id: string;                 // NOT NULL
  status?: string | null;              // enum
  order_date?: string | null;          // date
  expected_ship?: string | null;       // date
  total_cents?: number | null;         // integer
  created_at?: string | null;          // timestamptz
  doc_no?: string | null;              // text
  payment_method?: string | null;      // text
  payment_term?: string | null;        // text
  total_final_cents?: number | null;   // integer
  total_negotiated_cents?: number | null; // integer
  notes?: string | null;               // text
  updated_at?: string | null;          // timestamptz
}

export interface SD_SalesOrderItem {
  tenant_id: TenantId;
  so_id: string;
  sku: string;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
  row_no: number;
}

// ============================================================================
// WH - WAREHOUSE MANAGEMENT
// ============================================================================

export interface WH_Warehouse {
  tenant_id: TenantId;
  plant_id: string;
  name: string;
  is_default: boolean;
  created_at: string | null;
}

export interface WH_InventoryBalance {
  tenant_id: TenantId;
  plant_id: string;                    // NOT NULL
  mm_material: string;                 // NOT NULL
  on_hand_qty?: string | null;         // numeric -> string
  reserved_qty?: string | null;        // numeric -> string
  last_count_date?: string | null;     // date
  status?: string | null;              // text
  quantity_available?: number | null;  // READ-ONLY (generated column)
}

// ============================================================================
// FI - FINANCIAL MANAGEMENT
// ============================================================================

export interface FI_Transaction {
  tenant_id: TenantId;
  transaction_id: string;              // NOT NULL
  account_id: string;                  // NOT NULL
  type: 'debito' | 'credito';          // NOT NULL - enum (ajustar aos valores reais)
  amount_cents: number;                // NOT NULL - integer
  ref_type?: string | null;            // text
  ref_id?: string | null;              // text
  date?: string | null;                // date
  created_at?: string | null;          // timestamptz
}

export interface FI_Account {
  tenant_id: TenantId;
  account_id: string;
  name: string;
  type: string;
  currency: string;
  is_active: boolean;
  created_at: string | null;
}

export interface FI_Invoice {
  tenant_id: TenantId;
  invoice_id: string;
  source_type: string;
  source_id: string;
  customer_id: string;
  vendor_id: string;
  amount_cents: number;
  due_date: string;
  status: string;
  created_date: string;
}

export interface FI_Payment {
  tenant_id: TenantId;
  payment_id: string;
  invoice_id: string;
  account_id: string;
  amount_cents: number;
  payment_date: string;
  method: string;
  status: string;
  created_at: string | null;
}

// ============================================================================
// CRM - CUSTOMER RELATIONSHIP MANAGEMENT
// ============================================================================

export interface CRM_Customer {
  tenant_id: TenantId;
  customer_id: string;
  name: string;
  email: string | null;
  telefone: string | null;
  customer_type: string;
  status: string;
  created_date: string;
  customer_category: string | null;
  lead_classification: string | null;
  sales_channel: string | null;
  notes: string | null;
  preferred_payment_method: string | null;
  preferred_payment_terms: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  phone_country: string | null;
  contact_name: string | null;
  document_id: string | null;
  addr_street: string | null;
  addr_number: string | null;
  addr_complement: string | null;
  addr_district: string | null;
  addr_city: string | null;
  addr_state: string | null;
  addr_zip: string | null;
  addr_country: string | null;
  is_active: boolean;
  updated_at: string | null;
}

export interface CRM_Lead {
  tenant_id: TenantId;
  lead_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  source: string | null;
  status: string | null;
  score: number | null;
  owner_user: string | null;
  created_date: string;
}

export interface CRM_Opportunity {
  tenant_id: TenantId;
  opp_id: string;
  lead_id: string;
  stage: string | null;
  est_value_cents: number | null;
  probability: number | null;
  next_action_at: string | null;
  status: string | null;
  created_date: string;
}

export interface CRM_Interaction {
  tenant_id: TenantId;
  interaction_id: string;
  lead_id: string;
  channel: string | null;
  content: string | null;
  sentiment: string | null;
  created_date: string;
}

// ============================================================================
// CO - CONTROLLING
// ============================================================================

export interface CO_CostCenter {
  tenant_id: TenantId;
  cc_id: string;
  name: string;
  parent_cc_id: string | null;
  is_active: boolean;
  created_at: string | null;
}

export interface CO_FiscalPeriod {
  tenant_id: TenantId;
  period_id: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string | null;
}

export interface CO_KpiDefinition {
  tenant_id: TenantId;
  kpi_key: string;
  name: string;
  unit: string;
  description: string | null;
  created_at: string | null;
}

export interface CO_KpiSnapshot {
  tenant_id: TenantId;
  kpi_key: string;
  snapshot_at: string;
  value_number: number | null;
  meta_json: any | null;
}

export interface CO_DashboardTile {
  tenant_id: TenantId;
  tile_id: string;
  kpi_key: string;
  title: string;
  subtitle: string | null;
  order_index: number;
  color: string | null;
  is_active: boolean;
  created_at: string | null;
}

// ============================================================================
// SYSTEM TABLES
// ============================================================================

export interface UserProfile {
  tenant_id: TenantId;
  user_id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string | null;
}

export interface Tenant {
  tenant_id: TenantId;
  display_name: string;
  locale: string;
  timezone: string;
  created_at: string | null;
}

export interface AppSetting {
  tenant_id: TenantId;
  key: string;
  value: string;
  updated_at: string | null;
}

export interface AuditLog {
  audit_id: string;
  tenant_id: TenantId;
  table_name: string;
  record_pk: string;
  action: string;
  diff_json: any | null;
  actor_user: string | null;
  created_at: string | null;
}

export interface DocNumbering {
  tenant_id: TenantId;
  doc_type: string;
  prefix: string;
  format: string;
  next_seq: number;
  is_active: boolean;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type DatabaseTable = 
  | 'mm_material'
  | 'mm_purchase_order'
  | 'mm_purchase_order_item'
  | 'mm_vendor'
  | 'sd_sales_order'
  | 'sd_sales_order_item'
  | 'wh_warehouse'
  | 'wh_inventory_balance'
  | 'fi_transaction'
  | 'fi_account'
  | 'fi_invoice'
  | 'fi_payment'
  | 'crm_customer'
  | 'crm_lead'
  | 'crm_opportunity'
  | 'crm_interaction'
  | 'co_cost_center'
  | 'co_fiscal_period'
  | 'co_kpi_definition'
  | 'co_kpi_snapshot'
  | 'co_dashboard_tile'
  | 'user_profile'
  | 'tenant'
  | 'app_setting'
  | 'audit_log'
  | 'doc_numbering';

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  total?: number;
  page?: number;
  pageSize?: number;
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export const REQUIRED_FIELDS = {
  MM_PurchaseOrder: ['tenant_id', 'mm_order', 'vendor_id', 'order_date'],
  MM_PurchaseOrderItem: ['tenant_id', 'po_item_id', 'mm_order', 'plant_id', 'mm_material', 'mm_qtt', 'unit_cost_cents', 'line_total_cents'],
  SD_SalesOrder: ['tenant_id', 'so_id', 'customer_id'],
  WH_InventoryBalance: ['tenant_id', 'plant_id', 'mm_material'],
  FI_Transaction: ['tenant_id', 'transaction_id', 'account_id', 'type', 'amount_cents'],
} as const;

export const FORBIDDEN_FIELDS = {
  WH_InventoryBalance: ['quantity_available'], // Generated column - never insert
} as const;

// ============================================================================
// FIELD MAPPINGS (for migration/validation)
// ============================================================================

export const FIELD_MAPPINGS = {
  // OLD -> NEW
  'po_id': 'mm_order',
  'transaction_type': 'type',
  'movement_type': 'type',
} as const;
