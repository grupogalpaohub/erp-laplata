#!/bin/bash
# Script para sincronizar com GitHub (excluindo .env.local)
set -e

echo "🔄 Sincronizando com GitHub..."

# Adicionar todos os arquivos exceto .env.local
git add .
git reset .env.local

# Verificar se há mudanças para commitar
if git diff --cached --quiet; then
  echo "✅ Nenhuma mudança para commitar"
  exit 0
fi

# Commit com mensagem automática
git commit -m "feat: atualizações do sistema ERP

- Correções em pedidos de venda
- Melhorias na edição de pedidos
- Guardrails implementados
- Dependências atualizadas"

# Push para o branch atual
CURRENT_BRANCH=$(git branch --show-current)
echo "📤 Fazendo push para branch: $CURRENT_BRANCH"
git push origin $CURRENT_BRANCH

echo "✅ Sincronização concluída!"