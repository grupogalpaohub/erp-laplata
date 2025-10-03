# 🏗️ ERP REFACTORING BLUEPRINT - PROPOSTA COMPLETA

## 📋 ANÁLISE TÉCNICA DO DATABASE ATUAL

### **✅ ESTRUTURA DATABASE CONFIRMADA:**
- **RLS Ativo:** Todas as tabelas têm Row Level Security implementado
- **Tenant Isolation:** `tenant_id` em todas as tabelas principais
- **Triggers Funcionais:** Sistema de triggers para cálculos automáticos
- **Foreign Keys:** Relacionamentos bem definidos entre módulos
- **Grants Corretos:** Permissões adequadas para `authenticated` e `service_role`

### **🔧 FUNCIONALIDADES DATABASE DISPONÍVEIS:**
- **Cálculos Automáticos:** `calculate_po_item_totals()`, `calculate_so_item_totals()`
- **Inventário:** `update_inventory_balance()`, `wh_reserve()`, `wh_release()`
- **Documentação:** `next_doc_number()`, `so_assign_doc_no()`
- **Auditoria:** `create_audit_log()`, `log_material_price_change()`
- **KPIs:** `refresh_kpi_snapshots()`, `current_tenant()`

---

## 🎯 PROPOSTA DE REFATORAÇÃO COMPLETA

### **ARQUITETURA SIMPLIFICADA:**
```
Frontend (Next.js 14) → APIs (Route Handlers) → Supabase (RLS + Triggers)
```

**Princípios:**
- ✅ **Zero mudanças no database**
- ✅ **RLS automático por tenant_id**
- ✅ **APIs simples e diretas**
- ✅ **UI/UX SAP Fiori (tons escuros)**
- ✅ **Funcionalidade > Estética**

---

## 🏢 MÓDULOS E FUNCIONALIDADES

### **1. MÓDULO MM (MATERIAL MANAGEMENT)**

#### **1.1 Gestão de Materiais**
- **Criação Individual:** Formulário simples com validação
- **Edição em Lote:** Upload CSV + validação + preview
- **Campos Principais:**
  - `mm_material` (PK)
  - `material_name`
  - `unit_price_cents`
  - `category`, `classification`
  - `vendor_id` (FK)

#### **1.2 Pedidos de Compra**
- **Criação:** Header + Items dinâmicos
- **Status:** `draft`, `received` (conforme database)
- **Campos:**
  - `mm_order` (PK)
  - `vendor_id` (FK)
  - `order_date`, `expected_delivery`
  - `total_amount_cents` (calculado por trigger)

#### **1.3 Fornecedores**
- **CRUD Completo:** Create, Read, Update, Delete
- **Campos:**
  - `vendor_id` (PK)
  - `vendor_name`
  - `email`, `phone`
  - `rating` (FK para definições)

#### **1.4 KPIs de Compras**
- **Dashboard:** Cards com métricas
- **Gráficos:** Compras por período, top fornecedores
- **Alertas:** Pedidos em atraso, estoque baixo

### **2. MÓDULO SD (SALES & DISTRIBUTION)**

#### **2.1 Pedidos de Venda**
- **Criação:** Header + Items + Cliente
- **Status:** `draft`, `confirmed`, `shipped`, `delivered`
- **Campos:**
  - `so_id` (PK)
  - `customer_id` (FK)
  - `order_date`, `expected_ship`
  - `total_amount_cents` (calculado por trigger)

#### **2.2 Clientes**
- **CRUD Completo:** Gestão de clientes
- **Campos:**
  - `customer_id` (PK)
  - `customer_name`
  - `email`, `phone`
  - `customer_type` (PF/PJ)
  - `preferred_payment_method` (FK)

#### **2.3 KPIs de Vendas**
- **Dashboard:** Vendas por período, top clientes
- **Gráficos:** Faturamento, conversão
- **Relatórios:** Performance de vendas

### **3. MÓDULO WH (WAREHOUSE MANAGEMENT)**

#### **3.1 Movimentos de Estoque**
- **Entradas:** Recebimento de compras
- **Saídas:** Expedição de vendas
- **Transferências:** Entre warehouses
- **Ajustes:** Inventário físico

#### **3.2 Inventário**
- **Saldo Atual:** `wh_inventory_balance`
- **Histórico:** `wh_inventory_ledger`
- **Status:** Disponível, Reservado, Bloqueado

