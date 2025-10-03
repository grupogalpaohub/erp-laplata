# 🧩 ESTRUTURA DE COMPONENTES PROPOSTA

## 📁 ORGANIZAÇÃO DE ARQUIVOS

```
app/
├── (protected)/
│   ├── dashboard/
│   │   └── page.tsx                    # Dashboard principal
│   ├── mm/                            # Material Management
│   │   ├── materials/
│   │   │   ├── page.tsx               # Lista de materiais
│   │   │   ├── new/
│   │   │   │   └── page.tsx           # Novo material
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx           # Visualizar material
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx       # Editar material
│   │   │   └── bulk/
│   │   │       └── page.tsx           # Importação em lote
│   │   ├── purchases/
│   │   │   ├── page.tsx               # Lista de pedidos
│   │   │   ├── new/
│   │   │   │   └── page.tsx           # Novo pedido
│   │   │   └── [id]/
│   │   │       ├── page.tsx           # Visualizar pedido
│   │   │       └── edit/
│   │   │           └── page.tsx       # Editar pedido
│   │   ├── vendors/
│   │   │   ├── page.tsx               # Lista de fornecedores
│   │   │   ├── new/
│   │   │   │   └── page.tsx           # Novo fornecedor
│   │   │   └── [id]/
│   │   │       ├── page.tsx           # Visualizar fornecedor
│   │   │       └── edit/
│   │   │           └── page.tsx       # Editar fornecedor
│   │   └── kpis/
│   │       └── page.tsx               # KPIs de compras
│   ├── sd/                            # Sales & Distribution
│   │   ├── orders/
│   │   │   ├── page.tsx               # Lista de pedidos
│   │   │   ├── new/
│   │   │   │   └── page.tsx           # Novo pedido
│   │   │   └── [id]/
│   │   │       ├── page.tsx           # Visualizar pedido
│   │   │       └── edit/
│   │   │           └── page.tsx       # Editar pedido
│   │   ├── customers/
│   │   │   ├── page.tsx               # Lista de clientes
│   │   │   ├── new/
│   │   │   │   └── page.tsx           # Novo cliente
│   │   │   └── [id]/
│   │   │       ├── page.tsx           # Visualizar cliente
│   │   │       └── edit/
│   │   │           └── page.tsx       # Editar cliente
│   │   └── kpis/
│   │       └── page.tsx               # KPIs de vendas
│   ├── wh/                            # Warehouse Management
│   │   ├── inventory/
│   │   │   ├── page.tsx               # Saldo de estoque
│   │   │   └── [material]/
│   │   │       └── page.tsx           # Histórico do material
│   │   ├── movements/
│   │   │   ├── page.tsx               # Movimentações
│   │   │   └── new/
│   │   │       └── page.tsx           # Nova movimentação
│   │   └── kpis/
│   │       └── page.tsx               # KPIs de warehouse
│   ├── fi/                            # Financial
│   │   ├── accounts/
│   │   │   └── page.tsx               # Plano de contas
│   │   ├── transactions/
│   │   │   ├── page.tsx               # Transações
│   │   │   └── new/
│   │   │       └── page.tsx           # Nova transação
│   │   └── reports/
│   │       ├── page.tsx               # Relatórios
│   │       ├── balance/
│   │       │   └── page.tsx           # Balanço
│   │       └── dre/
│   │           └── page.tsx           # DRE
│   └── onboarding/
│       └── page.tsx                   # Onboarding de tenant
├── api/
│   ├── mm/                            # APIs Material Management
│   │   ├── materials/
│   │   │   └── route.ts               # CRUD materiais
│   │   ├── purchase-orders/
│   │   │   └── route.ts               # CRUD pedidos compra
│   │   ├── purchase-order-items/
│   │   │   └── route.ts               # CRUD itens pedidos
│   │   ├── vendors/
│   │   │   └── route.ts               # CRUD fornecedores
│   │   └── kpis/
│   │       └── route.ts               # KPIs compras
│   ├── sd/                            # APIs Sales & Distribution
│   │   ├── orders/
│   │   │   └── route.ts               # CRUD pedidos venda
│   │   ├── order-items/
│   │   │   └── route.ts               # CRUD itens pedidos
│   │   ├── customers/
│   │   │   └── route.ts               # CRUD clientes
│   │   └── kpis/
│   │       └── route.ts               # KPIs vendas
│   ├── wh/                            # APIs Warehouse
│   │   ├── inventory/
│   │   │   └── route.ts               # Saldo estoque
│   │   ├── movements/
│   │   │   └── route.ts               # Movimentações
│   │   └── kpis/
│   │       └── route.ts               # KPIs warehouse
│   ├── fi/                            # APIs Financial
│   │   ├── accounts/
│   │   │   └── route.ts               # Contas contábeis
│   │   ├── transactions/
│   │   │   └── route.ts               # Transações
│   │   └── reports/
│   │       └── route.ts               # Relatórios
│   └── auth/
│       └── set-tenant/
│           └── route.ts               # Definir tenant
├── components/
│   ├── ui/                            # Componentes base
│   │   ├── Button.tsx                 # Botão padrão
│   │   ├── Card.tsx                   # Card container
│   │   ├── Input.tsx                  # Input padrão
│   │   ├── Select.tsx                 # Select padrão
│   │   ├── Table.tsx                  # Tabela padrão
│   │   ├── Modal.tsx                  # Modal padrão
│   │   ├── Badge.tsx                  # Badge de status
│   │   ├── Loading.tsx                # Loading spinner
│   │   └── ErrorBoundary.tsx          # Error boundary
│   ├── forms/                         # Formulários
│   │   ├── MaterialForm.tsx           # Formulário material
│   │   ├── PurchaseOrderForm.tsx      # Formulário PO
│   │   ├── SalesOrderForm.tsx         # Formulário SO
│   │   ├── CustomerForm.tsx           # Formulário cliente
│   │   ├── VendorForm.tsx             # Formulário fornecedor
│   │   └── BulkUploadForm.tsx         # Upload em lote
│   ├── charts/                        # Gráficos
│   │   ├── LineChart.tsx              # Gráfico linha
│   │   ├── BarChart.tsx               # Gráfico barras
│   │   ├── PieChart.tsx               # Gráfico pizza
│   │   └── KpiCard.tsx                # Card de KPI
│   ├── layout/                        # Layout
│   │   ├── FioriShell.tsx             # Shell principal
│   │   ├── NavBar.tsx                 # Barra navegação
│   │   ├── Sidebar.tsx                # Menu lateral
│   │   └── Breadcrumb.tsx             # Breadcrumb
│   └── modules/                       # Componentes por módulo
│       ├── mm/                        # Material Management
│       │   ├── MaterialList.tsx       # Lista materiais
│       │   ├── MaterialCard.tsx       # Card material
│       │   ├── PurchaseOrderList.tsx  # Lista POs
│       │   ├── PurchaseOrderCard.tsx  # Card PO
│       │   ├── VendorList.tsx         # Lista fornecedores
│       │   └── VendorCard.tsx         # Card fornecedor
│       ├── sd/                        # Sales & Distribution
│       │   ├── SalesOrderList.tsx     # Lista SOs
│       │   ├── SalesOrderCard.tsx     # Card SO
│       │   ├── CustomerList.tsx       # Lista clientes
│       │   └── CustomerCard.tsx       # Card cliente
│       ├── wh/                        # Warehouse
│       │   ├── InventoryList.tsx      # Lista estoque
│       │   ├── InventoryCard.tsx      # Card estoque
│       │   ├── MovementList.tsx       # Lista movimentos
│       │   └── MovementCard.tsx       # Card movimento
│       └── fi/                        # Financial
│           ├── AccountList.tsx        # Lista contas
│           ├── TransactionList.tsx    # Lista transações
│           └── ReportCard.tsx         # Card relatório
├── lib/
│   ├── supabase/
│   │   ├── client.ts                  # Cliente Supabase
│   │   └── server.ts                  # Servidor Supabase
│   ├── utils/
│   │   ├── format.ts                  # Formatação
│   │   ├── validation.ts              # Validação
│   │   └── constants.ts               # Constantes
│   └── types/
│       ├── mm.ts                      # Tipos MM
│       ├── sd.ts                      # Tipos SD
│       ├── wh.ts                      # Tipos WH
│       └── fi.ts                      # Tipos FI
├── styles/
│   ├── globals.css                    # Estilos globais
│   ├── fiori.css                      # Tema SAP Fiori
│   └── components.css                 # Estilos componentes
└── utils/
    ├── tenant.ts                      # Utilitários tenant
    ├── auth.ts                        # Utilitários auth
    └── api.ts                         # Utilitários API
```

