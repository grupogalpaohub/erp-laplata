import { z } from 'zod'

// ===== MM MATERIAL SCHEMAS =====
export const MaterialSchema = z.object({
  mm_material: z.string().uuid('ID Material deve ser um UUID válido'),
  material_name: z.string().min(1, 'Nome do material é obrigatório'),
  unit_price_cents: z.number().positive('Preço unitário deve ser positivo'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  classification: z.string().min(1, 'Classificação é obrigatória'),
  vendor_id: z.string().uuid('ID do fornecedor deve ser um UUID válido').optional(),
  tenant_id: z.string().min(1, 'Tenant ID é obrigatório')
})

export const CreateMaterialSchema = MaterialSchema.omit({ 
  mm_material: true, 
  tenant_id: true 
})

export const UpdateMaterialSchema = CreateMaterialSchema.partial()

// ===== MM VENDOR SCHEMAS =====
export const VendorSchema = z.object({
  vendor_id: z.string().uuid('ID do fornecedor deve ser um UUID válido'),
  vendor_name: z.string().min(1, 'Nome do fornecedor é obrigatório'),
  email: z.string().email('Email deve ser válido').optional(),
  phone: z.string().optional(),
  rating: z.string().optional(),
  tenant_id: z.string().min(1, 'Tenant ID é obrigatório')
})

export const CreateVendorSchema = VendorSchema.omit({ 
  vendor_id: true, 
  tenant_id: true 
})

export const UpdateVendorSchema = CreateVendorSchema.partial()

// ===== MM PURCHASE ORDER SCHEMAS =====
export const PurchaseOrderSchema = z.object({
  mm_order: z.string().min(1, 'ID do pedido é obrigatório'),
  vendor_id: z.string().uuid('ID do fornecedor deve ser um UUID válido'),
  order_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  expected_delivery: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD').optional(),
  total_amount_cents: z.number().nonnegative('Total deve ser não negativo'),
  status: z.enum(['draft', 'received']),
  tenant_id: z.string().min(1, 'Tenant ID é obrigatório')
})

export const CreatePurchaseOrderSchema = PurchaseOrderSchema.omit({ 
  mm_order: true, 
  tenant_id: true 
})

export const UpdatePurchaseOrderSchema = CreatePurchaseOrderSchema.partial()

// ===== MM PURCHASE ORDER ITEM SCHEMAS =====
export const PurchaseOrderItemSchema = z.object({
  po_item_id: z.number().int().positive('ID do item deve ser um número positivo'),
  tenant_id: z.string().min(1, 'Tenant ID é obrigatório'),
  mm_order: z.string().min(1, 'ID do pedido é obrigatório'),
  mm_material: z.string().uuid('ID do material deve ser um UUID válido'),
  quantity: z.number().positive('Quantidade deve ser positiva'),
  unit_price_cents: z.number().positive('Preço unitário deve ser positivo'),
  line_total_cents: z.number().nonnegative('Total da linha deve ser não negativo'),
  plant_id: z.string().min(1, 'ID da planta é obrigatório'),
  currency: z.string().min(1, 'Moeda é obrigatória'),
  notes: z.string().optional()
})

export const CreatePurchaseOrderItemSchema = PurchaseOrderItemSchema.omit({ 
  po_item_id: true, 
  tenant_id: true 
})

export const UpdatePurchaseOrderItemSchema = CreatePurchaseOrderItemSchema.partial()

// ===== MM RECEIVING SCHEMAS =====
export const ReceivingSchema = z.object({
  recv_id: z.string().uuid('ID do recebimento deve ser um UUID válido'),
  mm_order: z.string().min(1, 'ID do pedido é obrigatório'),
  mm_material: z.string().uuid('ID do material deve ser um UUID válido'),
  plant_id: z.string().min(1, 'ID da planta é obrigatório'),
  qty_received: z.number().positive('Quantidade recebida deve ser positiva'),
  received_at: z.string().datetime('Data de recebimento deve ser uma data válida'),
  tenant_id: z.string().min(1, 'Tenant ID é obrigatório')
})

export const CreateReceivingSchema = ReceivingSchema.omit({ 
  recv_id: true, 
  tenant_id: true 
})

// ===== TYPES =====
export type Material = z.infer<typeof MaterialSchema>
export type CreateMaterial = z.infer<typeof CreateMaterialSchema>
export type UpdateMaterial = z.infer<typeof UpdateMaterialSchema>

export type Vendor = z.infer<typeof VendorSchema>
export type CreateVendor = z.infer<typeof CreateVendorSchema>
export type UpdateVendor = z.infer<typeof UpdateVendorSchema>

export type PurchaseOrder = z.infer<typeof PurchaseOrderSchema>
export type CreatePurchaseOrder = z.infer<typeof CreatePurchaseOrderSchema>
export type UpdatePurchaseOrder = z.infer<typeof UpdatePurchaseOrderSchema>

export type PurchaseOrderItem = z.infer<typeof PurchaseOrderItemSchema>
export type CreatePurchaseOrderItem = z.infer<typeof CreatePurchaseOrderItemSchema>
export type UpdatePurchaseOrderItem = z.infer<typeof UpdatePurchaseOrderItemSchema>

export type Receiving = z.infer<typeof ReceivingSchema>
export type CreateReceiving = z.infer<typeof CreateReceivingSchema>
