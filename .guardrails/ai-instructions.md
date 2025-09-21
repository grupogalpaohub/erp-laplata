# 🤖 INSTRUÇÕES PARA IA - GUARD RAILS

## 🚨 **REGRAS CRÍTICAS:**

### 1. **SEMPRE VERIFICAR GUARD RAILS ANTES DE ALTERAR:**
- Ler `.guardrails/vercel-protection.md` antes de tocar em configurações do Vercel
- Verificar se o arquivo está na lista de proteção
- Se estiver protegido, **PARAR** e solicitar autorização

### 2. **PROCESSO OBRIGATÓRIO:**
```
1. Identificar arquivo a ser alterado
2. Verificar se está em .guardrails/*.md
3. Se SIM: Solicitar autorização explícita
4. Se NÃO: Prosseguir normalmente
5. Documentar mudança se autorizada
```

### 3. **EXEMPLOS DE VERIFICAÇÃO:**
```bash
# ❌ ANTES DE ALTERAR, VERIFICAR:
- vercel.json
- next.config.js
- .env files
- Deploy hooks
- Branch configurations
```

### 4. **FRASE DE AUTORIZAÇÃO:**
```
"Posso alterar [ARQUIVO] para [MOTIVO]? 
Esta alteração afetará [IMPACTO]. 
Confirma a autorização?"
```

### 5. **NUNCA ASSUMIR AUTORIZAÇÃO:**
- Mesmo que seja uma "pequena mudança"
- Mesmo que seja "apenas para testar"
- Mesmo que seja "temporário"
- **SEMPRE perguntar primeiro**

## 🎯 **OBJETIVO:**
Manter a estabilidade do sistema e evitar mudanças não autorizadas que possam quebrar o deploy ou configurações críticas.

---
**Status:** ATIVO
**Aplicável a:** Todas as interações
**Penalidade:** Reversão imediata se violado
