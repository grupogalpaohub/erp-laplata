# 🗄️ Configuração do Supabase - ERP Laplata

## 📋 Resumo da Configuração

O Supabase está configurado com:
- **Project ID**: `gpjcfwjssfvqhppxdudp`
- **URL**: `https://gpjcfwjssfvqhppxdudp.supabase.co`
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (usar apenas no backend)

## 🚀 Passos para Configuração

### 1. Instalar Supabase CLI

```bash
# Via npm (recomendado)
npm install -g supabase

# Ou via npx
npx supabase --version
```

### 2. Fazer Login

```bash
supabase login
```

### 3. Conectar ao Projeto

```bash
supabase link --project-ref gpjcfwjssfvqhppxdudp
```

### 4. Aplicar Migrations

```bash
supabase db push
```

### 5. Executar Seeds

```bash
supabase db seed
```

### 6. Deploy das Edge Functions

```bash
supabase functions deploy setup-mm
supabase functions deploy po-create
supabase functions deploy so-create
supabase functions deploy kpi-refresh
```

## 🗄️ Estrutura do Banco de Dados

### Migrations Aplicadas

1. **20240101000001_initial_schema.sql**
   - Tabelas principais do sistema
   - Tipos customizados
   - Relacionamentos

2. **20240101000002_setup_tables.sql**
   - Tabelas de configuração por módulo
   - Definições e listas

3. **20240101000003_rls_policies.sql**
   - Row Level Security habilitado
   - Políticas de isolamento por tenant

4. **20240101000004_functions_triggers.sql**
   - Funções de negócio
   - Triggers automáticos
   - Índices de performance

### Seeds Executados

1. **01_initial_data.sql**
   - Tenant LaplataLunaria
   - Configurações iniciais
   - Definições padrão

2. **02_sample_data.sql**
   - Dados de exemplo
   - Materiais, clientes, pedidos
   - KPIs iniciais

## ⚡ Edge Functions Deployadas

### setup-mm
- **Endpoint**: `/functions/v1/setup-mm`
- **Métodos**: GET, POST
- **Função**: Configurações do módulo MM

### po-create
- **Endpoint**: `/functions/v1/po-create`
- **Métodos**: POST
- **Função**: Criação de pedidos de compra

### so-create
- **Endpoint**: `/functions/v1/so-create`
- **Métodos**: POST
- **Função**: Criação de pedidos de venda

### kpi-refresh
- **Endpoint**: `/functions/v1/kpi-refresh`
- **Métodos**: POST
- **Função**: Atualização de KPIs

## 🔐 Segurança

### Row Level Security (RLS)
- Todas as tabelas possuem RLS habilitado
- Isolamento por `tenant_id`
- Políticas baseadas em JWT claims

### Autenticação
- Supabase Auth configurado
- Google OAuth habilitado
- JWT tokens para API

## 📊 Módulos Configurados

### MM - Materiais
- Tabelas: `mm_vendor`, `mm_material`, `mm_purchase_order`
- Setup: `mm_setup`, `mm_category_def`, `mm_status_def`

### SD - Vendas
- Tabelas: `crm_customer`, `sd_sales_order`, `sd_shipment`
- Setup: `sd_setup`, `sd_order_status_def`, `sd_channel_def`

### WH - Depósitos
- Tabelas: `wh_warehouse`, `wh_inventory_balance`, `wh_inventory_ledger`
- Setup: `wh_setup`, `wh_inventory_status_def`

### CRM - Leads
- Tabelas: `crm_lead`, `crm_opportunity`, `crm_interaction`
- Setup: `crm_setup`, `crm_source_def`, `crm_lead_status_def`

### FI - Financeiro
- Tabelas: `fi_account`, `fi_invoice`, `fi_payment`, `fi_transaction`
- Setup: `fi_setup`, `fi_payment_method_def`, `fi_payment_terms_def`

### CO - Controladoria
- Tabelas: `co_cost_center`, `co_kpi_definition`, `co_kpi_snapshot`
- Setup: `co_setup`

## 🔧 Funções de Banco

### next_doc_number(tenant_id, doc_type)
- Geração atômica de números de documento
- Formato: PREFIX-YYYYMM-SEQ6

### update_inventory_balance(tenant_id, plant_id, material, qty, movement)
- Atualização de saldo de estoque
- Inserção no ledger

### refresh_kpi_snapshots(tenant_id)
- Atualização de KPIs
- Snapshots assíncronos

## 📈 Performance

### Índices Criados
- `idx_mm_purchase_order_item_tenant_order`
- `idx_wh_inventory_balance_tenant_plant_material`
- `idx_sd_sales_order_item_tenant_so`
- `idx_co_kpi_snapshot_tenant_key_time`

### Otimizações
- Consultas paginadas
- Triggers para cálculos automáticos
- Snapshots para KPIs

## 🌐 Variáveis de Ambiente

### Frontend (NEXT_PUBLIC_*)
```env
NEXT_PUBLIC_SUPABASE_URL=https://gpjcfwjssfvqhppxdudp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_NAME=ERP Laplata
```

### Backend (Edge Functions)
```env
SUPABASE_URL=https://gpjcfwjssfvqhppxdudp.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ✅ Checklist de Verificação

- [ ] Supabase CLI instalado
- [ ] Login realizado
- [ ] Projeto conectado
- [ ] Migrations aplicadas
- [ ] Seeds executados
- [ ] Edge Functions deployadas
- [ ] RLS habilitado
- [ ] Google OAuth configurado
- [ ] Variáveis de ambiente setadas

## 🚨 Troubleshooting

### Erro de RLS
- Verificar se as políticas estão aplicadas
- Confirmar que o JWT contém `tenant_id`

### Erro de Edge Functions
- Verificar se as funções foram deployadas
- Confirmar variáveis de ambiente

### Erro de Conexão
- Verificar URL e chaves
- Confirmar que o projeto está ativo

## 📞 Suporte

Para problemas com Supabase:
1. Verificar logs no Dashboard
2. Consultar documentação oficial
3. Verificar status do serviço