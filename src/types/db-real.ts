// Tipos baseados no Inventário 360° real do Supabase
export interface SD_SalesOrderItem {
  tenant_id: string;
  so_id: string;
  sku?: string;                    // Campo legado mantido
  quantity: number;                // numeric no banco
  unit_price_cents: number;
  line_total_cents: number;
  row_no: number;
  unit_price_cents_at_order?: number | null;
  material_id?: string;            // Campo legado mantido
  mm_material: string;             // Campo ativo - FK para mm_material
}

export interface SD_SalesOrder {
  tenant_id: string;
  so_id: string;
  customer_id: string;
  order_date?: string | null;
  expected_ship?: string | null;
  status?: 'draft' | 'approved' | 'invoiced' | 'cancelled';
  doc_no?: string | null;
  payment_method?: string | null;
  payment_term?: string | null;
  total_cents?: number | null;
  total_final_cents?: number | null;    // Read-only - calculado por trigger
  total_negotiated_cents?: number | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface MM_PurchaseOrder {
  tenant_id: string;
  mm_order: string;                // PK real
  vendor_id: string;
  order_date: string;
  po_date?: string | null;
  expected_delivery?: string | null;
  currency?: string | null;
  total_cents?: number | null;
  total_amount?: number | null;
  notes?: string | null;
  status?: string | null;
  created_at?: string | null;
}

export interface MM_PurchaseOrderItem {
  tenant_id: string;
  mm_order: string;                // FK para mm_purchase_order
  po_item_id?: number;             // PK real
  plant_id: string;
  mm_material: string;             // FK para mm_material
  mm_qtt: number;
  unit_cost_cents: number;
  line_total_cents?: number | null;
  freeze_item_price?: boolean | null;
  currency?: string | null;
  notes?: string | null;
}

export interface WH_InventoryBalance {
  tenant_id: string;
  plant_id: string;
  mm_material: string;
  on_hand_qty: number;
  reserved_qty: number;
  status?: string | null;
  last_count_date?: string | null;
  quantity_available?: number;     // READ-ONLY - coluna gerada
}

export interface FI_Transaction {
  tenant_id: string;
  transaction_id: string;
  account_id: string;
  type: 'debito' | 'credito';      // Enum real do banco
  amount_cents: number;
  date: string;
  description?: string | null;
  created_at?: string | null;
}

// Enums reais do banco
export const ORDER_STATUS = ['draft', 'approved', 'invoiced', 'cancelled'] as const;
export const TRANSACTION_TYPE = ['debito', 'credito'] as const;
export const MATERIAL_CLASS = ['prata', 'ouro', 'acabamento', 'embalagem', 'Amuletos', 'Elementar', 'Ciclos', 'Ancestral'] as const;
export const MATERIAL_TYPE = ['raw_material', 'finished_good', 'component', 'service', 'Brinco', 'Choker', 'Gargantilha', 'Kit', 'Pulseira'] as const;
export const PAYMENT_METHOD = ['pix', 'cartao', 'boleto', 'transferencia'] as const;
export const MOVEMENT_TYPE = ['IN', 'OUT', 'RESERVE', 'RELEASE', 'ADJUST'] as const;
