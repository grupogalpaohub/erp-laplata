import { z } from 'zod'

// ===== SD CUSTOMER SCHEMAS =====
export const CustomerSchema = z.object({
  customer_id: z.string().uuid('ID do cliente deve ser um UUID válido'),
  customer_name: z.string().min(1, 'Nome do cliente é obrigatório'),
  email: z.string().email('Email deve ser válido').optional(),
  phone: z.string().optional(),
  customer_type: z.enum(['PF', 'PJ']).optional(),
  preferred_payment_method: z.string().optional(),
  tenant_id: z.string().min(1, 'Tenant ID é obrigatório')
})

export const CreateCustomerSchema = CustomerSchema.omit({ 
  customer_id: true, 
  tenant_id: true 
})

export const UpdateCustomerSchema = CreateCustomerSchema.partial()

// ===== SD SALES ORDER SCHEMAS =====
export const SalesOrderSchema = z.object({
  so_id: z.string().min(1, 'ID do pedido é obrigatório'),
  customer_id: z.string().uuid('ID do cliente deve ser um UUID válido'),
  order_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  expected_ship: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD').optional(),
  total_amount_cents: z.number().nonnegative('Total deve ser não negativo'),
  status: z.enum(['draft', 'confirmed', 'shipped', 'delivered']),
  tenant_id: z.string().min(1, 'Tenant ID é obrigatório')
})

export const CreateSalesOrderSchema = SalesOrderSchema.omit({ 
  so_id: true, 
  tenant_id: true 
})

export const UpdateSalesOrderSchema = CreateSalesOrderSchema.partial()

// ===== SD SALES ORDER ITEM SCHEMAS =====
export const SalesOrderItemSchema = z.object({
  tenant_id: z.string().min(1, 'Tenant ID é obrigatório'),
  so_id: z.string().min(1, 'ID do pedido é obrigatório'),
  row_no: z.number().int().positive('Número da linha deve ser um número positivo'),
  mm_material: z.string().uuid('ID do material deve ser um UUID válido'),
  quantity: z.number().positive('Quantidade deve ser positiva'),
  unit_price_cents: z.number().positive('Preço unitário deve ser positivo'),
  total_cents: z.number().nonnegative('Total deve ser não negativo')
})

export const CreateSalesOrderItemSchema = SalesOrderItemSchema.omit({ 
  tenant_id: true 
})

export const UpdateSalesOrderItemSchema = CreateSalesOrderItemSchema.partial()

// ===== SD SHIPMENT SCHEMAS =====
export const ShipmentSchema = z.object({
  shipment_id: z.string().uuid('ID da expedição deve ser um UUID válido'),
  so_id: z.string().min(1, 'ID do pedido é obrigatório'),
  warehouse_id: z.string().min(1, 'ID do armazém é obrigatório'),
  ship_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD').optional(),
  status: z.enum(['pending', 'shipped', 'delivered']),
  carrier: z.string().optional(),
  tracking_code: z.string().optional(),
  created_at: z.string().datetime('Data de criação deve ser uma data válida'),
  tenant_id: z.string().min(1, 'Tenant ID é obrigatório')
})

export const CreateShipmentSchema = ShipmentSchema.omit({ 
  shipment_id: true, 
  tenant_id: true,
  created_at: true
})

export const UpdateShipmentSchema = CreateShipmentSchema.partial()

// ===== TYPES =====
export type Customer = z.infer<typeof CustomerSchema>
export type CreateCustomer = z.infer<typeof CreateCustomerSchema>
export type UpdateCustomer = z.infer<typeof UpdateCustomerSchema>

export type SalesOrder = z.infer<typeof SalesOrderSchema>
export type CreateSalesOrder = z.infer<typeof CreateSalesOrderSchema>
export type UpdateSalesOrder = z.infer<typeof UpdateSalesOrderSchema>

export type SalesOrderItem = z.infer<typeof SalesOrderItemSchema>
export type CreateSalesOrderItem = z.infer<typeof CreateSalesOrderItemSchema>
export type UpdateSalesOrderItem = z.infer<typeof UpdateSalesOrderItemSchema>

export type Shipment = z.infer<typeof ShipmentSchema>
export type CreateShipment = z.infer<typeof CreateShipmentSchema>
export type UpdateShipment = z.infer<typeof UpdateShipmentSchema>
