// ===== TIPOS GLOBAIS DO ERP LAPLATA =====

// === TIPOS DE AUTENTICAÇÃO ===
export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface AuthSession {
  user: User | null
  isAuthenticated: boolean
}

// === TIPOS DE TENANT ===
export interface Tenant {
  id: string
  name: string
  is_active: boolean
  created_at: string
}

// === TIPOS DE MATERIAIS (MM) ===
export interface Material {
  mm_material: string
  mm_comercial: string
  mm_desc: string
  collection: string
  material_unit: string
  purchase_price_cents: number
  sale_price_cents: number
  mm_vendor_id: string
  tenant_id: string
  created_at: string
  updated_at: string
}

export interface Vendor {
  vendor_id: string
  vendor_name: string
  contact_email: string
  contact_phone: string
  is_active: boolean
  tenant_id: string
  created_at: string
  updated_at: string
}

export interface PurchaseOrder {
  mm_order: string
  vendor_id: string
  total_amount_cents: number
  status: 'draft' | 'approved' | 'received' | 'cancelled'
  order_date: string
  tenant_id: string
  created_at: string
  updated_at: string
}

// === TIPOS DE VENDAS (SD) ===
export interface Customer {
  customer_id: string
  name: string
  contact_email: string
  contact_phone: string
  document_id: string
  customer_type: 'PF' | 'PJ'
  is_active: boolean
  tenant_id: string
  created_at: string
  updated_at: string
}

export interface SalesOrder {
  so_id: string
  doc_no: string
  customer_id: string
  status: 'draft' | 'approved' | 'invoiced' | 'cancelled'
  order_date: string
  total_final_cents: number
  total_negotiated_cents: number
  tenant_id: string
  created_at: string
  updated_at: string
}

// === TIPOS DE ESTOQUE (WH) ===
export interface InventoryItem {
  material_id: string
  qty_on_hand: number
  qty_reserved: number
  unit: string
  warehouse_id: string
  tenant_id: string
  created_at: string
  updated_at: string
}

// === TIPOS DE KPI ===
export interface KpiData {
  totalMaterials: number
  totalVendors: number
  totalOrders: number
  totalValue: number
  totalSales: number
  totalInventory: number
  totalProfit: number
}

// === TIPOS DE RESPOSTA DE API ===
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// === TIPOS DE FORMULÁRIO ===
export interface FormData {
  [key: string]: string | number | boolean | null
}

// === TIPOS DE FILTROS ===
export interface FilterOptions {
  search?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  limit?: number
  offset?: number
}

// === TIPOS DE PAGINAÇÃO ===
export interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

// === TIPOS DE TABELA ===
export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface TableData {
  [key: string]: any
}

// === TIPOS DE NOTIFICAÇÃO ===
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// === TIPOS DE CONFIGURAÇÃO ===
export interface AppConfig {
  tenantId: string
  currency: string
  dateFormat: string
  timeFormat: string
  pagination: {
    defaultLimit: number
    maxLimit: number
  }
}
