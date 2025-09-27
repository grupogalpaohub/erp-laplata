# 🛡️ GUARDRAILS OBRIGATÓRIOS - ERP-V1

## REGRAS CRÍTICAS DE SEGURANÇA

### 🔐 SUPABASE RULES
- **API routes** DEVEM usar `@supabase/ssr` com `cookies()` (RLS depende disso)
- **É PROIBIDO** `SERVICE_ROLE_KEY` em `app/**`
- **É PROIBIDO** usar `createClient()` (browser) em `app/api/**`
- **Variáveis corretas**: `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 📄 SCHEMA CONTRACT
- **Nomes de colunas/tabelas** no código DEVEM bater com `db_contract.json` (SoT)
- **SoT = Fonte da Verdade** = arquivos do DB enviados pelo owner
- **PROIBIDO** "corrigir nomes" - se divergir, PARE e peça validação

### 🚫 PROIBIÇÕES ABSOLUTAS
- **NUNCA** hardcode de `tenant_id` (nem filtros por tenant em código)
- **NUNCA** bypass de RLS sem evidências concretas
- **NUNCA** alterar UI/UX sem autorização explícita do owner
- **NUNCA** desabilitar middleware ou RLS

### 🔍 PROTOCOLO DAS 3 PROVAS
1. **Prova 1**: Schema existe (SoT do DB confirma nomes)
2. **Prova 2**: Dados existem (query server-side confirma)
3. **Prova 3**: RLS ativo e coerente (usuário autenticado acessa via políticas)

### 🚨 DIAGNÓSTICO OBRIGATÓRIO
**ANTES de qualquer mudança, forneça:**
- Console do navegador: erros e stack trace
- Network tab: requests com status + payload
- Passos reprodutíveis

### 🔧 COMANDOS DE SEGURANÇA
```bash
# Gerar contrato de schema (SoT)
npm run guardrails:contract

# Verificar guardrails
npm run guardrails

# Instalar hooks de segurança
npm run prepare
npx husky add .husky/pre-commit "npm run guardrails"
```

### ⚠️ CONSEQUÊNCIAS
**Commits que violem guardrails FALHAM automaticamente.**
**Leia a saída do `scripts/guardrails-check.ts` para corrigir.**

---

**🛡️ SEGURANÇA É PRIORIDADE #1 - NUNCA COMPROMETA OS GUARDRAILS**
