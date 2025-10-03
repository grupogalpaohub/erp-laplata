import { z } from 'zod'

// ===== FI ACCOUNT SCHEMAS =====
export const AccountSchema = z.object({
  account_id: z.string().uuid('ID da conta deve ser um UUID válido'),
  account_code: z.string().min(1, 'Código da conta é obrigatório'),
  account_name: z.string().min(1, 'Nome da conta é obrigatório'),
  account_type: z.string().min(1, 'Tipo da conta é obrigatório'),
  parent_account_id: z.string().uuid('ID da conta pai deve ser um UUID válido').optional(),
  tenant_id: z.string().min(1, 'Tenant ID é obrigatório')
})

export const CreateAccountSchema = AccountSchema.omit({ 
  account_id: true, 
  tenant_id: true 
})

export const UpdateAccountSchema = CreateAccountSchema.partial()

// ===== FI TRANSACTION SCHEMAS =====
export const TransactionSchema = z.object({
  transaction_id: z.string().uuid('ID da transação deve ser um UUID válido'),
  account_id: z.string().uuid('ID da conta deve ser um UUID válido'),
  type: z.enum(['debit', 'credit']),
  amount_cents: z.number().positive('Valor deve ser positivo'),
  description: z.string().optional(),
  reference_type: z.string().optional(),
  reference_id: z.string().optional(),
  created_at: z.string().datetime('Data de criação deve ser uma data válida'),
  tenant_id: z.string().min(1, 'Tenant ID é obrigatório')
})

export const CreateTransactionSchema = TransactionSchema.omit({ 
  transaction_id: true, 
  tenant_id: true 
})

export const UpdateTransactionSchema = CreateTransactionSchema.partial()

// ===== FI INVOICE SCHEMAS =====
export const InvoiceSchema = z.object({
  invoice_id: z.string().uuid('ID da fatura deve ser um UUID válido'),
  invoice_number: z.string().min(1, 'Número da fatura é obrigatório'),
  customer_id: z.string().uuid('ID do cliente deve ser um UUID válido').optional(),
  vendor_id: z.string().uuid('ID do fornecedor deve ser um UUID válido').optional(),
  total_amount_cents: z.number().nonnegative('Valor total deve ser não negativo'),
  invoice_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD').optional(),
  tenant_id: z.string().min(1, 'Tenant ID é obrigatório')
})

export const CreateInvoiceSchema = InvoiceSchema.omit({ 
  invoice_id: true, 
  tenant_id: true 
})

export const UpdateInvoiceSchema = CreateInvoiceSchema.partial()

// ===== FI CASHFLOW SCHEMAS =====
export const CashflowSchema = z.object({
  period: z.string().min(1, 'Período é obrigatório'),
  opening_balance_cents: z.number().nonnegative('Saldo inicial deve ser não negativo'),
  total_inflows_cents: z.number().nonnegative('Total de entradas deve ser não negativo'),
  total_outflows_cents: z.number().nonnegative('Total de saídas deve ser não negativo'),
  closing_balance_cents: z.number().nonnegative('Saldo final deve ser não negativo'),
  tenant_id: z.string().min(1, 'Tenant ID é obrigatório')
})

export const CreateCashflowSchema = CashflowSchema.omit({ 
  tenant_id: true 
})

// ===== TYPES =====
export type Account = z.infer<typeof AccountSchema>
export type CreateAccount = z.infer<typeof CreateAccountSchema>
export type UpdateAccount = z.infer<typeof UpdateAccountSchema>

export type Transaction = z.infer<typeof TransactionSchema>
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>
export type UpdateTransaction = z.infer<typeof UpdateTransactionSchema>

export type Invoice = z.infer<typeof InvoiceSchema>
export type CreateInvoice = z.infer<typeof CreateInvoiceSchema>
export type UpdateInvoice = z.infer<typeof UpdateInvoiceSchema>

export type Cashflow = z.infer<typeof CashflowSchema>
export type CreateCashflow = z.infer<typeof CreateCashflowSchema>
