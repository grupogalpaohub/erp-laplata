# 🗄️ DATABASE MAPPING - ERP V2

> **Fonte:** Database dump atual (intocado)
> **Objetivo:** Mapeamento exato para UI/UX

---

## 📊 **MÓDULO MM (Material Management)**

### **Tabela: `mm_material`**
| Coluna | Tipo | Obrigatório | Enum | Label UI | Validação |
|--------|------|-------------|------|----------|-----------|
| `mm_material` | string | ✅ | - | ID Material | UUID |
| `material_name` | string | ✅ | - | Nome | min(1) |
| `unit_price_cents` | number | ✅ | - | Preço Unitário | positive() |
| `category` | string | ✅ | - | Categoria | min(1) |
| `classification` | string | ✅ | - | Classificação | min(1) |
| `vendor_id` | uuid | ❌ | - | Fornecedor | uuid() |
| `tenant_id` | string | ✅ | - | Tenant | - |

### **Tabela: `mm_vendor`**
| Coluna | Tipo | Obrigatório | Enum | Label UI | Validação |
|--------|------|-------------|------|----------|-----------|
| `vendor_id` | string | ✅ | - | ID Fornecedor | UUID |
| `vendor_name` | string | ✅ | - | Nome | min(1) |
| `email` | string | ❌ | - | Email | email() |
| `phone` | string | ❌ | - | Telefone | - |
| `rating` | string | ❌ | - | Avaliação | - |
| `tenant_id` | string | ✅ | - | Tenant | - |

### **Tabela: `mm_purchase_order`**
| Coluna | Tipo | Obrigatório | Enum | Label UI | Validação |
|--------|------|-------------|------|----------|-----------|
| `mm_order` | string | ✅ | - | ID Pedido | - |
| `vendor_id` | string | ✅ | - | Fornecedor | uuid() |
| `order_date` | date | ✅ | - | Data Pedido | - |
| `expected_delivery` | date | ❌ | - | Entrega Esperada | - |
| `total_amount_cents` | number | ✅ | - | Total | - |
| `status` | string | ✅ | draft, received | Status | enum |
| `tenant_id` | string | ✅ | - | Tenant | - |

### **Tabela: `mm_purchase_order_item`**
| Coluna | Tipo | Obrigatório | Enum | Label UI | Validação |
|--------|------|-------------|------|----------|-----------|
| `po_item_id` | number | ✅ | - | ID Item | - |
| `tenant_id` | string | ✅ | - | Tenant | - |
| `mm_order` | string | ✅ | - | Pedido | - |
| `mm_material` | string | ✅ | - | Material | uuid() |
| `quantity` | number | ✅ | - | Quantidade | positive() |
| `unit_price_cents` | number | ✅ | - | Preço Unitário | positive() |
| `total_cents` | number | ✅ | - | Total | - |
| `plant_id` | string | ✅ | - | Planta | - |

---

## 📊 **MÓDULO SD (Sales & Distribution)**

### **Tabela: `crm_customer`**
| Coluna | Tipo | Obrigatório | Enum | Label UI | Validação |
|--------|------|-------------|------|----------|-----------|
| `customer_id` | string | ✅ | - | ID Cliente | UUID |
| `customer_name` | string | ✅ | - | Nome | min(1) |
| `email` | string | ❌ | - | Email | email() |
| `phone` | string | ❌ | - | Telefone | - |
| `customer_type` | string | ❌ | PF, PJ | Tipo | enum |
| `preferred_payment_method` | string | ❌ | - | Método Pagamento | - |
| `tenant_id` | string | ✅ | - | Tenant | - |

### **Tabela: `sd_sales_order`**
| Coluna | Tipo | Obrigatório | Enum | Label UI | Validação |
|--------|------|-------------|------|----------|-----------|
| `so_id` | string | ✅ | - | ID Pedido | - |
| `customer_id` | string | ✅ | - | Cliente | uuid() |
| `order_date` | date | ✅ | - | Data Pedido | - |
| `expected_ship` | date | ❌ | - | Expedição Esperada | - |
| `total_amount_cents` | number | ✅ | - | Total | - |
| `status` | string | ✅ | draft, confirmed, shipped, delivered | Status | enum |
| `tenant_id` | string | ✅ | - | Tenant | - |

