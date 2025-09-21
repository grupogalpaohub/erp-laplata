# ERP LaPlata - Sistema de Gestão Empresarial

Sistema ERP completo desenvolvido com Next.js 14, TypeScript, Tailwind CSS e Supabase, inspirado no design SAP Fiori. Sistema modular com gestão completa de materiais, vendas, estoque, clientes e finanças.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router e Server Components
- **TypeScript** - Tipagem estática completa
- **Tailwind CSS** - Framework CSS utilitário com tema Fiori customizado
- **Supabase** - Backend como serviço (PostgreSQL + Auth + RLS)
- **Vercel** - Hospedagem e deploy automático
- **SAP Fiori Design System** - Interface inspirada no SAP Fiori
- **Lucide React** - Ícones modernos e consistentes

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

## 🗄️ Banco de Dados

### Migrações Disponíveis

O sistema inclui migrações SQL completas para todos os módulos:

```sql
-- Estrutura base
20240101000001_initial_schema.sql
20240101000002_setup_tables.sql
20240101000003_rls_policies.sql
20240101000004_functions_triggers.sql
20240101000005_schema_standardization.sql
20240101000006_rls_policies_complete.sql

-- Módulos específicos
20240101000010_crm_customer_enhancement.sql    # CRM - Clientes
20240101000011_sd_sales_order_enhancement.sql  # SD - Pedidos de Venda
20240101000012_wh_warehouse_enhancement.sql    # WH - Estoque
20240101000013_fi_co_enhancement.sql           # FI/CO - Financeiro
20240101000014_mm_vendors_enhancement.sql      # MM - Fornecedores
```

### Aplicar Migrações

