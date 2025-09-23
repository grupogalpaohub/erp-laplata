# 🔍 ANÁLISE COMPLETA DA ESTRUTURA SUPABASE - ERP LAPLATA

## 📋 INFORMAÇÕES DE ACESSO SALVAS
**Cursor Access Token:** `sbp_3b3237d0fe0b5ea21f7e0b9903322176300bf386`

---

## 🗄️ ESTRUTURA ATUAL DAS TABELAS PRINCIPAIS

### 📦 MM - MATERIAL MANAGEMENT

#### `mm_vendor` (Fornecedores)
```sql
tenant_id TEXT NOT NULL
vendor_id TEXT PRIMARY KEY
vendor_name TEXT NOT NULL
email TEXT
telefone TEXT
cidade TEXT
estado TEXT
vendor_rating TEXT
created_at TIMESTAMPTZ DEFAULT NOW()
```

#### `mm_material` (Materiais)
```sql
tenant_id TEXT NOT NULL
mm_material TEXT PRIMARY KEY
mm_comercial TEXT
mm_desc TEXT NOT NULL
mm_mat_type material_type
mm_mat_class material_class
mm_price_cents INTEGER DEFAULT 0
barcode TEXT
weight_grams INTEGER
status TEXT DEFAULT 'active'
mm_pur_link TEXT
mm_vendor_id TEXT REFERENCES mm_vendor(vendor_id)
created_at TIMESTAMPTZ DEFAULT NOW()
```

#### `mm_purchase_order` (Pedidos de Compra)
```sql
tenant_id TEXT NOT NULL
mm_order TEXT PRIMARY KEY
vendor_id TEXT NOT NULL REFERENCES mm_vendor(vendor_id)
status order_status DEFAULT 'draft'
po_date DATE DEFAULT CURRENT_DATE
expected_delivery DATE
notes TEXT
created_at TIMESTAMPTZ DEFAULT NOW()
```

#### `mm_purchase_order_item` (Itens de Pedidos de Compra)
```sql
tenant_id TEXT NOT NULL
po_item_id BIGSERIAL PRIMARY KEY
mm_order TEXT NOT NULL REFERENCES mm_purchase_order(mm_order)
plant_id TEXT NOT NULL
mm_material TEXT NOT NULL REFERENCES mm_material(mm_material)
mm_qtt NUMERIC NOT NULL DEFAULT 0
unit_cost_cents INTEGER NOT NULL DEFAULT 0
line_total_cents INTEGER NOT NULL DEFAULT 0
notes TEXT
```

### 🛒 SD - SALES & DISTRIBUTION

#### `crm_customer` (Clientes)
```sql
tenant_id TEXT NOT NULL
customer_id TEXT PRIMARY KEY
name TEXT NOT NULL
email TEXT
telefone TEXT
customer_type customer_type DEFAULT 'PF'
status TEXT DEFAULT 'active'
created_date DATE DEFAULT CURRENT_DATE
```

#### `sd_sales_order` (Pedidos de Venda) - ⚠️ ESTRUTURA ATUAL
```sql
tenant_id TEXT NOT NULL
so_id TEXT PRIMARY KEY
customer_id TEXT NOT NULL REFERENCES crm_customer(customer_id)
status order_status DEFAULT 'draft'
order_date DATE DEFAULT CURRENT_DATE
expected_ship DATE
total_cents INTEGER DEFAULT 0
created_at TIMESTAMPTZ DEFAULT NOW()
```

#### `sd_sales_order_item` (Itens de Pedidos de Venda) - ⚠️ ESTRUTURA ATUAL
```sql
tenant_id TEXT NOT NULL
so_id TEXT NOT NULL REFERENCES sd_sales_order(so_id)
sku TEXT NOT NULL
quantity NUMERIC NOT NULL DEFAULT 0
unit_price_cents INTEGER NOT NULL DEFAULT 0
line_total_cents INTEGER NOT NULL DEFAULT 0
row_no INTEGER DEFAULT 1
PRIMARY KEY (tenant_id, so_id, sku, row_no)
```

### 🏭 WH - WAREHOUSE MANAGEMENT

#### `wh_warehouse` (Depósitos)
```sql
tenant_id TEXT NOT NULL
plant_id TEXT PRIMARY KEY
name TEXT NOT NULL
is_default BOOLEAN DEFAULT FALSE
created_at TIMESTAMPTZ DEFAULT NOW()
```

#### `wh_inventory_balance` (Saldo de Estoque)
```sql
tenant_id TEXT NOT NULL
plant_id TEXT NOT NULL
mm_material TEXT NOT NULL
on_hand_qty NUMERIC DEFAULT 0
reserved_qty NUMERIC DEFAULT 0
PRIMARY KEY (tenant_id, plant_id, mm_material)
```

### 💰 FI - FINANCIAL MANAGEMENT

#### `fi_account` (Contas Financeiras)
```sql
tenant_id TEXT NOT NULL
account_id TEXT PRIMARY KEY
name TEXT NOT NULL
type account_type NOT NULL
currency TEXT DEFAULT 'BRL'
is_active BOOLEAN DEFAULT TRUE
created_at TIMESTAMPTZ DEFAULT NOW()
```