#### **3.3 KPIs de Warehouse**
- **Dashboard:** Estoque por material, warehouse
- **Alertas:** Estoque baixo, materiais vencidos
- **Gráficos:** Movimentação, turnover

### **4. MÓDULO FI (FINANCIAL)**

#### **4.1 Contas Contábeis**
- **Plano de Contas:** `fi_account`
- **Estrutura:** Hierárquica com códigos

#### **4.2 Transações**
- **Lançamentos:** Débito/Crédito automático
- **Integração:** Com MM e SD via triggers
- **Campos:**
  - `transaction_id` (PK)
  - `account_id` (FK)
  - `type` (debito/credito)
  - `amount_cents`

#### **4.3 Relatórios Financeiros**
- **Balanço:** Por período
- **DRE:** Receita vs Despesa
- **Fluxo de Caixa:** Entradas vs Saídas

---

## 🎨 UI/UX DESIGN (SAP Fiori Dark)

### **Paleta de Cores:**
```css
:root {
  --fiori-primary: #1a1a1a;      /* Fundo principal */
  --fiori-secondary: #2d2d2d;    /* Cards e modais */
  --fiori-accent: #0070f3;       /* Azul primário */
  --fiori-success: #00c851;      /* Verde sucesso */
  --fiori-warning: #ff8800;      /* Laranja alerta */
  --fiori-error: #ff4444;        /* Vermelho erro */
  --fiori-text: #ffffff;         /* Texto principal */
  --fiori-text-muted: #cccccc;   /* Texto secundário */
}
```

### **Componentes Base:**
- **Cards:** Fundo escuro, bordas sutis
- **Botões:** Azul primário, hover effects
- **Formulários:** Inputs com labels claras
- **Tabelas:** Zebra striping, hover rows
- **Modais:** Overlay escuro, conteúdo centralizado

---

## 🔧 IMPLEMENTAÇÃO TÉCNICA

### **1. ESTRUTURA DE ARQUIVOS:**
```
app/
├── (protected)/
│   ├── mm/                    # Material Management
│   │   ├── materials/         # Gestão de materiais
│   │   ├── purchases/         # Pedidos de compra
│   │   ├── vendors/           # Fornecedores
│   │   └── kpis/              # KPIs de compras
│   ├── sd/                    # Sales & Distribution
│   │   ├── orders/            # Pedidos de venda
│   │   ├── customers/         # Clientes
│   │   └── kpis/              # KPIs de vendas
│   ├── wh/                    # Warehouse Management
│   │   ├── inventory/         # Inventário
│   │   ├── movements/         # Movimentos
│   │   └── kpis/              # KPIs de warehouse
│   ├── fi/                    # Financial
│   │   ├── accounts/          # Contas contábeis
│   │   ├── transactions/      # Transações
│   │   └── reports/           # Relatórios
│   └── dashboard/             # Dashboard principal
├── api/                       # Route Handlers
│   ├── mm/                    # APIs MM
│   ├── sd/                    # APIs SD
│   ├── wh/                    # APIs WH
│   └── fi/                    # APIs FI
└── components/                # Componentes reutilizáveis
    ├── ui/                    # Componentes base
    ├── forms/                 # Formulários
    └── charts/                # Gráficos
```

### **2. AUTENTICAÇÃO SIMPLIFICADA:**
```typescript
// app/auth/callback/page.tsx
export default async function AuthCallback({ searchParams }) {
  const code = searchParams?.code
  if (!code) redirect("/login?error=no_code")

  const supabase = createServerClient(/* cookies */)
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) redirect(`/login?error=${error.message}`)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.user_metadata?.tenant_id) redirect("/onboarding")

  redirect("/")
}
```

### **3. MIDDLEWARE LIMPO:**
```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  if (pathname.startsWith('/auth/') || pathname === '/login') {
    return NextResponse.next()
  }
  
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  return NextResponse.next()
}
```

### **4. APIS PADRONIZADAS:**
```typescript
// app/api/mm/materials/route.ts
export async function GET(req: NextRequest) {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 })

  const { data, error } = await supabase
    .from('mm_material')
    .select('*')
    .order('material_name')

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, data })
}
```

---

## 📊 COMPONENTES PRINCIPAIS

### **1. Dashboard Principal:**
- **Cards de Resumo:** Total de pedidos, vendas, estoque
- **Gráficos:** Tendências por período
- **Alertas:** Ações necessárias
- **Quick Actions:** Acesso rápido aos módulos