### **Tabela: `sd_sales_order_item`**
| Coluna | Tipo | Obrigatório | Enum | Label UI | Validação |
|--------|------|-------------|------|----------|-----------|
| `tenant_id` | string | ✅ | - | Tenant | - |
| `so_id` | string | ✅ | - | Pedido | - |
| `row_no` | number | ✅ | - | Linha | - |
| `mm_material` | string | ✅ | - | Material | uuid() |
| `quantity` | number | ✅ | - | Quantidade | positive() |
| `unit_price_cents` | number | ✅ | - | Preço Unitário | positive() |
| `total_cents` | number | ✅ | - | Total | - |

---

## 📊 **MÓDULO WH (Warehouse Management)**

### **Tabela: `wh_warehouse`**
| Coluna | Tipo | Obrigatório | Enum | Label UI | Validação |
|--------|------|-------------|------|----------|-----------|
| `plant_id` | string | ✅ | - | ID Planta | - |
| `plant_name` | string | ✅ | - | Nome | min(1) |
| `address` | string | ❌ | - | Endereço | - |
| `tenant_id` | string | ✅ | - | Tenant | - |

### **Tabela: `wh_inventory_balance`**
| Coluna | Tipo | Obrigatório | Enum | Label UI | Validação |
|--------|------|-------------|------|----------|-----------|
| `tenant_id` | string | ✅ | - | Tenant | - |
| `plant_id` | string | ✅ | - | Planta | - |
| `mm_material` | string | ✅ | - | Material | uuid() |
| `available_qty` | number | ✅ | - | Disponível | - |
| `reserved_qty` | number | ✅ | - | Reservado | - |
| `blocked_qty` | number | ✅ | - | Bloqueado | - |

### **Tabela: `wh_inventory_ledger`**
| Coluna | Tipo | Obrigatório | Enum | Label UI | Validação |
|--------|------|-------------|------|----------|-----------|
| `ledger_id` | number | ✅ | - | ID Movimento | - |
| `tenant_id` | string | ✅ | - | Tenant | - |
| `plant_id` | string | ✅ | - | Planta | - |
| `mm_material` | string | ✅ | - | Material | uuid() |
| `movement_type` | string | ✅ | - | Tipo Movimento | - |
| `qty_change` | number | ✅ | - | Quantidade | - |
| `reference_type` | string | ❌ | - | Tipo Referência | - |
| `reference_id` | string | ❌ | - | ID Referência | - |

---

## 📊 **MÓDULO FI (Financial)**

### **Tabela: `fi_account`**
| Coluna | Tipo | Obrigatório | Enum | Label UI | Validação |
|--------|------|-------------|------|----------|-----------|
| `account_id` | string | ✅ | - | ID Conta | UUID |
| `account_code` | string | ✅ | - | Código | min(1) |
| `account_name` | string | ✅ | - | Nome | min(1) |
| `account_type` | string | ✅ | - | Tipo | - |
| `parent_account_id` | string | ❌ | - | Conta Pai | uuid() |
| `tenant_id` | string | ✅ | - | Tenant | - |

### **Tabela: `fi_transaction`**
| Coluna | Tipo | Obrigatório | Enum | Label UI | Validação |
|--------|------|-------------|------|----------|-----------|
| `transaction_id` | string | ✅ | - | ID Transação | UUID |
| `account_id` | string | ✅ | - | Conta | uuid() |
| `type` | string | ✅ | debit, credit | Tipo | enum |
| `amount_cents` | number | ✅ | - | Valor | positive() |
| `description` | string | ❌ | - | Descrição | - |
| `reference_type` | string | ❌ | - | Tipo Referência | - |
| `reference_id` | string | ❌ | - | ID Referência | - |
| `tenant_id` | string | ✅ | - | Tenant | - |

### **Tabela: `fi_invoice`**
| Coluna | Tipo | Obrigatório | Enum | Label UI | Validação |
|--------|------|-------------|------|----------|-----------|
| `invoice_id` | string | ✅ | - | ID Fatura | UUID |
| `invoice_number` | string | ✅ | - | Número | min(1) |
| `customer_id` | string | ❌ | - | Cliente | uuid() |
| `vendor_id` | string | ❌ | - | Fornecedor | uuid() |
| `total_amount_cents` | number | ✅ | - | Total | - |
| `invoice_date` | date | ✅ | - | Data | - |
| `due_date` | date | ❌ | - | Vencimento | - |
| `tenant_id` | string | ✅ | - | Tenant | - |

---

## 🔧 **FUNÇÕES DISPONÍVEIS**

