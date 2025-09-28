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
│   ├── purchase-orders/  # Pedidos de compra
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

### Sistema de IDs Sequenciais

O sistema utiliza **IDs sequenciais únicos** para todos os registros principais, garantindo unicidade e rastreabilidade:

#### 📦 Materiais (MM)
- **B_** - Brincos (ex: B_001, B_175)
- **G_** - Gargantilhas (ex: G_001, G_184) 
- **C_** - Cordões (ex: C_001, C_200)
- **A_** - Anéis (ex: A_001, A_150)
- **P_** - Pulseiras (ex: P_001, P_300)
- **Ch_** - Chokers (ex: Ch_001, Ch_100)
- **K_** - Kits (ex: K_001, K_050)

**Formato**: `PREFIXO_NUMERO` onde o número é sequencial por tipo.

#### 🏢 Fornecedores (MM)
- **SUP_** - Fornecedores (ex: SUP_00001, SUP_00002)
- **V_** - Fornecedores alternativos (ex: V1234567890)

#### 🛒 Pedidos de Compra (MM)
- **PO-000001** - Pedidos de compra (ex: PO-000001, PO-000002)
- **PO-YYYYMM-SEQ6** - Formato alternativo com data

#### 💰 Pedidos de Venda (SD)
- **SO-YYYYMM-SEQ6** - Pedidos de venda (ex: SO-202501-000001)
- **SOI001** - Itens de pedido (ex: SOI001, SOI002)

#### 👥 Clientes (CRM)
- **CUST-1234567890** - Clientes (ex: CUST-1234567890)
- **CUST-YYYYMM-SEQ6** - Formato alternativo com data

#### 🏭 Depósitos (WH)
- **WH-001** - Depósitos (ex: WH-001, WH-002)
- **PLANT-001** - Plantas (ex: PLANT-001, PLANT-002)

#### 💳 Lançamentos Financeiros (FI)
- **FI-YYYYMM-SEQ6** - Lançamentos (ex: FI-202501-000001)
- **PAY-YYYYMM-SEQ6** - Pagamentos (ex: PAY-202501-000001)
- **REC-YYYYMM-SEQ6** - Recebimentos (ex: REC-202501-000001)

#### 📊 Movimentações de Estoque (WH)
- **MOV-YYYYMM-SEQ6** - Movimentações (ex: MOV-202501-000001)
- **ENT-YYYYMM-SEQ6** - Entradas (ex: ENT-202501-000001)
- **SAI-YYYYMM-SEQ6** - Saídas (ex: SAI-202501-000001)

### Geração Automática de IDs

#### ✅ Implementado
- **Materiais**: Geração baseada no tipo com prefixo automático
- **Pedidos de Compra**: Sequencial PO-000001, PO-000002...
- **Pedidos de Venda**: Função `next_doc_number()` com formato SO-YYYYMM-SEQ6
- **Clientes**: Timestamp-based CUST-1234567890
- **Fornecedores**: Timestamp-based V1234567890

#### 🔧 Funções de Geração
- **`generate_material_id(tipo)`** - Gera ID de material baseado no tipo
- **`next_doc_number(tenant_id, doc_type)`** - Gera números sequenciais para documentos
- **Validação automática** de unicidade antes da inserção
- **Fallback para timestamp** em caso de conflito

#### 📋 Tabela de Controle
```sql
doc_numbering (
  tenant_id TEXT,
  doc_type TEXT,     -- 'SO', 'PO', 'FI', etc.
  prefix TEXT,       -- 'SO-', 'PO-', 'FI-'
  format TEXT,       -- 'YYYYMM-SEQ6'
  next_seq INTEGER,  -- Próximo número da sequência
  is_active BOOLEAN
)
```

**Importação em Massa**: 
- Para **criar** novos registros: deixe o campo ID vazio no CSV
- Para **atualizar** registros existentes: inclua o ID completo
- **Validação automática** de formato e unicidade

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
# Desenvolvimento (porta 3000 forçada)
npm run dev

# Build para produção
npm run build

# Linting
npm run lint

# Type checking
npm run type-check

