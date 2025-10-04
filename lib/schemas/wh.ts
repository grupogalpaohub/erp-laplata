import { z } from 'zod'

// ===== WH WAREHOUSE SCHEMAS =====
export const WarehouseSchema = z.object({
  plant_id: z.string().min(1, 'ID da planta é obrigatório'),
  name: z.string().min(1, 'Nome da planta é obrigatório'),
  address: z.string().optional(),
  tenant_id: z.string().min(1, 'Tenant ID é obrigatório')
})

export const CreateWarehouseSchema = WarehouseSchema.omit({ 
  tenant_id: true 
})

export const UpdateWarehouseSchema = CreateWarehouseSchema.partial()

// ===== WH INVENTORY BALANCE SCHEMAS =====
export const InventoryBalanceSchema = z.object({
  tenant_id: z.string().min(1, 'Tenant ID é obrigatório'),
  plant_id: z.string().min(1, 'ID da planta é obrigatório'),
  mm_material: z.string().uuid('ID do material deve ser um UUID válido'),
  on_hand_qty: z.number().nonnegative('Quantidade em mãos deve ser não negativa'),
  reserved_qty: z.number().nonnegative('Quantidade reservada deve ser não negativa'),
  blocked_qty: z.number().nonnegative('Quantidade bloqueada deve ser não negativa')
})

export const UpdateInventoryBalanceSchema = InventoryBalanceSchema.omit({ 
  tenant_id: true 
}).partial()

// ===== WH INVENTORY LEDGER SCHEMAS =====
export const InventoryLedgerSchema = z.object({
  ledger_id: z.number().int().positive('ID do ledger deve ser um número positivo'),
  tenant_id: z.string().min(1, 'Tenant ID é obrigatório'),
  plant_id: z.string().min(1, 'ID da planta é obrigatório'),
  mm_material: z.string().uuid('ID do material deve ser um UUID válido'),
  movement_type: z.string().min(1, 'Tipo de movimento é obrigatório'),
  qty: z.number().refine(val => val !== 0, 'Quantidade não pode ser zero'),
  reference_type: z.string().optional(),
  reference_id: z.string().optional()
})

export const CreateInventoryLedgerSchema = InventoryLedgerSchema.omit({ 
  ledger_id: true,
  tenant_id: true 
})

// ===== WH LOW STOCK ALERT SCHEMAS =====
export const LowStockAlertSchema = z.object({
  alert_id: z.string().uuid('ID do alerta deve ser um UUID válido'),
  tenant_id: z.string().min(1, 'Tenant ID é obrigatório'),
  plant_id: z.string().min(1, 'ID da planta é obrigatório'),
  mm_material: z.string().uuid('ID do material deve ser um UUID válido'),
  current_qty: z.number().nonnegative('Quantidade atual deve ser não negativa'),
  min_qty: z.number().positive('Quantidade mínima deve ser positiva'),
  alert_date: z.string().datetime('Data do alerta deve ser uma data válida'),
  status: z.enum(['active', 'resolved', 'dismissed']),
  resolved_date: z.string().datetime('Data de resolução deve ser uma data válida').optional()
})

export const CreateLowStockAlertSchema = LowStockAlertSchema.omit({ 
  alert_id: true,
  tenant_id: true,
  alert_date: true
})

export const UpdateLowStockAlertSchema = CreateLowStockAlertSchema.partial()

// ===== TYPES =====
export type Warehouse = z.infer<typeof WarehouseSchema>
export type CreateWarehouse = z.infer<typeof CreateWarehouseSchema>
export type UpdateWarehouse = z.infer<typeof UpdateWarehouseSchema>

export type InventoryBalance = z.infer<typeof InventoryBalanceSchema>
export type UpdateInventoryBalance = z.infer<typeof UpdateInventoryBalanceSchema>

export type InventoryLedger = z.infer<typeof InventoryLedgerSchema>
export type CreateInventoryLedger = z.infer<typeof CreateInventoryLedgerSchema>

export type LowStockAlert = z.infer<typeof LowStockAlertSchema>
export type CreateLowStockAlert = z.infer<typeof CreateLowStockAlertSchema>
export type UpdateLowStockAlert = z.infer<typeof UpdateLowStockAlertSchema>