### **Cálculos Automáticos**
```sql
-- Totais de pedidos de compra
calculate_po_item_totals()

-- Totais de pedidos de venda
calculate_so_item_totals()

-- Atualização de totais
fn_mm_update_po_total(p_po_id text)
update_sales_order_total()
```

### **Gestão de Estoque**
```sql
-- Atualização de saldo
update_inventory_balance(p_tenant_id text, p_plant_id text, p_mm_material text, p_qty_change numeric, p_movement_type text)

-- Reserva de estoque
wh_reserve(p_tenant text, p_plant text, p_material text, p_qty numeric, p_ref_type text, p_ref_id text)

-- Liberação de estoque
wh_release(p_tenant text, p_plant text, p_material text, p_qty numeric, p_ref_type text, p_ref_id text)
```

### **Documentação**
```sql
-- Próximo número de documento
next_doc_number(p_tenant_id text, p_doc_type text)

-- Atribuição de número de SO
so_assign_doc_no()
```

---

## 📋 **SCHEMAS ZOD SUGERIDOS**

### **Material Schema**
```typescript
const MaterialSchema = z.object({
  material_name: z.string().min(1, 'Nome obrigatório'),
  unit_price_cents: z.number().positive('Preço deve ser positivo'),
  category: z.string().min(1, 'Categoria obrigatória'),
  classification: z.string().min(1, 'Classificação obrigatória'),
  vendor_id: z.string().uuid('ID fornecedor inválido').optional()
})
```

### **Purchase Order Schema**
```typescript
const PurchaseOrderSchema = z.object({
  vendor_id: z.string().uuid('Fornecedor obrigatório'),
  order_date: z.date(),
  expected_delivery: z.date().optional(),
  status: z.enum(['draft', 'received'])
})
```

### **Sales Order Schema**
```typescript
const SalesOrderSchema = z.object({
  customer_id: z.string().uuid('Cliente obrigatório'),
  order_date: z.date(),
  expected_ship: z.date().optional(),
  status: z.enum(['draft', 'confirmed', 'shipped', 'delivered'])
})
```

---

## 🎯 **KPIs SUGERIDOS**

### **MM KPIs**
```sql
-- Spend MTD
SELECT SUM(total_amount_cents) FROM mm_purchase_order 
WHERE tenant_id = current_tenant() AND order_date >= date_trunc('month', now())

-- POs Abertos
SELECT COUNT(*) FROM mm_purchase_order 
WHERE tenant_id = current_tenant() AND status = 'draft'

-- Lead Time Médio
SELECT AVG(expected_delivery - order_date) FROM mm_purchase_order 
WHERE tenant_id = current_tenant() AND expected_delivery IS NOT NULL
```

### **SD KPIs**
```sql
-- Receita MTD
SELECT SUM(total_amount_cents) FROM sd_sales_order 
WHERE tenant_id = current_tenant() AND order_date >= date_trunc('month', now())

-- Pedidos Abertos
SELECT COUNT(*) FROM sd_sales_order 
WHERE tenant_id = current_tenant() AND status IN ('draft', 'confirmed')

-- Ticket Médio
SELECT AVG(total_amount_cents) FROM sd_sales_order 
WHERE tenant_id = current_tenant() AND status = 'delivered'
```

### **WH KPIs**
```sql
-- Giro Médio
SELECT AVG(available_qty * unit_price_cents) FROM wh_inventory_balance 
WHERE tenant_id = current_tenant()

-- Rupturas Evitadas
SELECT COUNT(*) FROM wh_inventory_balance 
WHERE tenant_id = current_tenant() AND available_qty > 0
```

### **FI KPIs**
```sql
-- DRE Simplificada
SELECT 
  (SELECT SUM(amount_cents) FROM fi_transaction WHERE type = 'credit' AND tenant_id = current_tenant()) as receita,
  (SELECT SUM(amount_cents) FROM fi_transaction WHERE type = 'debit' AND tenant_id = current_tenant()) as despesas

-- Aging Básico
SELECT COUNT(*) FROM fi_invoice 
WHERE tenant_id = current_tenant() AND due_date < now()
```

---

## 🚀 **PRÓXIMOS PASSOS**

1. **Usar este mapeamento** para criar formulários e tabelas
2. **Seguir guardrails** para cada módulo
3. **Validar com dump** antes de implementar
4. **Testar RLS** em cada funcionalidade

**📝 Este arquivo é a fonte única da verdade para mapeamento database → UI!**
