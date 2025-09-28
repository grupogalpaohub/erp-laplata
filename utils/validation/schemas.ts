// utils/validation/schemas.ts
// Schemas de validação Zod para APIs

import { z } from 'zod';

// ============================================================================
// MM - MATERIALS MANAGEMENT
// ============================================================================

export const MM_PurchaseOrderSchema = z.object({
  mm_order: z.string().min(1, 'mm_order é obrigatório'),
  vendor_id: z.string().min(1, 'vendor_id é obrigatório'),
  order_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'order_date deve estar no formato yyyy-mm-dd'),
  status: z.enum(['draft', 'approved', 'invoiced', 'cancelled']).optional().nullable(),
  po_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  expected_delivery: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  notes: z.string().optional().nullable(),
  total_amount: z.number().int().optional().nullable(),
  currency: z.string().optional().nullable(),
  total_cents: z.number().int().optional().nullable(),
});

export const MM_PurchaseOrderItemSchema = z.object({
  po_item_id: z.number().int().positive('po_item_id deve ser um número positivo'),
  mm_order: z.string().min(1, 'mm_order é obrigatório'),
  plant_id: z.string().min(1, 'plant_id é obrigatório'),
  mm_material: z.string().min(1, 'mm_material é obrigatório'),
  mm_qtt: z.string().min(1, 'mm_qtt é obrigatório (numeric como string)'),
  unit_cost_cents: z.number().int().min(0, 'unit_cost_cents deve ser >= 0'),
  line_total_cents: z.number().int().min(0, 'line_total_cents deve ser >= 0'),
  notes: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  quantity: z.number().int().optional().nullable(),
  // material_id removido - usar mm_material
  freeze_item_price: z.boolean().optional().nullable(),
});

// ============================================================================
// SD - SALES & DISTRIBUTION
// ============================================================================

export const SD_SalesOrderSchema = z.object({
  so_id: z.string().min(1, 'so_id é obrigatório'),
  customer_id: z.string().min(1, 'customer_id é obrigatório'),
  status: z.enum(['draft', 'approved', 'invoiced', 'cancelled']).optional().nullable(),
  order_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  expected_ship: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  total_cents: z.number().int().optional().nullable(),
  doc_no: z.string().optional().nullable(),
  payment_method: z.string().optional().nullable(),
  payment_term: z.string().optional().nullable(),
  total_negotiated_cents: z.number().int().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const SD_SalesOrderItemSchema = z.object({
  so_id: z.string().min(1, 'so_id é obrigatório'),
  mm_material: z.string().min(1, 'mm_material é obrigatório'),
  quantity: z.string().min(1, 'quantity é obrigatório (numeric como string)'),
  unit_price_cents: z.number().int().min(0, 'unit_price_cents deve ser >= 0'),
  line_total_cents: z.number().int().min(0, 'line_total_cents deve ser >= 0'),
  row_no: z.number().int().positive('row_no deve ser um número positivo'),
  unit_price_cents_at_order: z.number().int().optional().nullable(),
});

// ============================================================================
// WH - WAREHOUSE MANAGEMENT
// ============================================================================

export const WH_InventoryBalanceSchema = z.object({
  plant_id: z.string().min(1, 'plant_id é obrigatório'),
  mm_material: z.string().min(1, 'mm_material é obrigatório'),
  on_hand_qty: z.string().optional().nullable(),
  reserved_qty: z.string().optional().nullable(),
  last_count_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  status: z.string().optional().nullable(),
});

// ============================================================================
// FI - FINANCIAL MANAGEMENT
// ============================================================================

export const FI_TransactionSchema = z.object({
  transaction_id: z.string().min(1, 'transaction_id é obrigatório'),
  account_id: z.string().min(1, 'account_id é obrigatório'),
  type: z.enum(['debito', 'credito'], { 
    errorMap: () => ({ message: 'type deve ser "debito" ou "credito"' })
  }),
  amount_cents: z.number().int().min(0, 'amount_cents deve ser >= 0'),
  ref_type: z.string().optional().nullable(),
  ref_id: z.string().optional().nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
});

// ============================================================================
// CRM - CUSTOMER RELATIONSHIP MANAGEMENT
// ============================================================================

export const CRM_CustomerSchema = z.object({
  customer_id: z.string().min(1, 'customer_id é obrigatório'),
  name: z.string().min(1, 'name é obrigatório'),
  email: z.string().email('email deve ter formato válido').optional().nullable(),
  telefone: z.string().optional().nullable(),
  customer_type: z.enum(['PF', 'PJ']).optional().nullable(),
  status: z.string().optional().nullable(),
  created_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  customer_category: z.string().optional().nullable(),
  lead_classification: z.string().optional().nullable(),
  sales_channel: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  preferred_payment_method: z.string().optional().nullable(),
  preferred_payment_terms: z.string().optional().nullable(),
  contact_email: z.string().email().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  phone_country: z.string().optional().nullable(),
  contact_name: z.string().optional().nullable(),
  document_id: z.string().optional().nullable(),
  addr_street: z.string().optional().nullable(),
  addr_number: z.string().optional().nullable(),
  addr_complement: z.string().optional().nullable(),
  addr_district: z.string().optional().nullable(),
  addr_city: z.string().optional().nullable(),
  addr_state: z.string().optional().nullable(),
  addr_zip: z.string().optional().nullable(),
  addr_country: z.string().optional().nullable(),
  is_active: z.boolean().optional().nullable(),
});

// ============================================================================
// VALIDAÇÃO DE TENANT_ID
// ============================================================================

export function validateNoTenantId(body: any): { valid: boolean; error?: string } {
  if ('tenant_id' in body) {
    return { 
      valid: false, 
      error: 'tenant_id é derivado da sessão - não pode ser fornecido no payload' 
    };
  }
  return { valid: true };
}

// ============================================================================
// VALIDAÇÃO DE CAMPOS PROIBIDOS
// ============================================================================

export function validateForbiddenFields(body: any, forbiddenFields: string[]): { valid: boolean; error?: string } {
  for (const field of forbiddenFields) {
    if (field in body) {
      return { 
        valid: false, 
        error: `Campo '${field}' é proibido (gerado automaticamente pelo banco)` 
      };
    }
  }
  return { valid: true };
}
