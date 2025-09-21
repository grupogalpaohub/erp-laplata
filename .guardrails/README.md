# 🛡️ GUARD RAILS - PROTEÇÕES DO SISTEMA

## 📋 **GUARD RAILS ATIVOS:**

### 1. **Vercel Protection** (`.guardrails/vercel-protection.md`)
- **Objetivo**: Impedir alterações não autorizadas nas configurações do Vercel
- **Protege**: `vercel.json`, `next.config.js`, variáveis de ambiente, deploy hooks
- **Status**: ✅ ATIVO

### 2. **Database Protection** (`.guardrails/database-protection.md`)
- **Objetivo**: Proteger esquemas e dados do banco
- **Protege**: Migrações, seeds, RLS policies
- **Status**: ⏳ PENDENTE

### 3. **Authentication Protection** (`.guardrails/auth-protection.md`)
- **Objetivo**: Proteger configurações de autenticação
- **Protege**: Supabase config, OAuth settings, middleware
- **Status**: ⏳ PENDENTE

## 🎯 **COMO FUNCIONA:**

1. **Verificação Automática**: Antes de qualquer alteração, verificar se está na lista de proteção
2. **Solicitação de Autorização**: Se protegido, solicitar autorização explícita
3. **Documentação**: Registrar todas as mudanças autorizadas
4. **Reversão**: Manter histórico para possível reversão

## 📝 **ADICIONAR NOVO GUARD RAIL:**

```markdown
# 🛡️ GUARD RAIL - [NOME]

## ⚠️ REGRAS OBRIGATÓRIAS
### 🚫 NUNCA ALTERAR SEM AUTORIZAÇÃO:
- [Lista de arquivos/configurações protegidas]

### ✅ PERMITIDO SEM AUTORIZAÇÃO:
- [Lista de arquivos permitidos]

### 🔒 PROCESSO DE AUTORIZAÇÃO:
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]
```

---
**Última Atualização:** 2025-01-21
**Versão:** 1.0.0
