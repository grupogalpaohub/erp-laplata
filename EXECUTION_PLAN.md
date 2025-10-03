# 🚀 PLANO DE EXECUÇÃO DETALHADO

## 📋 RESUMO EXECUTIVO

**Objetivo:** Refatorar completamente o ERP para funcionar 100% com Google OAuth, RLS automático e UI/UX SAP Fiori.

**Tempo Estimado:** 12-18 horas
**Risco:** Baixo (usa database existente)
**Resultado:** Sistema ERP funcional e moderno

---

## 🎯 FASES DE DESENVOLVIMENTO

### **FASE 1: FUNDAÇÃO (2-3 horas)**

#### **1.1 Refatorar Autenticação (45 min)**
```bash
# Arquivos a modificar:
- app/auth/callback/page.tsx
- middleware.ts
- app/providers.tsx
- components/NavBar.tsx
```

**Tarefas:**
- [ ] Simplificar `app/auth/callback/page.tsx` com cookies corretos
- [ ] Limpar `middleware.ts` para permitir callback
- [ ] Simplificar `app/providers.tsx` sem interferência na callback
- [ ] Atualizar `components/NavBar.tsx` para não executar na callback
- [ ] Testar fluxo completo: Login → Callback → Dashboard

#### **1.2 Estrutura Base (45 min)**
```bash
# Arquivos a criar:
- app/(protected)/dashboard/page.tsx
- components/layout/FioriShell.tsx
- components/layout/NavBar.tsx
- components/layout/Sidebar.tsx
- styles/fiori.css
```

**Tarefas:**
- [ ] Criar dashboard principal com cards de resumo
- [ ] Implementar FioriShell com navegação
- [ ] Criar tema SAP Fiori (tons escuros)
- [ ] Implementar sidebar com módulos
- [ ] Testar navegação entre módulos

#### **1.3 Componentes UI Base (30 min)**
```bash
# Arquivos a criar:
- components/ui/Button.tsx
- components/ui/Card.tsx
- components/ui/Input.tsx
- components/ui/Table.tsx
- components/ui/Modal.tsx
- components/ui/Badge.tsx
- components/ui/Loading.tsx
```

**Tarefas:**
- [ ] Implementar componentes base com tema Fiori
- [ ] Criar variantes e tamanhos
- [ ] Implementar estados (loading, disabled, error)
- [ ] Testar componentes em isolado

#### **1.4 APIs Base (30 min)**
```bash
# Arquivos a criar:
- lib/utils/api.ts
- lib/types/base.ts
- utils/tenant.ts (já existe)
```

**Tarefas:**
- [ ] Criar utilitários de API padronizados
- [ ] Implementar tipos base
- [ ] Criar helpers para formatação
- [ ] Testar integração com Supabase

---

### **FASE 2: MÓDULO MM (3-4 horas)**

#### **2.1 Materiais (1.5 horas)**
```bash
# Arquivos a criar:
- app/(protected)/mm/materials/page.tsx
- app/(protected)/mm/materials/new/page.tsx
- app/(protected)/mm/materials/[id]/page.tsx
- app/(protected)/mm/materials/[id]/edit/page.tsx
- app/(protected)/mm/materials/bulk/page.tsx
- app/api/mm/materials/route.ts
- components/forms/MaterialForm.tsx
- components/modules/mm/MaterialList.tsx
- components/modules/mm/MaterialCard.tsx
- lib/types/mm.ts
```

**Tarefas:**
- [ ] Implementar CRUD de materiais
- [ ] Criar formulário de material com validação
- [ ] Implementar lista com filtros e paginação
- [ ] Criar funcionalidade de importação em lote
- [ ] Implementar visualização e edição
- [ ] Testar todas as operações

#### **2.2 Pedidos de Compra (1.5 horas)**
```bash
# Arquivos a criar:
- app/(protected)/mm/purchases/page.tsx
- app/(protected)/mm/purchases/new/page.tsx
- app/(protected)/mm/purchases/[id]/page.tsx
- app/(protected)/mm/purchases/[id]/edit/page.tsx
- app/api/mm/purchase-orders/route.ts
- app/api/mm/purchase-order-items/route.ts
- components/forms/PurchaseOrderForm.tsx
- components/modules/mm/PurchaseOrderList.tsx
- components/modules/mm/PurchaseOrderCard.tsx
```

**Tarefas:**
- [ ] Implementar CRUD de pedidos de compra
- [ ] Criar formulário com header + items dinâmicos
- [ ] Implementar cálculo automático de totais
- [ ] Criar lista com filtros por status e fornecedor
- [ ] Implementar visualização e edição
- [ ] Testar fluxo completo de criação

#### **2.3 Fornecedores (45 min)**
```bash
# Arquivos a criar:
- app/(protected)/mm/vendors/page.tsx
- app/(protected)/mm/vendors/new/page.tsx
- app/(protected)/mm/vendors/[id]/page.tsx
- app/(protected)/mm/vendors/[id]/edit/page.tsx
- app/api/mm/vendors/route.ts
- components/forms/VendorForm.tsx
- components/modules/mm/VendorList.tsx
- components/modules/mm/VendorCard.tsx
```

