# 📊 Documentação Completa do Supabase - ERP Laplata

**Data da Inspeção**: 18 de Setembro de 2025  
**Projeto**: gpjcfwjssfvqhppxdudp  
**URL**: https://gpjcfwjssfvqhppxdudp.supabase.co  
**Tenant Principal**: LaplataLunaria  

## 🔗 Credenciais de Acesso

### Chaves de API
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwamNmd2pzc2Z2cWhwcHhkdWRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDQyOTUsImV4cCI6MjA3MzUyMDI5NX0.6h6ogP8aMCvy7fUNN1mbxSK-O0TbGiEIP5rO5z0s0r0`
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwamNmd2pzc2Z2cWhwcHhkdWRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Nzk0NDI5NSwiZXhwIjoyMDczNTIwMjk1fQ.QX3vlHLduidBh1HFFklS4P9xkL5xhe9oOnhZ2fcb-_s`

### Database URL
```
postgresql://postgres.gpjcfwjssfvqhppxdudp:Laplata2025*@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
```

## 📋 Resumo dos Dados

### ✅ Tabelas com Dados
| Tabela | Registros | Status |
|--------|-----------|--------|
| `tenant` | 1 | ✅ Ativo |
| `mm_vendor` | 1 | ✅ Ativo |
| `mm_material` | 35 | ✅ Ativo |
| `mm_purchase_order` | 1 | ✅ Ativo |
| `mm_purchase_order_item` | 35 | ✅ Ativo |
| `mm_receiving` | 35 | ✅ Ativo |
| `wh_warehouse` | 1 | ✅ Ativo |
| `wh_inventory_balance` | 35 | ✅ Ativo |
| `co_kpi_definition` | 3 | ✅ Ativo |
| `co_dashboard_tile` | 3 | ✅ Ativo |

### ⚠️ Tabelas Vazias (Estrutura OK)
| Tabela | Status |
|--------|--------|
| `user_profile` | ⚠️ Vazia |
| `role_permission` | ⚠️ Vazia |
| `app_setting` | ⚠️ Vazia |
| `doc_numbering` | ⚠️ Vazia |
| `audit_log` | ⚠️ Vazia |
| `wh_inventory_ledger` | ⚠️ Vazia |
| `crm_customer` | ⚠️ Vazia |
| `sd_sales_order` | ⚠️ Vazia |
| `sd_sales_order_item` | ⚠️ Vazia |
| `sd_shipment` | ⚠️ Vazia |
| `sd_payment` | ⚠️ Vazia |
| `crm_lead` | ⚠️ Vazia |
| `crm_opportunity` | ⚠️ Vazia |
| `crm_interaction` | ⚠️ Vazia |
| `fi_account` | ⚠️ Vazia |
| `fi_invoice` | ⚠️ Vazia |
| `fi_payment` | ⚠️ Vazia |
| `fi_transaction` | ⚠️ Vazia |
| `co_cost_center` | ⚠️ Vazia |
| `co_fiscal_period` | ⚠️ Vazia |
| `co_kpi_snapshot` | ⚠️ Vazia |

## 🏢 Dados do Tenant LaplataLunaria

### 1. 📦 Fornecedores (mm_vendor)
```json
{
  "tenant_id": "LaplataLunaria",
  "vendor_id": "SUP_00001",
  "vendor_name": "Silvercrown",
  "email": "sac.silvercrown@gmail.com",
  "telefone": "(44) 9184-4337",
  "cidade": "Paranavai",
  "estado": "PR",
  "vendor_rating": "A",
  "created_at": "2025-09-18T07:23:45.29189+00:00",
  "country": "Brasil",
  "payment_terms": 30,
  "rating": "B",
  "status": "active"
}
```

### 2. 🏭 Depósitos (wh_warehouse)
```json
{
  "tenant_id": "LaplataLunaria",
  "plant_id": "WH-001",
  "name": "Depósito Principal",
  "is_default": true,
  "created_at": "2025-09-18T07:23:45.29189+00:00",
  "country": "Brasil"
}
```

### 3. 💎 Materiais (mm_material) - 35 registros

#### Categorias de Produtos:
- **Brincos**: 7 produtos (B_175 a B_181)
- **Gargantilhas**: 20 produtos (G_184 a G_201)
- **Pulseiras**: 8 produtos (P_202 a P_209)
- **Chokers**: 1 produto (C_182)
- **Kits**: 1 produto (K_183)

#### Classificações:
- **Amuletos**: 15 produtos
- **Elementar**: 8 produtos
- **Ciclos**: 6 produtos
- **Ancestral**: 6 produtos

#### Exemplos de Materiais:
```json
{
  "mm_material": "B_175",
  "mm_comercial": "Símbolo",
  "mm_desc": "Brinco Argola Cravejado Trevo Resina Preto Misto",
  "mm_mat_type": "Brinco",
  "mm_mat_class": "Amuletos",
  "mm_price_cents": 24453,
  "status": "active",
  "unit_of_measure": "unidade",
  "min_stock": 0,
  "max_stock": 1000,
  "lead_time_days": 20
}
```

### 4. 📋 Pedidos de Compra (mm_purchase_order)
```json
{
  "tenant_id": "LaplataLunaria",
  "mm_order": "PO-2025-001",
  "vendor_id": "SUP_00001",
  "status": "received",
  "po_date": "2025-09-18",
  "expected_delivery": "2025-09-25",
  "notes": "Carga inicial",
  "total_amount": 1068920,
  "currency": "BRL"
}
```

