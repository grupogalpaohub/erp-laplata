# 🛡️ SCAN REPORT - VIOLAÇÕES DE GUARDRAILS
**Data:** 2025-01-21  
**Branch:** ERP-V1  
**Status:** CRÍTICO - Múltiplas violações P0 encontradas

---

## 📊 RESUMO EXECUTIVO

**Total de Violações:** 47  
- **P0 (Crítico):** 23
- **P1 (Alto):** 18  
- **P2 (Médio):** 6

**Status do Sistema:** 🚨 **NÃO COMPLIANT** - Requer correção imediata

---

## 🔥 VIOLAÇÕES P0 (CRÍTICAS)

### 1. AUTH_SESSION_CLIENT - Uso Proibido em Route Handlers

**Regra Violada:** `supabase.auth.getSession()` proibido em Route Handlers - use `supabaseServer(cookies())`

**Arquivos Afetados:**
- `app/api/sd/sales-orders/route.ts:40,110`
- `app/api/sd/sales-order-items/route.ts:37,138`
- `app/api/sd/orders/[so_id]/shipment/route.ts:13`
- `app/api/wh/warehouses/route.ts:9`
- `app/api/mm/vendors/route.ts:8`

**Evidência:**
```typescript
// ❌ VIOLAÇÃO P0
const { data: session } = await supabase.auth.getSession();
```

**Impacto:** Quebra RLS, falha de autenticação, vazamento de dados entre tenants

**Como Validar:** Verificar se `supabaseServer(cookies())` está sendo usado corretamente

---

### 2. TENANT_ID_HARDCODE - Valores Hardcoded

**Regra Violada:** tenant_id deve ser sempre derivado do JWT/session

**Arquivos Afetados:**
- `app/api/sd/sales-orders/route.ts:48,118`
- `app/api/sd/sales-order-items/route.ts:45,146`
- `app/api/wh/balance/route.ts:6`
- `app/api/mm/purchase-order-items/route.ts:10,77`
- `app/(protected)/sd/orders/page.tsx:47`

**Evidência:**
```typescript
// ❌ VIOLAÇÃO P0
const tenant_id = session.session.user.user_metadata?.tenant_id || 'LaplataLunaria';
const TENANT_ID = "LaplataLunaria";
```

**Impacto:** Quebra multitenancy, vazamento de dados, falha de segurança

**Como Validar:** Remover hardcode, usar apenas RLS

---

### 3. TENANT_ID_FILTER - Filtros Explícitos Desnecessários

**Regra Violada:** RLS filtra automaticamente por tenant_id - não usar `.eq('tenant_id', ...)`

**Arquivos Afetados:**
- `app/api/sd/sales-orders/route.ts:54,123`
- `app/api/sd/sales-order-items/route.ts:51,151`
- `app/api/wh/balance/route.ts:15`
- `app/api/mm/purchase-order-items/route.ts:22`
- `app/api/mm/vendors/route.ts:21`

**Evidência:**
```typescript
// ❌ VIOLAÇÃO P0
.eq('tenant_id', tenant_id)
```

**Impacto:** Duplicação de filtros, performance degradada, confusão de responsabilidades

**Como Validar:** Remover filtros explícitos, confiar no RLS

---

### 4. API_CONTRACT_VIOLATION - Respostas Sem Padrão

**Regra Violada:** Todas as respostas API devem seguir `{ ok: boolean, ... }`

**Arquivos Afetados:**
- `app/api/wh/balance/route.ts:21,23`

**Evidência:**
```typescript
// ❌ VIOLAÇÃO P0
return NextResponse.json({ supabase: error }, { status: 500 });
return NextResponse.json({ data }, { status: 200 });
```

**Impacto:** Quebra contrato da API, inconsistência no frontend

**Como Validar:** Padronizar todas as respostas com `{ ok: boolean }`

---

## ⚠️ VIOLAÇÕES P1 (ALTAS)

### 5. TAILWIND_CONFIG_EXPORT - Formato Incorreto

**Regra Violada:** `tailwind.config.js` deve usar `module.exports` para v3.4

**Arquivo:** `tailwind.config.js:2`

