#!/usr/bin/env bash
set -euo pipefail
MSG="${1:-chore(sync): auto-sync @ $(date -u +'%Y-%m-%dT%H:%M:%SZ')}"
git reset --quiet
git add -A
# nunca versionar env/vercel
git reset .env .env.* 2>/dev/null || true
git reset .vercel 2>/dev/null || true
git reset vercel.json 2>/dev/null || true
if git diff --cached --quiet; then
  echo "ℹ️  Nada para commitar/push."; exit 0
fi
CUR_BRANCH=$(git rev-parse --abbrev-ref HEAD || echo "HEAD")
if [ "$CUR_BRANCH" = "HEAD" ]; then git checkout -B local-server; CUR_BRANCH="local-server"; fi
git remote get-url origin >/dev/null 2>&1 || { echo "❌ Remote 'origin' não configurado."; exit 2; }
# enforcement antes do commit
node scripts/guardrails/enforce.mjs --mode=push
git commit -m "$MSG"
if ! git rev-parse --abbrev-ref --symbolic-full-name @{u} >/dev/null 2>&1; then
  git push -u origin "$CUR_BRANCH"
else
  git push
fi
echo "✅ Sincronizado com origin/$CUR_BRANCH"