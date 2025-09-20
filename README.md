# ERP Laplata - Frontend

Sistema de gestão empresarial (ERP) desenvolvido com Next.js 15, TypeScript, Tailwind CSS e Supabase.

## 🚀 Tecnologias

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Supabase** - Backend como serviço (PostgreSQL + Auth)
- **Cloudflare Pages** - Hospedagem e Edge Functions
- **@cloudflare/next-on-pages** - Adapter para Cloudflare Pages

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── (auth)/            # Rotas de autenticação
│   ├── co/                # Módulo Controlling
│   ├── mm/                # Módulo Material Management
│   ├── sd/                # Módulo Sales & Distribution
│   ├── wh/                # Módulo Warehouse
│   ├── crm/               # Módulo Customer Relationship
│   ├── fi/                # Módulo Financial
│   ├── analytics/         # Analytics
│   └── setup/             # Configurações
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── layout/           # Layout components
│   └── dashboard/        # Dashboard components
├── lib/                  # Utilitários e configurações
│   ├── supabase/         # Cliente Supabase
│   └── auth.ts           # Autenticação
└── contexts/             # React Contexts
```

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Cloudflare Pages

Configure as mesmas variáveis no dashboard do Cloudflare Pages:
- **Settings** → **Environment Variables**
- Adicione para **Production** e **Preview**

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Build para Cloudflare Pages
npm run pages:build

# Preview local com Cloudflare
npm run preview:cf

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🚀 Deploy

### Cloudflare Pages

1. **Build local:**
   ```bash
   npm run pages:build
   ```

2. **Deploy:**
   ```bash
   npx wrangler pages deploy .vercel/output
   ```

### Configuração no Dashboard

- **Root directory:** `frontend`
- **Build command:** `npm run pages:build`
- **Build output directory:** `.vercel/output/static`
- **Functions directory:** `.vercel/output/functions`

## 📊 Módulos Disponíveis

### MM - Material Management
- `/mm/catalog` - Catálogo de materiais
- `/mm/vendors` - Fornecedores
- `/mm/purchases` - Compras

### SD - Sales & Distribution
- `/sd/orders` - Pedidos de venda
- `/sd/customers` - Clientes
- `/sd/invoices` - Faturas

### WH - Warehouse
- `/wh/inventory` - Estoque
- `/wh/movements` - Movimentações
- `/wh/reports` - Relatórios

### CRM - Customer Relationship
- `/crm/leads` - Leads
- `/crm/opportunities` - Oportunidades
- `/crm/activities` - Atividades

### FI - Financial
- `/fi/payables` - Contas a pagar
- `/fi/receivables` - Contas a receber
- `/fi/cashflow` - Fluxo de caixa

### CO - Controlling
- `/co/dashboard` - Dashboard CO
- `/co/reports` - Relatórios
- `/co/costs` - Análise de custos

### Sistema
- `/setup` - Configurações
- `/analytics` - Analytics

## 🔒 Autenticação

O sistema usa Supabase Auth com Google OAuth configurado.

## 🎨 UI/UX

- **Design System:** Fiori-inspired
- **Componentes:** shadcn/ui + Radix UI
- **Estilização:** Tailwind CSS
- **Ícones:** Lucide React

## 📱 Responsividade

- Mobile-first design
- Sidebar colapsível
- Tabelas responsivas
- Navegação otimizada para touch

## 🐛 Troubleshooting

### Erro de Build
- Verifique se todas as variáveis de ambiente estão configuradas
- Execute `npm run type-check` para verificar erros de TypeScript

### Erro de Deploy
- Verifique se o build local funciona: `npm run pages:build`
- Confirme as configurações no Cloudflare Pages dashboard

### Erro de Conexão com Supabase
- Verifique as variáveis de ambiente
- Confirme se o projeto Supabase está ativo
- Verifique as políticas RLS no Supabase

## 📄 Licença

Proprietário - Grupo Galpão Hub