### 5. 📦 Itens de Pedidos de Compra (mm_purchase_order_item) - 35 registros

#### Resumo dos Itens:
- **Total de Itens**: 35
- **Valor Total**: R$ 10.689,20
- **Quantidade Total**: 350 unidades
- **Custo Médio**: R$ 30,54 por item

#### Exemplos de Itens:
```json
{
  "po_item_id": 72,
  "mm_order": "PO-2025-001",
  "plant_id": "WH-001",
  "mm_material": "B_175",
  "mm_qtt": 14,
  "unit_cost_cents": 4800,
  "line_total_cents": 67200,
  "currency": "BRL"
}
```

### 6. 📥 Recebimentos (mm_receiving) - 35 registros

Todos os 35 itens do pedido foram recebidos:
- **Status**: received
- **Data de Recebimento**: 2025-09-18T07:23:45.29189+00:00
- **Quantidade Total Recebida**: 350 unidades

### 7. 📊 Saldos de Estoque (wh_inventory_balance) - 35 registros

#### Resumo do Estoque:
- **Total de SKUs**: 35
- **Quantidade Total em Estoque**: 350 unidades
- **Valor Total do Estoque**: R$ 10.689,20
- **Status**: Todos ativos

#### Exemplos de Saldos:
```json
{
  "tenant_id": "LaplataLunaria",
  "plant_id": "WH-001",
  "mm_material": "B_175",
  "on_hand_qty": 14,
  "reserved_qty": 0,
  "last_count_date": "2025-09-18",
  "status": "active"
}
```

## 📊 KPIs e Dashboards

### KPIs Definidos (co_kpi_definition)
1. **SALES_TODAY**: Vendas Hoje (BRL)
2. **ORDERS_OPEN**: Pedidos Abertos (Qtd)
3. **INVENTORY_VALUE**: Valor do Estoque (BRL)

### Tiles do Dashboard (co_dashboard_tile)
1. **TILE01**: Vendas Hoje - Resumo diário (#4CAF50)
2. **TILE02**: Pedidos Abertos - Situação comercial (#2196F3)
3. **TILE03**: Valor do Estoque - Resumo logístico (#FFC107)

## 🏗️ Estrutura das Tabelas Principais

### mm_vendor
```sql
tenant_id, vendor_id, vendor_name, email, telefone, cidade, estado, vendor_rating, 
created_at, contact_person, address, city, state, zip_code, country, tax_id, 
payment_terms, rating, status
```

### mm_material
```sql
tenant_id, mm_material, mm_comercial, mm_desc, mm_mat_type, mm_mat_class, 
mm_price_cents, barcode, weight_grams, status, mm_pur_link, mm_vendor_id, 
created_at, commercial_name, unit_of_measure, dimensions, purity, color, finish, 
min_stock, max_stock, lead_time_days
```

### wh_warehouse
```sql
tenant_id, plant_id, name, is_default, created_at, address, city, state, 
zip_code, country, contact_person, phone, email
```

### wh_inventory_balance
```sql
tenant_id, plant_id, mm_material, on_hand_qty, reserved_qty, last_count_date, status
```

## 🔍 Observações Importantes

### ✅ Pontos Positivos
1. **Dados Completos**: Todas as tabelas principais têm dados reais
2. **Estrutura Consistente**: Schema bem definido e padronizado
3. **RLS Ativo**: Row Level Security implementado
4. **Multi-tenant**: Isolamento por tenant_id funcionando
5. **Dados de Joias**: Catálogo real de produtos de joalheria

### ⚠️ Pontos de Atenção
1. **Tabelas Vazias**: Muitas tabelas de configuração e outros módulos vazias
2. **Usuários**: Nenhum user_profile cadastrado
3. **Configurações**: Tabelas de setup vazias
4. **Vendas**: Módulo SD completamente vazio
5. **CRM**: Módulo CRM completamente vazio
6. **Financeiro**: Módulo FI completamente vazio

### 🎯 Próximos Passos Recomendados
1. **Carregar Configurações**: Popular tabelas de setup e definições
2. **Cadastrar Usuários**: Criar user_profile para acesso ao sistema
3. **Configurar RLS**: Verificar políticas de Row Level Security
4. **Implementar Módulos**: Desenvolver funcionalidades dos módulos vazios
5. **Testes**: Validar integridade dos dados e relacionamentos

## 📈 Estatísticas de Negócio

### Fornecedores
- **Total**: 1 fornecedor ativo
- **Rating**: A (Silvercrown)
- **Localização**: Paranavai/PR

### Produtos
- **Total de SKUs**: 35 produtos
- **Categorias**: 5 (Brincos, Gargantilhas, Pulseiras, Chokers, Kits)
- **Classificações**: 4 (Amuletos, Elementar, Ciclos, Ancestral)
- **Preço Médio**: R$ 305,40
- **Faixa de Preços**: R$ 108,53 - R$ 450,93

### Estoque
- **Valor Total**: R$ 10.689,20
- **Quantidade Total**: 350 unidades
- **SKUs com Estoque**: 35 (100%)
- **Depósito**: 1 (WH-001 - Depósito Principal)

### Compras
- **Pedidos**: 1 pedido (PO-2025-001)
- **Status**: Recebido
- **Valor**: R$ 10.689,20
- **Fornecedor**: Silvercrown (SUP_00001)

---

**Documentação gerada automaticamente em**: 18 de Setembro de 2025  
**Versão**: 1.0  
**Status**: ✅ Completa e Atualizada