**Tarefas:**
- [ ] Implementar CRUD de fornecedores
- [ ] Criar formulário com validação
- [ ] Implementar lista com busca
- [ ] Criar visualização e edição
- [ ] Testar integração com materiais

#### **2.4 KPIs de Compras (30 min)**
```bash
# Arquivos a criar:
- app/(protected)/mm/kpis/page.tsx
- app/api/mm/kpis/route.ts
- components/charts/KpiCard.tsx
- components/charts/LineChart.tsx
- components/charts/BarChart.tsx
```

**Tarefas:**
- [ ] Implementar dashboard de KPIs
- [ ] Criar cards com métricas principais
- [ ] Implementar gráficos de tendências
- [ ] Criar relatórios de compras
- [ ] Testar visualização de dados

---

### **FASE 3: MÓDULO SD (3-4 horas)**

#### **3.1 Pedidos de Venda (1.5 horas)**
```bash
# Arquivos a criar:
- app/(protected)/sd/orders/page.tsx
- app/(protected)/sd/orders/new/page.tsx
- app/(protected)/sd/orders/[id]/page.tsx
- app/(protected)/sd/orders/[id]/edit/page.tsx
- app/api/sd/orders/route.ts
- app/api/sd/order-items/route.ts
- components/forms/SalesOrderForm.tsx
- components/modules/sd/SalesOrderList.tsx
- components/modules/sd/SalesOrderCard.tsx
```

**Tarefas:**
- [ ] Implementar CRUD de pedidos de venda
- [ ] Criar formulário com header + items + cliente
- [ ] Implementar fluxo de status (draft → confirmed → shipped → delivered)
- [ ] Criar lista com filtros por status e cliente
- [ ] Implementar visualização e edição
- [ ] Testar fluxo completo de vendas

#### **3.2 Clientes (1 hora)**
```bash
# Arquivos a criar:
- app/(protected)/sd/customers/page.tsx
- app/(protected)/sd/customers/new/page.tsx
- app/(protected)/sd/customers/[id]/page.tsx
- app/(protected)/sd/customers/[id]/edit/page.tsx
- app/api/sd/customers/route.ts
- components/forms/CustomerForm.tsx
- components/modules/sd/CustomerList.tsx
- components/modules/sd/CustomerCard.tsx
```

**Tarefas:**
- [ ] Implementar CRUD de clientes
- [ ] Criar formulário com validação
- [ ] Implementar lista com busca
- [ ] Criar visualização e edição
- [ ] Testar integração com pedidos

#### **3.3 KPIs de Vendas (45 min)**
```bash
# Arquivos a criar:
- app/(protected)/sd/kpis/page.tsx
- app/api/sd/kpis/route.ts
```

**Tarefas:**
- [ ] Implementar dashboard de KPIs de vendas
- [ ] Criar cards com métricas principais
- [ ] Implementar gráficos de performance
- [ ] Criar relatórios de vendas
- [ ] Testar visualização de dados

---

### **FASE 4: MÓDULO WH (2-3 horas)**

#### **4.1 Inventário (1.5 horas)**
```bash
# Arquivos a criar:
- app/(protected)/wh/inventory/page.tsx
- app/(protected)/wh/inventory/[material]/page.tsx
- app/api/wh/inventory/route.ts
- components/modules/wh/InventoryList.tsx
- components/modules/wh/InventoryCard.tsx
```

**Tarefas:**
- [ ] Implementar visualização de saldo de estoque
- [ ] Criar filtros por material e warehouse
- [ ] Implementar alertas de estoque baixo
- [ ] Criar histórico de movimentações
- [ ] Testar visualização de dados

#### **4.2 Movimentações (45 min)**
```bash
# Arquivos a criar:
- app/(protected)/wh/movements/page.tsx
- app/(protected)/wh/movements/new/page.tsx
- app/api/wh/movements/route.ts
- components/forms/MovementForm.tsx
- components/modules/wh/MovementList.tsx
- components/modules/wh/MovementCard.tsx
```

**Tarefas:**
- [ ] Implementar CRUD de movimentações
- [ ] Criar formulário para entradas/saídas
- [ ] Implementar lista com filtros
- [ ] Criar visualização de movimentos
- [ ] Testar integração com inventário

#### **4.3 KPIs de Warehouse (30 min)**
```bash
# Arquivos a criar:
- app/(protected)/wh/kpis/page.tsx
- app/api/wh/kpis/route.ts
```

**Tarefas:**
- [ ] Implementar dashboard de KPIs de warehouse
- [ ] Criar cards com métricas principais
- [ ] Implementar alertas de estoque
- [ ] Criar relatórios de movimentação
- [ ] Testar visualização de dados

---

### **FASE 5: MÓDULO FI (2-3 horas)**

#### **5.1 Contas Contábeis (45 min)**
```bash
# Arquivos a criar:
- app/(protected)/fi/accounts/page.tsx
- app/api/fi/accounts/route.ts
- components/modules/fi/AccountList.tsx
- components/modules/fi/AccountCard.tsx
```