```bash
# Via Supabase CLI
supabase db push

# Ou execute manualmente no dashboard do Supabase
# SQL Editor → Execute as migrações em ordem
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
- **Visão geral** de todos os módulos integrados

### 👥 CRM - Customer Relationship Management
- **Central de Clientes** (`/crm/customers`) - Listagem com filtros e paginação
- **Novo Cliente** (`/crm/customers/new`) - Cadastro completo com validações
- **Detalhes do Cliente** (`/crm/customers/[id]`) - Visualização e edição
- **Log de Alterações** (`/crm/audit`) - Auditoria completa (Admin)
- **Campos**: Dados básicos, contato, endereço, forma de pagamento
- **Validações**: Email único, telefone com máscara internacional
- **Auditoria**: Log automático de todas as alterações

### 💰 SD - Sales & Distribution
- **Pedidos de Venda** (`/sd/orders`) - Listagem com filtros e status
- **Novo Pedido** (`/sd/orders/new`) - Criação com itens dinâmicos
- **Detalhes do Pedido** (`/sd/orders/[id]`) - Visualização e ações
- **Integração com CRM** - Clientes e materiais
- **Preços congelados** no pedido conforme especificação
- **Status**: Rascunho → Aprovado → Faturado → Cancelado
- **Valores**: Final calculado + Negociado opcional

### 📦 WH - Warehouse Management
- **Central de Estoque** (`/wh/inventory`) - Posição atual com filtros
- **Dashboard de Estoque** (`/wh/dashboard`) - KPIs e análises
- **Entradas de Estoque** (`/wh/entries`) - Movimentações automáticas
- **Saídas de Estoque** (`/wh/exits`) - Movimentações automáticas
- **Status inteligente**: Ativo, Em Reposição, Zerado, Bloqueado
- **Integração automática** com MM (compras) e SD (vendas)
- **KPIs**: Valor total, giro de estoque, alertas de reposição

### 💳 FI - Financial Management
- **Lançamentos** (`/fi/entries`) - Entradas e saídas financeiras
- **Contas a Pagar** (`/fi/payable`) - Fornecedores e despesas
- **Contas a Receber** (`/fi/receivable`) - Clientes e receitas
- **Dashboard Financeiro** (`/fi/dashboard`) - KPIs e relatórios
- **Categorias configuráveis** de despesas
- **Status automático** baseado em datas de vencimento
- **Integração** com módulos SD e MM

### 📦 MM - Material Management
- **Catálogo de Materiais** (`/mm/catalog`) - Listagem com filtros
- **Novo Material** (`/mm/materials/new`) - Cadastro individual
- **Edição em Lote** (`/mm/materials/bulk-edit`) - Edição massiva
- **Importação em Massa** (`/mm/materials/bulk-import`) - CSV/XLSX
- **Pedidos de Compra** (`/mm/purchases`) - Gestão completa
- **Central de Fornecedores** (`/mm/vendors`) - Gestão completa
- **Detalhes do Fornecedor** (`/mm/vendors/[id]`) - Visualização e edição
- **Total movimentado** por fornecedor

### ⚙️ Sistema
- **Configurações** (`/setup`) - Setup inicial do sistema
- **Analytics** (`/analytics`) - Relatórios e dashboards

## 📊 KPIs e Métricas

### 🏠 Dashboard Principal
- **Total de Materiais** - Contagem real de itens cadastrados
- **Valor Total em Estoque** - Valor monetário do inventário
- **Vendas do Mês** - Receita do período atual
- **Lucro Total** - Margem de lucro consolidada

### 👥 CRM - Clientes
- **Total de Clientes** - Clientes cadastrados no sistema
- **Clientes Ativos** - Clientes com status ativo
- **Novos Clientes** - Cadastros dos últimos 30 dias
- **Taxa de Conversão** - Lead para cliente

### 💰 SD - Vendas
- **Total de Pedidos** - Pedidos de venda cadastrados
- **Valor Total** - Receita total em vendas
- **Pedidos Aprovados** - Pedidos em status aprovado
- **Ticket Médio** - Valor médio por pedido

### 📦 WH - Estoque
- **Total de Itens** - Itens únicos em estoque
- **Valor Total** - Valor monetário do estoque
- **Em Reposição** - Itens com estoque baixo
- **Estoque Zerado** - Itens sem estoque
- **Giro de Estoque** - Rotação anual
- **Eficiência** - Precisão do inventário

### 💳 FI - Financeiro
- **Receita Total** - Entradas dos últimos 30 dias
- **Despesa Total** - Saídas dos últimos 30 dias
- **Lucro Bruto** - Receita menos despesas
- **A Receber** - Contas a receber em aberto
- **A Pagar** - Contas a pagar em aberto
- **Fluxo de Caixa** - Diferença entre a receber e a pagar

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

### ✅ CRM - Customer Relationship Management
- **Cadastro completo de clientes** com validações
- **Campos**: Dados básicos, contato, endereço, forma de pagamento
- **Validações**: Email único, telefone com máscara internacional
- **Filtros avançados** por nome, email, status, cidade
- **Exportação CSV** de dados filtrados
- **Auditoria completa** com log de alterações
- **Interface responsiva** com design Fiori

### ✅ SD - Sales & Distribution
- **Gestão completa de pedidos de venda**
- **Preços congelados** no momento da criação do pedido
- **Status workflow**: Rascunho → Aprovado → Faturado → Cancelado
- **Valores**: Final calculado automaticamente + Negociado opcional
- **Integração com CRM** para dados de clientes
- **Integração com MM** para materiais e preços
- **Formas de pagamento** configuráveis

### ✅ WH - Warehouse Management
- **Posição de estoque em tempo real**
- **Status inteligente** baseado em quantidade e configurações
- **Integração automática** com pedidos de compra e venda
- **Dashboard com KPIs** de performance de estoque
- **Alertas de reposição** para itens com estoque baixo
- **Relatórios de movimentação** e giro de estoque
- **Gestão de coleções** e classificação de materiais

### ✅ FI - Financial Management
- **Lançamentos financeiros** de entrada e saída
- **Contas a pagar e receber** com status automático
- **Categorias de despesas** configuráveis
- **Dashboard financeiro** com KPIs essenciais
- **Integração com módulos** SD e MM
- **Status automático** baseado em datas de vencimento
- **Relatórios exportáveis** em CSV/Excel

### ✅ MM - Material Management
- **Geração automática de IDs** de materiais (B_, G_, C_, P_, K_)
- **Cadastro individual** com validação completa
- **Edição em lote** com confirmação de mudanças
- **Importação em massa** via CSV/XLSX com validação
- **Catálogo** com filtros e busca
- **Pedidos de compra** com detalhes completos dos materiais
- **Gestão de fornecedores** com campos completos
- **Total movimentado** por fornecedor

### ✅ Autenticação e Segurança
- **Login com Google** via Supabase OAuth
- **Middleware robusto** para proteção de rotas
- **Sessões persistentes** com cookies seguros
- **Tratamento de erros** em callbacks OAuth
- **Landing page** antes do acesso ao sistema
- **RLS (Row Level Security)** no Supabase

### ✅ Design System Fiori
- **Tema escuro** consistente em toda aplicação
- **Tiles quadrados** sem bordas arredondadas
- **Cores semânticas** para KPIs e status
- **Componentes padronizados** (botões, inputs, tabelas)
- **Navegação intuitiva** inspirada no SAP Fiori
- **Responsividade** mobile-first
- **Acessibilidade** com labels e navegação por teclado

### ✅ Funcionalidades Técnicas
- **Server Components** para performance otimizada
- **Server Actions** para operações de banco
- **TypeScript** com tipagem completa
- **Validações** client-side e server-side
- **Tratamento de erros** robusto
- **Logs de auditoria** automáticos
- **Exportação de dados** em CSV
- **Paginação server-side** para performance

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

## 🔧 Funcionalidades Avançadas

### 📊 Relatórios e Analytics
- **Dashboard Executivo** - Visão geral dos KPIs principais
- **Relatórios Personalizados** - Criação de relatórios customizados
- **Exportação de Dados** - Excel, PDF, CSV
- **Filtros Avançados** - Por período, status, categoria
- **Gráficos Interativos** - Visualização de tendências

### 🔄 Integrações
- **API REST** - Endpoints para integração externa
- **Webhooks** - Notificações em tempo real
- **Importação em Massa** - Excel, CSV, XML
- **Sincronização** - Dados em tempo real

### 🛡️ Segurança e Auditoria
- **Log de Alterações** - Rastreamento completo
- **Controle de Acesso** - Permissões por usuário
- **Backup Automático** - Proteção de dados
- **Criptografia** - Dados sensíveis protegidos

## 🎯 Roadmap

### Próximas Funcionalidades
- [ ] **Mobile App** - Aplicativo nativo
- [ ] **Notificações Push** - Alertas em tempo real
- [ ] **IA/ML** - Previsões e recomendações
- [ ] **Multi-idioma** - Suporte a múltiplos idiomas
- [ ] **Tema Escuro** - Modo escuro/claro
- [ ] **Offline Mode** - Funcionamento sem internet

### Melhorias Planejadas
- [ ] **Performance** - Otimização de consultas
- [ ] **UX/UI** - Melhorias na interface
- [ ] **Testes** - Cobertura completa
- [ ] **Documentação** - Guias detalhados
- [ ] **Monitoramento** - Logs e métricas

## Vercel Setup (Prod + Preview)

1. **Production Branch**: selecione `erp-prod` em *Project → Settings → General → Production Branch*.
2. **Preview Deployments**: qualquer branch ≠ produção vira **Preview**.
3. **Auto-Cancel** (Preview): já habilitado em `vercel.json` (`github.autoJobCancelation: true`).
4. **ENV Vars (todos os ambientes)**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. **SSR Global**: usamos `export const dynamic = 'force-dynamic'` no `app/layout.*` para evitar build estático de páginas que usam cookies/Supabase.

## 📄 Licença

Proprietário - Grupo Galpão Hub

## 🔗 Links Úteis

- **Deploy:** https://workspace-mu-livid.vercel.app
- **GitHub:** https://github.com/grupogalpaohub/erp-laplata
- **Supabase:** Dashboard do projeto
- **Vercel:** Dashboard de deploy