# Sincronização automática com GitHub
npm run sync
```

## 🔧 Guardrails e Qualidade

### Pre-commit Hooks
- **Verificação automática** de arquivos críticos antes do commit
- **Bloqueio de .env.local** para evitar vazamento de credenciais
- **Validação TypeScript** para manter qualidade do código
- **Preflight script** para verificações hierárquicas

### Preflight Script
- **Verificação de porta** (deve ser 3000 em desenvolvimento)
- **Validação de autenticação** e variáveis de ambiente
- **Teste de conectividade** com banco de dados
- **Documentação de mudanças** para alterações críticas
- **Validação TypeScript** com tratamento de erros

### Sincronização Automática
- **Script de sync** para commit e push automático
- **Exclusão automática** de `.env.local`
- **Detecção de branch** e configuração de upstream
- **Mensagens padronizadas** com timestamp

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
- **Edição de Pedidos** (`/sd/orders/[id]/edit`) - Edição completa de pedidos
- **Integração com CRM** - Clientes e materiais
- **Preços automáticos** carregados do database
- **Status**: Rascunho → Pedido Criado → (outros via botão)
- **Valores**: Final calculado + Negociado opcional
- **KPIs**: Margem de contribuição, Lucro (R$ e %), Gap entre valores
- **Campos**: Forma de pagamento, observações, datas, status

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

## 🔒 Autenticação e Segurança

### Autenticação
- **Supabase Auth** com Google OAuth
- **Middleware** para proteção de rotas
- **Callback robusto** com tratamento de erros
- **Sessão persistente** com cookies seguros
- **Landing page** antes do login

### RLS (Row Level Security)
- **RLS habilitado** em todas as tabelas do Supabase
- **Políticas por tenant_id** para isolamento de dados
- **Bypass para desenvolvimento** com `AUTH_DISABLED=true`
- **Service role key** para operações administrativas
- **Políticas automáticas** para SELECT, INSERT, UPDATE, DELETE

### Desenvolvimento Local
- **AUTH_DISABLED=true** no `.env.local` para bypass de autenticação
- **Service role key** para bypass do RLS durante desenvolvimento
- **Tenant fixo** (`LaplataLunaria`) para testes locais
- **Middleware inteligente** que detecta modo de desenvolvimento

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
- **Gestão completa de pedidos de venda** com interface moderna
- **Preços congelados** no momento da criação do pedido
- **Status workflow**: Rascunho → Pedido Criado → Aprovado → Faturado → Cancelado
- **Valores**: Final calculado automaticamente + Negociado opcional
- **Integração com CRM** para dados de clientes
- **Integração com MM** para materiais e preços
- **Formas de pagamento** e condições configuráveis
- **KPIs avançados**: Margem de contribuição, Lucro (R$ e %), Gap entre valores
- **Edição completa** de pedidos com validações
- **Mudança de status** com botões funcionais
- **Campos adicionais**: Observações, datas, status

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
- **Gestão de fornecedores** com campos completos (CPF/CNPJ)
- **Total movimentado** por fornecedor
- **Triggers automáticos** para cálculo de preços e totais
- **Compatibilidade** com campos quantity e mm_material
- **Validação de preços** automática do banco de dados

### ✅ Autenticação e Segurança
- **Login com Google** via Supabase OAuth
- **Middleware robusto** para proteção de rotas
- **Sessões persistentes** com cookies seguros
- **Tratamento de erros** em callbacks OAuth
- **Landing page** antes do acesso ao sistema
- **RLS (Row Level Security)** no Supabase
- **Bypass para desenvolvimento** com AUTH_DISABLED
- **Service role key** para operações administrativas
- **Políticas automáticas** por tenant_id

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
- **Guardrails automáticos** para qualidade de código
- **Pre-commit hooks** para validação
- **Sincronização automática** com GitHub

### ✅ Triggers e Automação do Banco
- **freeze_item_price()** - Congela preços e calcula totais automaticamente
- **trg_update_po_total()** - Atualiza total do pedido em tempo real
- **Validação de preços** - Verifica se material tem preço cadastrado
- **Cálculo automático** - line_total_cents = mm_qtt × unit_cost_cents
- **Compatibilidade total** - Funciona com campos quantity e material_id
- **Performance otimizada** - Triggers executam apenas quando necessário

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

## 🚀 Vercel Setup (Produção + Preview)

### Configuração de Branches
1. **Production Branch**: `erp-prod` (configurado em Project → Settings → General)
2. **Preview Branches**: `erp-dev`, `erp-git` (qualquer branch ≠ produção)
3. **Auto-Cancel**: Habilitado para cancelar deploys anteriores automaticamente
4. **Deploy Hooks**: Configurados para controle manual de deploys

### Variáveis de Ambiente
Configure no dashboard do Vercel para **Production** e **Preview**:
- `NEXT_PUBLIC_SUPABASE_URL` - URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Chave anônima do Supabase
- `NEXT_PUBLIC_SITE_URL` - URL base da aplicação (opcional)

### Configurações Técnicas
- **SSR Global**: `export const dynamic = 'force-dynamic'` em todas as páginas
- **API Routes**: Configuradas com `export const dynamic = 'force-dynamic'`
- **Runtime**: `nodejs` para todas as rotas API
- **Cache**: `revalidate = 0` e `fetchCache = 'force-no-store'`

### GitHub Workflows
- **Deploy Preview**: Trigger automático via Deploy Hook para `erp-dev`
- **Block Production**: Previne pushes diretos para branches de produção
- **Auto-Cancel**: Cancela deploys anteriores quando novo commit é feito

### Troubleshooting Deploy
- **Build Errors**: Verificar duplicações de `export const` em arquivos
- **Dynamic Server Usage**: Todas as rotas configuradas com `force-dynamic`
- **Environment Variables**: Confirmar configuração no Vercel Dashboard
- **Logs**: Usar `vercel logs <deployment-url>` para debug

## 🔒 Segurança & Regras do Projeto (ERP-V1)

### Configuração de Ambiente
- **`.env.local`** final (sem `NEXT_PUBLIC_AUTH_DISABLED`)
- **NUNCA** mexer em Supabase (DDL/policies) via app
- **NUNCA** pedir/ecoar URI/keys
- **Middleware ativo** com tenant fixo `LaplataLunaria`
- **RLS sempre ativo** em todas as tabelas

### Regras de Desenvolvimento
- **Tenant fixo**: `LaplataLunaria` (NEXT_PUBLIC_TENANT_ID)
- **Service Role**: Apenas server-side (route handlers/actions/scripts)
- **Client-side**: Apenas anon key com RLS
- **Evidências obrigatórias**: Console/Network antes de mudar código
- **Protocolo 3 Provas**: schema, dados, RLS

### Arquivos de Configuração
- **`.guardrails/guardrail.ts`** - Sistema de guardrails
- **`cursorrules.txt`** - Regras para Cursor AI
- **`.cursor-contract.txt`** - Contrato de segurança
- **`lib/supabase/`** - Clientes padronizados

## 📄 Licença

Proprietário - Grupo Galpão Hub

## 🔗 Links Úteis

- **Deploy:** https://workspace-mu-livid.vercel.app
- **GitHub:** https://github.com/grupogalpaohub/erp-laplata
- **Supabase:** Dashboard do projeto
- **Vercel:** Dashboard de deploy