**Tarefas:**
- [ ] Implementar visualização do plano de contas
- [ ] Criar estrutura hierárquica
- [ ] Implementar busca e filtros
- [ ] Criar visualização de contas
- [ ] Testar navegação hierárquica

#### **5.2 Transações (1 hora)**
```bash
# Arquivos a criar:
- app/(protected)/fi/transactions/page.tsx
- app/(protected)/fi/transactions/new/page.tsx
- app/api/fi/transactions/route.ts
- components/forms/TransactionForm.tsx
- components/modules/fi/TransactionList.tsx
- components/modules/fi/TransactionCard.tsx
```

**Tarefas:**
- [ ] Implementar CRUD de transações
- [ ] Criar formulário de lançamentos
- [ ] Implementar lista com filtros
- [ ] Criar visualização de transações
- [ ] Testar integração com outros módulos

#### **5.3 Relatórios (45 min)**
```bash
# Arquivos a criar:
- app/(protected)/fi/reports/page.tsx
- app/(protected)/fi/reports/balance/page.tsx
- app/(protected)/fi/reports/dre/page.tsx
- app/api/fi/reports/route.ts
- components/modules/fi/ReportCard.tsx
```

**Tarefas:**
- [ ] Implementar relatórios financeiros
- [ ] Criar balanço por período
- [ ] Implementar DRE
- [ ] Criar fluxo de caixa
- [ ] Testar geração de relatórios

---

### **FASE 6: POLIMENTO (1-2 horas)**

#### **6.1 Testes e Validação (45 min)**
**Tarefas:**
- [ ] Testar fluxo completo de login
- [ ] Validar navegação entre módulos
- [ ] Testar CRUD em todos os módulos
- [ ] Validar cálculos automáticos
- [ ] Testar responsividade mobile

#### **6.2 Performance e Otimização (30 min)**
**Tarefas:**
- [ ] Otimizar build do Next.js
- [ ] Implementar lazy loading
- [ ] Otimizar queries do Supabase
- [ ] Implementar cache adequado
- [ ] Testar performance geral

#### **6.3 Deploy e Produção (15 min)**
**Tarefas:**
- [ ] Configurar variáveis de ambiente
- [ ] Fazer deploy no Vercel
- [ ] Testar em produção
- [ ] Validar funcionalidades finais
- [ ] Documentar mudanças

---

## 📊 CRONOGRAMA DETALHADO

### **Dia 1 (6-8 horas):**
- **Manhã (3-4h):** Fase 1 (Fundação) + Fase 2.1 (Materiais)
- **Tarde (3-4h):** Fase 2.2 (Pedidos de Compra) + Fase 2.3 (Fornecedores)

### **Dia 2 (6-8 horas):**
- **Manhã (3-4h):** Fase 2.4 (KPIs MM) + Fase 3.1 (Pedidos de Venda)
- **Tarde (3-4h):** Fase 3.2 (Clientes) + Fase 3.3 (KPIs SD)

### **Dia 3 (4-6 horas):**
- **Manhã (2-3h):** Fase 4 (Módulo WH)
- **Tarde (2-3h):** Fase 5 (Módulo FI) + Fase 6 (Polimento)

---

## ✅ CHECKLIST DE VALIDAÇÃO

### **Funcionalidades Core:**
- [ ] Login/Logout com Google OAuth
- [ ] Navegação entre módulos
- [ ] CRUD em todos os módulos
- [ ] Cálculos automáticos funcionando
- [ ] RLS isolando dados por tenant

### **UI/UX:**
- [ ] Tema SAP Fiori aplicado
- [ ] Responsividade mobile
- [ ] Componentes consistentes
- [ ] Navegação intuitiva
- [ ] Feedback visual adequado

### **Performance:**
- [ ] Build < 30 segundos
- [ ] Load < 2 segundos por página
- [ ] APIs < 500ms resposta
- [ ] Mobile responsivo
- [ ] Sem memory leaks

### **Integração:**
- [ ] Database funcionando
- [ ] Triggers executando
- [ ] RLS aplicando
- [ ] APIs respondendo
- [ ] Frontend integrado

---

## 🎯 RESULTADO FINAL

**Sistema ERP completo e funcional com:**
- ✅ **4 Módulos Principais:** MM, SD, WH, FI
- ✅ **UI/UX SAP Fiori:** Tons escuros, profissional
- ✅ **Zero Mudanças no Database:** Usa estrutura atual
- ✅ **RLS Automático:** Segurança por tenant
- ✅ **Triggers Funcionais:** Cálculos automáticos
- ✅ **Responsivo:** Funciona em mobile
- ✅ **Performance:** Rápido e eficiente

**Tempo Total: 12-18 horas**
**Risco: Baixo**
**Resultado: Sistema 100% funcional**

---

## 🚀 PRÓXIMOS PASSOS

1. **Aprovação:** Confirmar escopo e cronograma
2. **Início:** Começar Fase 1 (Fundação)
3. **Desenvolvimento:** Seguir cronograma fase por fase
4. **Testes:** Validar a cada fase
5. **Deploy:** Produção ao final

**Esta proposta garante um sistema ERP funcional, moderno e eficiente!** 🎯
