import { z } from 'zod';

// Enums reais do banco
export const ORDER_STATUS_ENUM = z.enum(['draft', 'approved', 'invoiced', 'cancelled']);
export const TRANSACTION_TYPE_ENUM = z.enum(['debito', 'credito']);
export const MATERIAL_CLASS_ENUM = z.enum(['prata', 'ouro', 'acabamento', 'embalagem', 'Amuletos', 'Elementar', 'Ciclos', 'Ancestral']);
export const MATERIAL_TYPE_ENUM = z.enum(['raw_material', 'finished_good', 'component', 'service', 'Brinco', 'Choker', 'Gargantilha', 'Kit', 'Pulseira']);
export const PAYMENT_METHOD_ENUM = z.enum(['pix', 'cartao', 'boleto', 'transferencia']);
export const MOVEMENT_TYPE_ENUM = z.enum(['IN', 'OUT', 'RESERVE', 'RELEASE', 'ADJUST']);

// Schemas de validação
export const SD_SalesOrderSchema = z.object({
  so_id: z.string().min(1).optional(),
  customer_id: z.string().min(1),
  order_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  expected_ship: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: ORDER_STATUS_ENUM.optional(),
  doc_no: z.string().optional(),
  payment_method: PAYMENT_METHOD_ENUM.optional(),
  payment_term: z.string().optional(),
  notes: z.string().optional(),
});

export const MM_PurchaseOrderSchema = z.object({
  mm_order: z.string().min(1),
  vendor_id: z.string().min(1),
  order_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  po_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  expected_delivery: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  currency: z.string().optional(),
  total_cents: z.number().int().optional(),
  total_amount: z.number().int().optional(),
  notes: z.string().optional(),
  status: z.string().optional(),
});

export const WH_InventoryBalanceSchema = z.object({
  plant_id: z.string().min(1),
  mm_material: z.string().min(1),
  on_hand_qty: z.number().int(),
  reserved_qty: z.number().int(),
  status: z.string().optional(),
  last_count_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  // quantity_available é READ-ONLY - não aceitar no payload
});

export const FI_TransactionSchema = z.object({
  transaction_id: z.string().min(1),
  account_id: z.string().min(1),
  type: TRANSACTION_TYPE_ENUM,
  amount_cents: z.number().int(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().optional(),
});