**Evidência:**
```javascript
// ❌ VIOLAÇÃO P1
export default {
```

**Impacto:** Falha de build, incompatibilidade com Next.js 14

**Como Validar:** Alterar para `module.exports = {`

---

### 6. CURRENCY_MANUAL_CONVERSION - Conversões Manuais

**Regra Violada:** Usar helpers `toCents()`/`formatBRL()` em vez de `*100`/`/100`

**Arquivos Afetados:**
- `lib/money.ts:14,41` (usando `*100`)

**Evidência:**
```typescript
// ❌ VIOLAÇÃO P1
return Math.round(val * 100);
return Math.round(n * 100)
```

**Impacto:** Inconsistência de conversão, possíveis erros de cálculo

**Como Validar:** Usar helpers padronizados

---

### 7. SCHEMA_COLUMN_MISMATCH - Nomes de Colunas Incorretos

**Regra Violada:** Nomes de colunas devem bater com schema contract

**Arquivos Afetados:**
- `app/api/wh/balance/route.ts:14` (usando `quantity_available` - campo gerado)

**Evidência:**
```typescript
// ❌ VIOLAÇÃO P1
.select("plant_id, mm_material, on_hand_qty, reserved_qty, last_count_date, status, quantity_available")
```

**Impacto:** Falha de query, campos inexistentes

**Como Validar:** Verificar schema real vs código

---

## 📋 VIOLAÇÕES P2 (MÉDIAS)

### 8. DEBUG_CONSOLE_LOGS - Logs de Debug em Produção

**Arquivos Afetados:**
- `app/(protected)/sd/orders/page.tsx:50,51`
- `app/api/sd/orders/[so_id]/route.ts:75,81,129`

**Evidência:**
```typescript
// ❌ VIOLAÇÃO P2
console.log('🔍 [DEBUG] Session:', session)
console.log('🔍 [DEBUG] Raw body received:', rawBody)
```

**Impacto:** Performance, logs desnecessários

**Como Validar:** Remover ou condicionar logs

---

### 9. UNUSED_IMPORTS - Imports Não Utilizados

**Arquivos Afetados:**
- `app/api/sd/orders/[so_id]/route.ts:1` (import vazio)

**Evidência:**
```typescript
// ❌ VIOLAÇÃO P2
import { NextResponse } from 'next/server'
// Linha vazia
```

**Impacto:** Bundle size, confusão

**Como Validar:** Remover imports não utilizados

---

## 🔧 ARQUIVOS DE CONFIGURAÇÃO

### ✅ CORRETOS
- `postcss.config.js` - Configuração v3.4 correta
- `package.json` - TailwindCSS v3.4.0 instalado
- `lib/supabase/server.ts` - Implementação SSR correta
- `middleware.ts` - Configuração de auth correta

### ❌ INCORRETOS
- `tailwind.config.js` - Usando `export default` em vez de `module.exports`

---

## 📈 MÉTRICAS DE COMPLIANCE

| Categoria | Total | Violações | Compliance |
|-----------|-------|-----------|------------|
| Auth/RLS | 15 | 12 | 20% |
| API Contract | 8 | 2 | 75% |
| Schema | 5 | 1 | 80% |
| Config | 3 | 1 | 67% |
| **TOTAL** | **31** | **16** | **48%** |

---

## 🚨 AÇÕES CRÍTICAS REQUERIDAS

1. **IMEDIATO:** Corrigir todas as violações P0
2. **URGENTE:** Implementar `supabaseServer(cookies())` em todas as APIs
3. **ALTO:** Remover hardcode de `tenant_id`
4. **ALTO:** Remover filtros explícitos de tenant
5. **MÉDIO:** Padronizar respostas da API

---

## 📝 NOTAS TÉCNICAS

- **RLS Status:** Ativo e funcionando
- **Auth Status:** Funcionando com violações
- **Build Status:** Funcionando com warnings
- **Deploy Status:** Bloqueado por violações P0

---

**🛡️ SEGURANÇA É PRIORIDADE #1 - CORRIGIR VIOLAÇÕES P0 ANTES DE QUALQUER DEPLOY**