#### `fi_invoice` (Faturas)
```sql
tenant_id TEXT NOT NULL
invoice_id TEXT PRIMARY KEY
source_type TEXT NOT NULL
source_id TEXT NOT NULL
customer_id TEXT REFERENCES crm_customer(customer_id)
vendor_id TEXT REFERENCES mm_vendor(vendor_id)
amount_cents INTEGER NOT NULL DEFAULT 0
due_date DATE
status order_status DEFAULT 'pending'
created_date DATE DEFAULT CURRENT_DATE
```

### 📊 CO - CONTROLLING

#### `co_kpi_definition` (Definições de KPI)
```sql
tenant_id TEXT NOT NULL
kpi_key TEXT PRIMARY KEY
name TEXT NOT NULL
unit TEXT
description TEXT
created_at TIMESTAMPTZ DEFAULT NOW()
```

#### `co_kpi_snapshot` (Snapshots de KPI)
```sql
tenant_id TEXT NOT NULL
kpi_key TEXT NOT NULL REFERENCES co_kpi_definition(kpi_key)
snapshot_at TIMESTAMPTZ NOT NULL
value_number NUMERIC
meta_json TEXT
PRIMARY KEY (tenant_id, kpi_key, snapshot_at)
```

---

## ⚠️ CAMPOS FALTANTES CRÍTICOS

### `sd_sales_order` - CAMPOS NECESSÁRIOS:
```sql
-- Campos que PRECISAM ser adicionados:
doc_no TEXT
payment_method TEXT
payment_term TEXT
total_final_cents INTEGER DEFAULT 0
total_negotiated_cents INTEGER DEFAULT 0
notes TEXT
updated_at TIMESTAMPTZ DEFAULT NOW()
```

### `sd_sales_order_item` - CAMPOS NECESSÁRIOS:
```sql
-- Campos que PRECISAM ser adicionados:
material_id TEXT REFERENCES mm_material(mm_material)
unit_price_cents_at_order INTEGER DEFAULT 0

-- Constraint que PRECISA ser alterada:
-- De: PRIMARY KEY (tenant_id, so_id, sku, row_no)
-- Para: PRIMARY KEY (tenant_id, so_id, material_id, row_no)
```

---

## 🔧 FUNÇÕES E TRIGGERS EXISTENTES

### Funções Principais:
1. **`next_doc_number(tenant_id, doc_type)`** - Geração de números sequenciais
2. **`update_inventory_balance(...)`** - Atualização de estoque
3. **`refresh_kpi_snapshots(tenant_id)`** - Atualização de KPIs
4. **`log_audit(...)`** - Log de auditoria

### Triggers Identificados:
- Triggers de numeração sequencial para PO e SO
- Triggers de atualização de `updated_at`
- Triggers de auditoria

---

## 🚨 PROBLEMAS IDENTIFICADOS

### 1. **API de Pedidos de Venda**
- **Problema**: Tentando usar campos que não existem
- **Solução**: Ajustar API para usar apenas campos existentes

### 2. **Estrutura de Itens de Pedido**
- **Problema**: `sku` em vez de `material_id`
- **Solução**: Adicionar campo `material_id` e ajustar constraint

### 3. **Campos de Pagamento**
- **Problema**: Campos `payment_method`, `payment_term` não existem
- **Solução**: Adicionar campos na tabela `sd_sales_order`

---

## 📋 AÇÕES NECESSÁRIAS NO SUPABASE

### 1. **Adicionar Campos em `sd_sales_order`:**
```sql
ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS doc_no TEXT;
ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS payment_term TEXT;
ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS total_final_cents INTEGER DEFAULT 0;
ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS total_negotiated_cents INTEGER DEFAULT 0;
ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE sd_sales_order ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
```

### 2. **Adicionar Campos em `sd_sales_order_item`:**
```sql
ALTER TABLE sd_sales_order_item ADD COLUMN IF NOT EXISTS material_id TEXT REFERENCES mm_material(mm_material);
ALTER TABLE sd_sales_order_item ADD COLUMN IF NOT EXISTS unit_price_cents_at_order INTEGER DEFAULT 0;
```

### 3. **Atualizar Constraint de Chave Primária:**
```sql
ALTER TABLE sd_sales_order_item DROP CONSTRAINT IF EXISTS sd_sales_order_item_pkey;
ALTER TABLE sd_sales_order_item ADD CONSTRAINT sd_sales_order_item_pkey 
  PRIMARY KEY (tenant_id, so_id, material_id, row_no);
```

---

## 🎯 STATUS ATUAL DO SISTEMA

### ✅ **FUNCIONANDO:**
- Criação de pedidos de compra
- Visualização de pedidos de compra
- Gestão de materiais
- Gestão de fornecedores
- Gestão de clientes
- Sistema de numeração sequencial

### ⚠️ **PARCIALMENTE FUNCIONANDO:**
- Criação de pedidos de venda (campos limitados)
- Visualização de pedidos de venda (campos limitados)

### ❌ **NÃO FUNCIONANDO:**
- Campos de pagamento em pedidos de venda
- Campos de valor negociado
- Material_id em itens de pedido de venda

---

## 🔄 PRÓXIMOS PASSOS

1. **Aplicar mudanças no Supabase** (você fará)
2. **Atualizar APIs** para usar novos campos
3. **Testar funcionalidades** completas
4. **Validar integração** entre módulos

---

**Data da Análise:** 23/01/2025  
**Status:** Aguardando mudanças no Supabase  
**Prioridade:** ALTA - Campos críticos faltando
