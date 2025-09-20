# ERP LaPlata

Sistema ERP modular desenvolvido com Next.js 14, Supabase e Vercel, seguindo o padrão Fiori-like.

## 🏗️ Arquitetura

- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions)
- **Deploy:** Vercel (Preview + Production)
- **Banco:** PostgreSQL com RLS (Row Level Security)

## 📁 Estrutura do Projeto

```
erp-laplata/
├── frontend/                 # Next.js 14 App
│   ├── app/                  # App Router pages
│   │   ├── (auth)/           # Auth pages
│   │   ├── api/              # API routes
│   │   ├── mm/               # Módulo Materiais
│   │   ├── sd/               # Módulo Vendas
│   │   ├── wh/               # Módulo Estoque
│   │   ├── crm/              # Módulo CRM
│   │   ├── fi/               # Módulo Financeiro
│   │   ├── co/               # Módulo Controle
│   │   └── analytics/        # Analytics
│   ├── components/           # UI Components
│   ├── lib/                  # Utilities & Supabase clients
│   │   ├── supabase/         # Server & Browser clients
│   │   └── data/             # Data layer
│   └── middleware.ts         # Auth middleware
├── scripts/                  # Build & deployment scripts
├── .githooks/               # Git hooks (pre-commit, pre-push)
└── README.md
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ ou 20
- npm ou yarn
- Conta no Supabase
- Conta no Vercel

### 1. Configurar Supabase

```bash
# Instalar CLI
npm install -g supabase

# Login
supabase login

# Linkar projeto remoto
supabase link --project-ref gpjcfwjssfvqhppxdudp

# Aplicar migrations
supabase db push

# Executar seeds
supabase db seed
```

### 2. Configurar Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Copiar variáveis
cp .env.example .env.local
```

Configurar `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://gpjcfwjssfvqhppxdudp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<<ANON_KEY>>
SUPABASE_SERVICE_ROLE_KEY=<<SERVICE_ROLE_KEY>>
NEXT_PUBLIC_SITE_URL=https://erp-laplata.vercel.app
```

Rodar em dev:

```bash
npm run dev
```

### 3. Deploy no Vercel

1. Conectar o repositório GitHub (`grupogalpaohub/erp-laplata`)
2. Branch de produção: `erp-git`
3. Configurar Root Directory: `frontend`
4. Build Command: `npm run build`
5. Output Directory: `.next`

**Variáveis de ambiente (Production + Preview):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

## 🗄️ Banco de Dados

### Principais Tabelas

- `tenant`: Configurações do tenant
- `user_profile`: Perfis de usuários
- `mm_*`: Módulo de Materiais (materiais, fornecedores, compras)
- `sd_*`: Módulo de Vendas (clientes, pedidos, faturas)
- `wh_*`: Módulo de Depósitos (estoque, movimentações)
- `crm_*`: Módulo CRM (leads, oportunidades)
- `fi_*`: Módulo Financeiro (contas, faturas, pagamentos)
- `co_*`: Controladoria (KPIs, dashboards)

### Views Importantes

- `v_material_overview`: Visão consolidada de materiais com preços e custos

### Segurança

- Todas as tabelas com RLS (Row Level Security)
- Isolamento por `tenant_id`
- Políticas baseadas em JWT
- Middleware de autenticação no frontend

## 🔧 Edge Functions

- `setup-mm`: Configurações de Materiais
- `po-create`: Criação de pedidos de compra
- `so-create`: Criação de pedidos de venda
- `kpi-refresh`: Atualização de KPIs

## 📊 Módulos

### MM - Materiais
- Catálogo de materiais (conectado à `v_material_overview`)
- Fornecedores
- Compras e pedidos

### SD - Vendas
- Clientes
- Pedidos de venda
- Faturas

### WH - Estoque
- Inventário
- Movimentações
- Relatórios de estoque

### CRM - Customer Relationship Management
- Leads
- Oportunidades
- Atividades

### FI - Financeiro
- Contas a pagar
- Contas a receber
- Fluxo de caixa

### CO - Controle
- Dashboards
- KPIs
- Relatórios gerenciais

### Analytics
- Relatórios em tempo real
- Dashboards interativos

## 🎨 UI/UX

### Design Fiori-like
- **Sidebar fixa** com navegação por módulos
- **Header** com tenant info e responsividade
- **KPIs** no topo (Pedidos, Receita, Leads, Estoque)
- **Tiles** dos módulos com hover effects
- **Cores Fiori** (#0A6ED1, #F5F6F8)

### Componentes
- Layout responsivo (mobile-first)
- Error boundaries globais
- Loading states consistentes
- Tabelas com paginação server-side

## 🔐 Autenticação

- **Supabase Auth** com Google OAuth
- **Middleware** de proteção de rotas
- **RLS** por `tenant_id`
- **Redirecionamento** inteligente após login
- **Gating automático** - usuários não autenticados vão para login

## 📈 Performance

- **ISR** (Incremental Static Regeneration) no catálogo
- **Server Components** para dados
- **Client Components** apenas quando necessário
- **Middleware** otimizado
- **Build** otimizado para Vercel

## 🧪 Desenvolvimento

### Frontend
```bash
cd frontend
npm run dev
```

### Supabase local (opcional)
```bash
supabase start
supabase db reset
```

### Git Hooks
O projeto inclui hooks de Git para garantir qualidade:
- **pre-commit**: Verifica static artifacts, package.json, next.config.js
- **pre-push**: Validações adicionais antes do push

## 🔧 Scripts Disponíveis

```bash
# Frontend
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linting

# Supabase
supabase start       # Ambiente local
supabase db push     # Aplicar migrations
supabase db seed     # Executar seeds
```

## 📝 Licença

Projeto proprietário da La Plata Lunaria.

## 🤝 Suporte

Entre em contato com a equipe de desenvolvimento.

---

**⚡ Atualizado para refletir:**
- Deploy no Vercel (não Cloudflare)
- Estrutura com `frontend/`
- Uso de `.next` como output
- Autenticação Google OAuth já integrada
- Middleware de proteção
- Layout Fiori implementado
- Catálogo conectado ao Supabase
- Deploy rollback executado com sucesso