## 🎨 COMPONENTES PRINCIPAIS

### **1. UI Base (components/ui/)**

#### **Button.tsx:**
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'success'
  size: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
}
```

#### **Card.tsx:**
```typescript
interface CardProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
}
```

#### **Table.tsx:**
```typescript
interface TableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  pagination?: boolean
  search?: boolean
  filters?: FilterConfig[]
  onRowClick?: (row: T) => void
}
```

### **2. Formulários (components/forms/)**

#### **MaterialForm.tsx:**
```typescript
interface MaterialFormProps {
  material?: Material
  onSave: (data: Material) => void
  onCancel: () => void
  loading?: boolean
}
```

#### **PurchaseOrderForm.tsx:**
```typescript
interface PurchaseOrderFormProps {
  order?: PurchaseOrder
  onSave: (data: PurchaseOrder) => void
  onCancel: () => void
  loading?: boolean
}
```

### **3. Gráficos (components/charts/)**

#### **KpiCard.tsx:**
```typescript
interface KpiCardProps {
  title: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'stable'
  icon?: React.ReactNode
  color?: string
}
```

#### **LineChart.tsx:**
```typescript
interface LineChartProps {
  data: ChartData[]
  xKey: string
  yKey: string
  title?: string
  height?: number
}
```

### **4. Layout (components/layout/)**

#### **FioriShell.tsx:**
```typescript
interface FioriShellProps {
  children: React.ReactNode
  user?: User
  tenant?: string
}
```

#### **NavBar.tsx:**
```typescript
interface NavBarProps {
  user?: User
  tenant?: string
  onLogout: () => void
}
```

## 🔧 PÁGINAS PRINCIPAIS

### **1. Dashboard (dashboard/page.tsx)**
- **Cards de Resumo:** Total pedidos, vendas, estoque
- **Gráficos:** Tendências por período
- **Alertas:** Ações necessárias
- **Quick Actions:** Acesso rápido aos módulos

### **2. MM - Materiais (mm/materials/page.tsx)**
- **Lista:** Tabela com filtros e paginação
- **Ações:** Novo, editar, deletar, importar
- **Busca:** Por nome, categoria, fornecedor
- **Ordenação:** Por qualquer coluna

### **3. MM - Pedidos de Compra (mm/purchases/page.tsx)**
- **Lista:** Pedidos com status e totais
- **Filtros:** Por status, fornecedor, período
- **Ações:** Novo, editar, duplicar, cancelar
- **Status:** Draft, Received

### **4. SD - Pedidos de Venda (sd/orders/page.tsx)**
- **Lista:** Pedidos com cliente e totais
- **Filtros:** Por status, cliente, período
- **Ações:** Novo, editar, confirmar, expedir
- **Status:** Draft, Confirmed, Shipped, Delivered

### **5. WH - Inventário (wh/inventory/page.tsx)**
- **Saldo:** Por material e warehouse
- **Filtros:** Por material, warehouse, status
- **Alertas:** Estoque baixo, materiais vencidos
- **Ações:** Ajustar, transferir, reservar

## 📊 TIPOS DE DADOS

### **MM Types (lib/types/mm.ts):**
```typescript
interface Material {
  mm_material: string
  material_name: string
  unit_price_cents: number
  category: string
  classification: string
  vendor_id: string
  tenant_id: string
}

