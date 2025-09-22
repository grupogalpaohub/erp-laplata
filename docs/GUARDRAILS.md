# Guardrails de Desenvolvimento

Este documento descreve os guardrails automatizados implementados no projeto para garantir qualidade e consistência.

## 🚀 Funcionalidades

### 1. **Preflight Hierárquico**
- **A)** Validação de porta (sempre 3000 no dev)
- **B)** Validação de ambiente Supabase (quando auth habilitada)
- **C)** Teste de conectividade REST (quando aplicável)
- **D)** Validação de documentação para mudanças de schema
- **E)** Validação de sintaxe TypeScript

### 2. **Hooks Git**
- **pre-commit**: Bloqueia `.env.local` e valida arquivos críticos
- **pre-push**: Executa preflight completo antes do push

### 3. **Sincronização Automática**
- Script `npm run sync` para commit+push automático
- Exclui automaticamente `.env.local` dos commits

## 📁 Estrutura

```
scripts/guardrails/
├── preflight.js          # Validação hierárquica
└── sync-github.sh        # Sincronização automática

.githooks/
├── pre-commit            # Hook de pré-commit
└── pre-push              # Hook de pré-push

docs/
├── change-intent.sample.json  # Template para mudanças de schema
└── GUARDRAILS.md             # Esta documentação
```

## 🔧 Configuração

### Scripts NPM Disponíveis

```bash
# Desenvolvimento (sempre porta 3000)
npm run dev
npm run dev3000

# Sincronização com GitHub
npm run sync

# Verificação de ambiente
npm run env:check
```

### Arquivos Críticos

Os seguintes arquivos/padrões são considerados críticos e acionam o preflight:

- `.env.local`
- `lib/env*`, `lib/supabase*`
- `app/auth/*`
- `middleware.ts`
- `next.config.*`
- `supabase/*`
- `*_schema.sql`, `*_data.sql`
- `migrations/*`

## 📝 Mudanças de Schema

Para alterar arquivos SQL/migrations, crie `docs/change-intent.json`:

```json
{
  "reason": "Descrição clara da mudança",
  "tables": ["tabela1", "tabela2"],
  "impact": "Impacto nos outros módulos (opcional)"
}
```

## 🚫 O que é Bloqueado

1. **Commits de `.env.local`** - Sempre bloqueado
2. **Porta diferente de 3000** - No desenvolvimento
3. **Ambiente Supabase inválido** - Quando auth habilitada
4. **Erros TypeScript** - Em arquivos .ts/.tsx
5. **Mudanças de schema sem documentação** - Para arquivos críticos

## ✅ O que é Permitido

1. **Commits normais** - Sem arquivos críticos
2. **Desenvolvimento local** - Com `AUTH_DISABLED=true`
3. **Mudanças de schema documentadas** - Com `change-intent.json`
4. **Arquivos TypeScript válidos** - Sem erros de sintaxe

## 🔍 Logs

O preflight fornece logs informativos:

```
🚀 [GUARDRAIL] Iniciando preflight para 5 arquivos...
⚠️  [GUARDRAIL] Arquivos críticos detectados: lib/env.ts, middleware.ts
🔍 [GUARDRAIL] Verificando porta e SITE_URL...
🔍 [GUARDRAIL] Verificando configuração de autenticação...
✅ [GUARDRAIL] Preflight OK.
```

## 🛠️ Troubleshooting

### Erro: "Porta deve ser 3000"
- Verifique se `PORT=3000` no `.env.local`
- Use `npm run dev` (força porta 3000)

### Erro: "SUPABASE_URL/ANON ausentes"
- Configure as variáveis no `.env.local`
- Ou use `NEXT_PUBLIC_AUTH_DISABLED=true` para bypass

### Erro: "change-intent.json ausente"
- Crie `docs/change-intent.json` para mudanças de schema
- Use `docs/change-intent.sample.json` como template

### Erro: "TypeScript errors"
- Corrija os erros de sintaxe TypeScript
- Use `npx tsc --noEmit` para verificar localmente
