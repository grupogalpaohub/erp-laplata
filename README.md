# ERP Laplata

Sistema ERP modular desenvolvido com Next.js 14, Supabase e Cloudflare Pages, seguindo o padrão Fiori-like.

## 🏗️ Arquitetura

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Radix UI
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Deploy**: Cloudflare Pages
- **Banco**: PostgreSQL com RLS (Row Level Security)

## 📁 Estrutura do Projeto

```
erp-laplata/
├── frontend/                 # Next.js 14 App
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # UI Components
│   │   └── lib/            # Utilities
│   └── package.json
├── supabase/
│   ├── migrations/          # Database migrations
│   ├── seed/               # Initial data
│   └── functions/          # Edge Functions
└── README.md
```

## 🚀 Instalação e Configuração

### 1. Configurar Supabase

```bash
# Instalar Supabase CLI
npm install -g supabase

# Fazer login no Supabase
supabase login

# Inicializar projeto (se necessário)
supabase init

# Conectar ao projeto remoto
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

# Copiar variáveis de ambiente
cp .env.local.example .env.local

# Configurar .env.local com suas credenciais
NEXT_PUBLIC_SUPABASE_URL=https://gpjcfwjssfvqhppxdudp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
NEXT_PUBLIC_APP_NAME=ERP Laplata

# Executar em desenvolvimento
npm run dev
```

### 3. Deploy no Cloudflare Pages

1. Conectar repositório GitHub ao Cloudflare Pages
2. Configurar build settings:
   - **Framework preset**: None
   - **Build command**: `cd frontend && npm install && npm run build`
   - **Build output directory**: `frontend/out`
   - **Root directory**: `/`

3. Configurar variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_NAME`

## 🗄️ Banco de Dados

### Principais Tabelas

- **tenant**: Configurações do tenant
- **user_profile**: Perfis de usuários
- **mm_***: Módulo de Materiais (materiais, fornecedores, compras)
- **sd_***: Módulo de Vendas (vendas, clientes, entregas)
- **wh_***: Módulo de Depósitos (estoque, movimentações)
- **crm_***: Módulo CRM (leads, oportunidades)
- **fi_***: Módulo Financeiro (contas, faturas, pagamentos)
- **co_***: Módulo Controladoria (KPIs, dashboards)

### Segurança

- Todas as tabelas possuem RLS (Row Level Security)
- Isolamento por tenant_id
- Políticas de acesso baseadas em JWT

## 🔧 Edge Functions

- `setup-mm`: Configurações do módulo MM
- `po-create`: Criação de pedidos de compra
- `so-create`: Criação de pedidos de venda
- `kpi-refresh`: Atualização de KPIs

## 📊 Módulos do Sistema

### MM - Materiais & Fornecedores
- Gestão de materiais e produtos
- Cadastro de fornecedores
- Pedidos de compra
- Recebimentos

### SD - Vendas
- Gestão de clientes
- Pedidos de venda
- Expedições
- Pagamentos

### WH - Depósitos & Estoque
- Gestão de depósitos
- Controle de estoque
- Movimentações
- Inventário

### CRM - Leads & Oportunidades
- Gestão de leads
- Oportunidades de venda
- Interações
- Pipeline

### FI - Financeiro
- Contas bancárias
- Faturas
- Pagamentos
- Transações

### CO - Controladoria
- Dashboards
- KPIs
- Relatórios
- Centros de custo

## 🎨 UI/UX

- Design Fiori-like
- Sidebar fixa com navegação
- Header com busca global
- 4 KPIs principais no topo
- Tiles por módulo
- Tabelas com paginação server-side
- Formulários com validação (Zod)

## 🔐 Autenticação

- Supabase Auth
- Google OAuth configurado
- RLS para isolamento de dados
- Perfis de usuário com roles

## 📈 Performance

- Otimizado para Free Tier
- Consultas paginadas
- Índices otimizados
- Cache com TanStack Query
- KPIs por snapshot assíncrono

## 🧪 Desenvolvimento

```bash
# Frontend
cd frontend
npm run dev

# Supabase local (opcional)
supabase start
supabase db reset
```

## 📝 Licença

Este projeto é proprietário da Laplata Lunaria.

## 🤝 Suporte

Para suporte técnico, entre em contato com a equipe de desenvolvimento.