interface PurchaseOrder {
  mm_order: string
  vendor_id: string
  order_date: string
  expected_delivery: string
  total_amount_cents: number
  status: 'draft' | 'received'
  tenant_id: string
}

interface Vendor {
  vendor_id: string
  vendor_name: string
  email: string
  phone: string
  rating: string
  tenant_id: string
}
```

### **SD Types (lib/types/sd.ts):**
```typescript
interface SalesOrder {
  so_id: string
  customer_id: string
  order_date: string
  expected_ship: string
  total_amount_cents: number
  status: 'draft' | 'confirmed' | 'shipped' | 'delivered'
  tenant_id: string
}

interface Customer {
  customer_id: string
  customer_name: string
  email: string
  phone: string
  customer_type: 'PF' | 'PJ'
  preferred_payment_method: string
  tenant_id: string
}
```

### **WH Types (lib/types/wh.ts):**
```typescript
interface InventoryBalance {
  tenant_id: string
  plant_id: string
  mm_material: string
  available_qty: number
  reserved_qty: number
  blocked_qty: number
}

interface InventoryMovement {
  ledger_id: string
  tenant_id: string
  plant_id: string
  mm_material: string
  movement_type: string
  qty_change: number
  reference_type: string
  reference_id: string
}
```

## 🎯 FUNCIONALIDADES POR MÓDULO

### **MM (Material Management):**
- ✅ **CRUD Materiais:** Criar, editar, visualizar, deletar
- ✅ **Bulk Import:** Upload CSV com validação
- ✅ **CRUD Pedidos:** Gestão completa de POs
- ✅ **CRUD Fornecedores:** Gestão de fornecedores
- ✅ **KPIs:** Dashboard com métricas de compras

### **SD (Sales & Distribution):**
- ✅ **CRUD Pedidos:** Gestão completa de SOs
- ✅ **CRUD Clientes:** Gestão de clientes
- ✅ **Status Flow:** Draft → Confirmed → Shipped → Delivered
- ✅ **KPIs:** Dashboard com métricas de vendas

### **WH (Warehouse Management):**
- ✅ **Saldo Estoque:** Visualização por material/warehouse
- ✅ **Movimentações:** Histórico de entradas/saídas
- ✅ **Alertas:** Estoque baixo, materiais vencidos
- ✅ **KPIs:** Dashboard com métricas de warehouse

### **FI (Financial):**
- ✅ **Plano de Contas:** Estrutura hierárquica
- ✅ **Transações:** Lançamentos automáticos
- ✅ **Relatórios:** Balanço, DRE, Fluxo de Caixa
- ✅ **Integração:** Com todos os módulos

## 🚀 VANTAGENS DA ESTRUTURA

### **1. Organização Clara:**
- **Módulos Separados:** MM, SD, WH, FI
- **Componentes Reutilizáveis:** UI base + específicos
- **APIs Organizadas:** Por módulo e funcionalidade

### **2. Manutenibilidade:**
- **Código Limpo:** Componentes pequenos e focados
- **Tipos Fortes:** TypeScript em toda aplicação
- **Padrões Consistentes:** Mesma estrutura em todos os módulos

### **3. Escalabilidade:**
- **Fácil Adicionar:** Novos módulos ou funcionalidades
- **Componentes Modulares:** Reutilização máxima
- **APIs Padronizadas:** Mesmo padrão em todas as rotas

### **4. Performance:**
- **Lazy Loading:** Componentes carregados sob demanda
- **Otimização:** Build otimizado do Next.js
- **Caching:** Estratégias de cache adequadas

**Esta estrutura garante um sistema ERP organizado, manutenível e escalável!** 🎯
