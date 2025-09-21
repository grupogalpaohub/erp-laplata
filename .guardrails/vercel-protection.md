# 🛡️ GUARD RAIL - PROTEÇÃO VERCEL

## ⚠️ REGRAS OBRIGATÓRIAS

### 🚫 **NUNCA ALTERAR SEM AUTORIZAÇÃO EXPLÍCITA:**
- `vercel.json` - Configurações de deploy
- `next.config.js` - Configurações do Next.js
- Variáveis de ambiente do Vercel
- Configurações de domínio
- Configurações de branch
- Deploy hooks
- Configurações de produção/preview

### ✅ **PERMITIDO SEM AUTORIZAÇÃO:**
- Código da aplicação (app/, src/, components/)
- Estilos CSS (globals.css)
- Tipos TypeScript
- Hooks e utilitários
- Páginas e componentes React
- APIs e rotas

### 🔒 **PROCESSO DE AUTORIZAÇÃO:**
1. **SEMPRE perguntar** antes de alterar qualquer configuração
2. **Explicar o motivo** da mudança
3. **Aguardar confirmação explícita** do usuário
4. **Documentar** a mudança e o motivo

### 📋 **EXEMPLOS DE MUDANÇAS PROIBIDAS:**
```json
// ❌ NUNCA ALTERAR SEM AUTORIZAÇÃO
{
  "github": { "autoJobCancelation": true },
  "git": { "deploymentEnabled": { "erp-dev": true } }
}
```

```javascript
// ❌ NUNCA ALTERAR SEM AUTORIZAÇÃO
const nextConfig = {
  experimental: { serverActions: true },
  images: { domains: ['example.com'] }
}
```

### 🎯 **OBJETIVO:**
Manter a estabilidade do deploy e configurações do Vercel, permitindo apenas mudanças de código da aplicação.

---
**Data de Criação:** 2025-01-21
**Status:** ATIVO
**Aplicável a:** Todas as interações com o usuário
