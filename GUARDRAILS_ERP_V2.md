# 🛡️ GUARDRAILS ERP V2 - PROPOSTA ENXUTA

> **Objetivo:** Garantir entrega do **mínimo necessário** com qualidade, respeitando **database intocado**, **RLS automático** e **UX Fiori Dark**.
>
> **Formato:** Checklists prontos para execução. Marque **✅ OK** / **❌ FAIL** / **⏭️ N/A**.

---

## 🚫 **PRINCÍPIOS NÃO-NEGOCIÁVEIS**

* ❌ **Alterar database** - Nenhuma tabela/coluna/enum/trigger/view/policy/grant
* ❌ **Bypass RLS** - Nunca usar `service_role` no frontend
* ❌ **Nomes divergentes** - Database dump é fonte única da verdade
* ❌ **Múltiplos Supabase** - Apenas `lib/supabase/server.ts` em páginas/rotas
* ❌ **Duplicar lógica** - Usar triggers existentes (totais, estoque, FI)

---

## 📋 **1. PRE-CHECK (Antes de codar)**

| ID | Item | Critério de Aprovação | Evidência | Status |
|---|---|---|---|---|
| **PC-01** | **Database Reference** | Dump carregado em `/db/_reference` | Caminho + hash SHA | ⏭️ |
| **PC-02** | **Tabelas Módulo** | Lista de tabelas/colunas do módulo mapeada | Tabela dump → UI | ⏭️ |
| **PC-03** | **RLS/Tenant** | Policies identificadas, `tenant_id` mapeado | Resumo policies | ⏭️ |
| **PC-04** | **Auth Google** | Callback configurada, env vars setadas | `.env` (sem secrets) | ⏭️ |
| **PC-05** | **Supabase Server** | `supabaseServer()` único definido | Link arquivo util | ⏭️ |
| **PC-06** | **Tema Fiori** | Tokens dark theme disponíveis | Config Tailwind | ⏭️ |
| **PC-07** | **Rotas Módulo** | Rotas confirmadas (lista/novo/editar) | Lista rotas | ⏭️ |
| **PC-08** | **Triggers** | Triggers do módulo mapeadas | 3 bullets por trigger | ⏭️ |
| **PC-09** | **KPIs** | 3-4 KPIs + queries definidas | Query SQL rascunho | ⏭️ |
| **PC-10** | **Bulk Import** | Template CSV + schema Zod | Arquivo + schema | ⏭️ |

---

## ✅ **2. PÓS-CHECK (Ao finalizar tarefa)**

| ID | Item | Critério de Aprovação | Evidência | Status |
|---|---|---|---|---|
| **PO-01** | **RLS Ativo** | Tenant A não vê dados do Tenant B | Print 2 sessões | ⏭️ |
| **PO-02** | **Nomes Corretos** | Campos = dump (sem renomear) | Diff dump ↔ UI | ⏭️ |
| **PO-03** | **Fluxo Principal** | Happy path completo sem erros | Loom/prints | ⏭️ |
| **PO-04** | **Triggers Efetivas** | DB dispara ações (totais, estoque, FI) | Print antes/depois | ⏭️ |
| **PO-05** | **Validação Zod** | Bloqueia dados inválidos | Print erros | ⏭️ |
| **PO-06** | **Erros Controlados** | Toast/mensagem clara (sem stack) | Print | ⏭️ |
| **PO-07** | **Loading States** | Feedback visual presente | Print/gif | ⏭️ |
| **PO-08** | **KPI Confere** | KPI = contagem manual | SQL + valor UI | ⏭️ |
| **PO-09** | **Acessibilidade** | Labels/alt/tabindex OK | Checklist | ⏭️ |
| **PO-10** | **Export CSV** | Exporta colunas visíveis | Arquivo CSV | ⏭️ |

---

## 🔒 **3. PRE-COMMIT (Antes de commitar)**

| ID | Item | Critério de Aprovação | Evidência | Status |
|---|---|---|---|---|
| **PCMT-01** | **Sem Secrets** | Nenhuma key/token versionada | Diff limpo | ⏭️ |
| **PCMT-02** | **Supabase Único** | Sem `createClient()` fora de server.ts | Grep output | ⏭️ |
| **PCMT-03** | **Tipos/Lint** | TypeScript + ESLint OK | Log execução | ⏭️ |
| **PCMT-04** | **Build** | Build local OK | Log execução | ⏭️ |
| **PCMT-05** | **Rotas RLS** | Server Components + RLS | Code review | ⏭️ |
| **PCMT-06** | **Dependências** | Sem libs desnecessárias | Diff lockfile | ⏭️ |
| **PCMT-07** | **Teste Mínimo** | Click test fluxo principal | Checklist | ⏭️ |
| **PCMT-08** | **UI Fiori** | Tabelas + formulários + tema | Prints | ⏭️ |
| **PCMT-09** | **KPI Documentado** | Query SQL comentada | Comentário | ⏭️ |
| **PCMT-10** | **Commit Padrão** | `módulo: ação – tela` | Mensagem | ⏭️ |