### **2. Formulários Inteligentes:**
- **Validação em Tempo Real:** Zod schemas
- **Auto-save:** Rascunhos automáticos
- **Cálculos Automáticos:** Totais, impostos, descontos
- **Upload de Arquivos:** CSV para bulk operations

### **3. Tabelas Interativas:**
- **Paginação:** 20, 50, 100 itens por página
- **Filtros:** Por data, status, cliente/fornecedor
- **Ordenação:** Por qualquer coluna
- **Ações em Lote:** Seleção múltipla

### **4. Modais e Overlays:**
- **Confirmação:** Ações destrutivas
- **Detalhes:** Visualização completa
- **Edição Rápida:** Inline editing
- **Upload:** Drag & drop de arquivos

---

## 🚀 PLANO DE EXECUÇÃO

### **FASE 1: FUNDAÇÃO (2-3 horas)**
1. **Refatorar Auth:** Callback + middleware limpos
2. **Estrutura Base:** Layout + navegação
3. **Componentes UI:** Cards, botões, formulários
4. **APIs Base:** CRUD genérico

### **FASE 2: MÓDULO MM (3-4 horas)**
1. **Materiais:** CRUD + bulk import
2. **Pedidos de Compra:** Criação + edição
3. **Fornecedores:** Gestão completa
4. **KPIs:** Dashboard + gráficos

### **FASE 3: MÓDULO SD (3-4 horas)**
1. **Pedidos de Venda:** Criação + edição
2. **Clientes:** Gestão completa
3. **KPIs:** Dashboard + relatórios
4. **Integração:** Com MM e WH

### **FASE 4: MÓDULO WH (2-3 horas)**
1. **Inventário:** Visualização + movimentos
2. **Alertas:** Estoque baixo
3. **KPIs:** Dashboard warehouse
4. **Integração:** Com MM e SD

### **FASE 5: MÓDULO FI (2-3 horas)**
1. **Contas:** Plano de contas
2. **Transações:** Lançamentos automáticos
3. **Relatórios:** Básicos
4. **Integração:** Com todos os módulos

### **FASE 6: POLIMENTO (1-2 horas)**
1. **Testes:** Funcionalidades principais
2. **Performance:** Otimizações
3. **UX:** Melhorias finais
4. **Deploy:** Produção

---

## ✅ GARANTIAS DA PROPOSTA

### **1. FUNCIONALIDADE 100%:**
- ✅ **Login/Logout:** Google OAuth funcionando
- ✅ **Navegação:** Entre módulos fluida
- ✅ **CRUD:** Todas as operações básicas
- ✅ **Cálculos:** Automáticos via triggers
- ✅ **RLS:** Isolamento por tenant automático

### **2. PERFORMANCE:**
- ✅ **Build:** < 30 segundos
- ✅ **Load:** < 2 segundos por página
- ✅ **APIs:** < 500ms resposta
- ✅ **Mobile:** Responsivo

### **3. MANUTENIBILIDADE:**
- ✅ **Código Limpo:** Componentes reutilizáveis
- ✅ **Padrões:** Consistência em toda aplicação
- ✅ **Documentação:** Código auto-documentado
- ✅ **Escalabilidade:** Fácil adicionar funcionalidades

---

## 🎯 RESULTADO FINAL

**Sistema ERP completo e funcional com:**
- **4 Módulos Principais:** MM, SD, WH, FI
- **UI/UX SAP Fiori:** Tons escuros, profissional
- **Zero Mudanças no Database:** Usa estrutura atual
- **RLS Automático:** Segurança por tenant
- **Triggers Funcionais:** Cálculos automáticos
- **Responsivo:** Funciona em mobile
- **Performance:** Rápido e eficiente

**Tempo Total Estimado: 12-18 horas**
**Risco: Baixo** (usa database existente)
**Resultado: Sistema 100% funcional**

---

## 📝 PRÓXIMOS PASSOS

1. **Aprovação da Proposta:** Confirmar escopo
2. **Início da Fase 1:** Refatorar auth
3. **Desenvolvimento Iterativo:** Módulo por módulo
4. **Testes Contínuos:** A cada fase
5. **Deploy Final:** Produção

**Esta proposta garante um sistema ERP funcional, moderno e eficiente!** 🚀
