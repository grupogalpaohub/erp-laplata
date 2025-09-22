#!/usr/bin/env bash
set -euo pipefail

# Mensagem de commit opcional ($1). Se vazio, usa padrão com timestamp.
MSG="${1:-chore(sync): auto-sync by Cursor @ $(date -u +'%Y-%m-%dT%H:%M:%SZ')}"

echo "🚀 [SYNC] Iniciando sincronização com GitHub..."

# Garante que .env.local não será incluido
git reset --quiet
git add -A
git reset .env.local 2>/dev/null || true

# Se não há mudanças, sai silencioso
if git diff --cached --quiet; then
  echo "ℹ️  [SYNC] Nada para commitar/push."
  exit 0
fi

# Branch alvo: use a atual; se for 'HEAD' (detached) cai p/ 'local-server'
CUR_BRANCH=$(git rev-parse --abbrev-ref HEAD || echo "HEAD")
if [ "$CUR_BRANCH" = "HEAD" ]; then
  CUR_BRANCH="local-server"
  git checkout -B "$CUR_BRANCH"
fi

echo "📝 [SYNC] Branch atual: $CUR_BRANCH"

# Garante remote 'origin'
git remote get-url origin >/dev/null 2>&1 || {
  echo "❌ [SYNC] Remote 'origin' não configurado."
  exit 2
}

# Commit + push
echo "💾 [SYNC] Fazendo commit: $MSG"
git commit -m "$MSG"

# Seta upstream se necessário
if ! git rev-parse --abbrev-ref --symbolic-full-name @{u} >/dev/null 2>&1; then
  echo "🔗 [SYNC] Configurando upstream para origin/$CUR_BRANCH"
  git push -u origin "$CUR_BRANCH"
else
  echo "⬆️  [SYNC] Fazendo push para origin/$CUR_BRANCH"
  git push
fi

echo "✅ [SYNC] Sincronizado com origin/$CUR_BRANCH"