---

## 🚀 **4. PÓS-MERGE (Pré-deploy)**

| ID | Item | Critério de Aprovação | Evidência | Status |
|---|---|---|---|---|
| **PM-01** | **Preview Build** | Deploy preview sem erros | URL preview | ⏭️ |
| **PM-02** | **Auth Google** | Login funciona do zero | Loom/prints | ⏭️ |
| **PM-03** | **RLS Preview** | Multi-tenant OK no preview | Prints | ⏭️ |

---

## 📊 **5. CRITÉRIOS DE SAÍDA POR MÓDULO**

### **MM (Material Management)**
- ✅ CRUD Materiais (unitário + bulk)
- ✅ CRUD Fornecedores
- ✅ PO Wizard + totais automáticos
- ✅ Recebimento + movimenta estoque
- ✅ KPIs conferidos
- ✅ RLS validado

### **SD (Sales & Distribution)**
- ✅ CRUD Clientes
- ✅ SO Wizard + status flow
- ✅ Expedição + baixa estoque
- ✅ KPIs conferidos
- ✅ RLS validado

### **WH (Warehouse Management)**
- ✅ Saldo por material/planta
- ✅ Movimentos read-only
- ✅ Alertas baixo estoque
- ✅ KPIs conferidos

### **FI (Financial)**
- ✅ Transações read-only
- ✅ Faturas read-only
- ✅ KPIs DRE/aging
- ✅ RLS validado

---

## 🛠️ **6. TEMPLATES AUXILIARES**

### **Mapeamento Dump → UI**
```typescript
// Exemplo para mm_material
const MaterialMapping = {
  mm_material: { type: 'string', required: true, label: 'ID Material' },
  material_name: { type: 'string', required: true, label: 'Nome' },
  unit_price_cents: { type: 'number', required: true, label: 'Preço Unitário' },
  category: { type: 'string', required: true, label: 'Categoria' },
  vendor_id: { type: 'uuid', required: false, label: 'Fornecedor' }
}
```

### **Schema Zod Padrão**
```typescript
const MaterialSchema = z.object({
  material_name: z.string().min(1, 'Nome obrigatório'),
  unit_price_cents: z.number().positive('Preço deve ser positivo'),
  category: z.string().min(1, 'Categoria obrigatória'),
  vendor_id: z.string().uuid('ID fornecedor inválido').optional()
})
```

### **Componente DataTable**
```typescript
interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  pagination?: boolean
  search?: boolean
  onRowClick?: (row: T) => void
}
```

---

## 🔍 **7. PROTOCOLO "3-PROVAS"**

Quando houver dúvida, apresentar:

1. **Prova do Dump** - Print/SQL mostrando tabela/coluna
2. **Prova da Tela** - Print UI apontando campo correspondente
3. **Prova do Log** - Print resultado/erro confirmando comportamento

**Sem as 3 provas, não alterar código nem fluxo.**

---

## 📝 **8. COMANDOS ÚTEIS**

### **Verificação Rápida**
```bash
# Verificar createClient fora de server.ts
grep -r "createClient(" app/ --exclude-dir=node_modules

# Verificar secrets no código
grep -r "SUPABASE.*KEY" app/ --exclude-dir=node_modules

# Build e typecheck
npm run build && npm run typecheck && npm run lint
```

### **Teste RLS**
```sql
-- Verificar dados por tenant
SELECT tenant_id, COUNT(*) FROM mm_material GROUP BY tenant_id;
```

---

## 🎯 **9. CHECKLIST RÁPIDO**

### **Antes de Começar:**
- [ ] Database dump carregado
- [ ] Tabelas mapeadas
- [ ] Auth configurada
- [ ] Tema Fiori pronto

### **Durante Desenvolvimento:**
- [ ] RLS ativo
- [ ] Nomes = dump
- [ ] Triggers funcionando
- [ ] Validação Zod

### **Antes de Commit:**
- [ ] Sem secrets
- [ ] Build OK
- [ ] Teste manual
- [ ] Commit padronizado

### **Após Deploy:**
- [ ] Preview funcionando
- [ ] Auth OK
- [ ] RLS validado

---

## ⚠️ **10. EXCEÇÕES**

Qualquer exceção aos guardrails precisa de:
- ✅ **Aprovação explícita**
- ✅ **Registro em changelog**
- ✅ **Evidência do "porquê"**
- ✅ **Análise de impacto**

---

> **💡 Dica:** Use este arquivo como checklist ativo. Marque ✅ quando completar cada item e mantenha evidências para revisão.

**🚀 Pronto para começar a implementação seguindo estes guardrails!**
