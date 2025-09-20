# ERP LaPlata - Sistema de Gestão Empresarial

Sistema ERP completo desenvolvido com Next.js 14, TypeScript, Tailwind CSS e Supabase, inspirado no design SAP Fiori.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router e Server Components
- **TypeScript** - Tipagem estática completa
- **Tailwind CSS** - Framework CSS utilitário com tema Fiori customizado
- **Supabase** - Backend como serviço (PostgreSQL + Auth + RLS)
- **Vercel** - Hospedagem e deploy automático
- **SAP Fiori Design System** - Interface inspirada no SAP Fiori

## 📁 Estrutura do Projeto

```
app/
├── (auth)/                # Rotas de autenticação
│   ├── login/            # Página de login
│   └── auth/             # Callback OAuth
├── api/                   # API Routes
│   ├── auth/             # Autenticação
│   ├── debug/            # Endpoints de debug
│   └── mm/               # APIs do módulo MM
├── mm/                    # Material Management
│   ├── materials/        # Gestão de materiais
│   ├── purchases/        # Pedidos de compra
│   └── vendors/          # Fornecedores
├── sd/                    # Sales & Distribution
├── wh/                    # Warehouse Management
├── co/                    # Controlling
├── crm/                   # Customer Relationship
├── fi/                    # Financial
├── analytics/             # Analytics
└── setup/                 # Configurações

src/
├── lib/                   # Utilitários e configurações
│   ├── supabaseServer.ts # Cliente Supabase server-side
│   ├── auth.ts           # Autenticação e tenant
│   └── material-config.ts # Configurações de materiais
└── components/            # Componentes React
    └── FioriShell.tsx    # Shell principal Fiori
```

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### Vercel

Configure as variáveis no dashboard do Vercel:
- **Settings** → **Environment Variables**
- Adicione para **Production** e **Preview**

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🚀 Deploy

### Vercel (Recomendado)

1. **Conecte o repositório** no dashboard do Vercel
2. **Configure as variáveis** de ambiente
3. **Deploy automático** a cada push para a branch principal

### Deploy Manual

```bash
# Build
npm run build

# Deploy (se usando Vercel CLI)
vercel --prod
```

## 📊 Módulos Disponíveis

### 🏠 Dashboard Principal
- **KPIs em tempo real** com cores Fiori (verde/amarelo/vermelho)
- **Navegação por tiles** inspirada no SAP Fiori
- **Tema escuro** consistente em toda aplicação

### 📦 MM - Material Management
- `/mm/catalog` - Catálogo de materiais com filtros
- `/mm/materials/new` - Cadastro individual de materiais
- `/mm/materials/bulk-edit` - Edição em lote com confirmação
- `/mm/materials/bulk-import` - Importação via CSV/XLSX
- `/mm/purchases` - Listagem de pedidos de compra
- `/mm/purchases/new` - Criação de pedidos de compra
- `/mm/vendors` - Gestão de fornecedores

### 💰 SD - Sales & Distribution
- `/sd/orders` - Pedidos de venda
- `/sd/customers` - Clientes
- `/sd/invoices` - Faturas

### 📦 WH - Warehouse Management
- `/wh/inventory` - Estoque
- `/wh/movements` - Movimentações
- `/wh/reports` - Relatórios

### 👥 CRM - Customer Relationship
- `/crm/leads` - Leads
- `/crm/opportunities` - Oportunidades
- `/crm/activities` - Atividades

### 💳 FI - Financial
- `/fi/payables` - Contas a pagar
- `/fi/receivables` - Contas a receber
- `/fi/cashflow` - Fluxo de caixa

### 📊 CO - Controlling
- `/co/dashboard` - Dashboard CO
- `/co/reports` - Relatórios
- `/co/costs` - Análise de custos

### ⚙️ Sistema
- `/setup` - Configurações
- `/analytics` - Analytics

## 🔒 Autenticação

- **Supabase Auth** com Google OAuth
- **Middleware** para proteção de rotas
- **Callback robusto** com tratamento de erros
- **Sessão persistente** com cookies seguros
- **Landing page** antes do login

## 🎨 UI/UX - SAP Fiori Design System

### Tema Escuro Consistente
- **Cores Fiori oficiais** com tema escuro
- **Tiles quadrados** sem bordas arredondadas
- **Contraste otimizado** para legibilidade
- **Sem caixas brancas** em lugar nenhum

### Componentes Fiori
- **Tiles de navegação** com hover effects
- **Tabelas escuras** com headers destacados
- **Formulários** com inputs de tema escuro
- **Botões** com estilos Fiori (primary, secondary, outline)
- **Modais** com fundo escuro e bordas sutis
- **Alertas** com cores semânticas (sucesso, aviso, erro)

### KPIs Coloridos
- **Verde** para indicadores positivos
- **Amarelo** para atenção necessária
- **Vermelho** para problemas críticos
- **Neutro** para informações gerais

## 📱 Responsividade

- **Mobile-first** design
- **Tabelas responsivas** com scroll horizontal
- **Navegação otimizada** para touch
- **Layout adaptativo** para diferentes telas

## 🚀 Funcionalidades Implementadas

### ✅ Material Management (MM)
- **Geração automática de IDs** de materiais (B_, G_, C_, P_, K_)
- **Cadastro individual** com validação completa
- **Edição em lote** com confirmação de mudanças
- **Importação em massa** via CSV/XLSX com validação
- **Catálogo** com filtros e busca
- **Pedidos de compra** com detalhes completos dos materiais
- **Gestão de fornecedores** integrada

### ✅ Autenticação e Segurança
- **Login com Google** via Supabase OAuth
- **Middleware robusto** para proteção de rotas
- **Sessões persistentes** com cookies seguros
- **Tratamento de erros** em callbacks OAuth
- **Landing page** antes do acesso ao sistema

### ✅ Design System Fiori
- **Tema escuro** consistente em toda aplicação
- **Tiles quadrados** sem bordas arredondadas
- **Cores semânticas** para KPIs e status
- **Componentes padronizados** (botões, inputs, tabelas)
- **Navegação intuitiva** inspirada no SAP Fiori

## 🐛 Troubleshooting

### Problemas de Login
- Acesse `/api/_debug/health` para verificar variáveis de ambiente
- Use `/api/auth/clear-session` para limpar sessão corrompida
- Verifique se as variáveis estão configuradas no Vercel

### Problemas de Materiais
- Acesse `/api/debug/check-materials-dropdown` para verificar dados
- Confirme se o `tenant_id` está correto
- Verifique as políticas RLS no Supabase

### Problemas de Build
- Execute `npm run type-check` para verificar erros de TypeScript
- Verifique se todas as variáveis de ambiente estão configuradas
- Confirme se o Supabase está acessível

## 📄 Licença

Proprietário - Grupo Galpão Hub

## 🔗 Links Úteis

- **Deploy:** https://workspace-mu-livid.vercel.app
- **GitHub:** https://github.com/grupogalpaohub/erp-laplata
- **Supabase:** Dashboard do projeto
- **Vercel:** Dashboard de deploy