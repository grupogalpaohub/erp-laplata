#!/usr/bin/env bash
set -euo pipefail

# Garantir hooks locais
mkdir -p .githooks
git config core.hooksPath .githooks

# (Opcional) Bloquear push para erp-prod dessa máquina
cat > .githooks/pre-push <<'HOOK'
#!/usr/bin/env bash
set -euo pipefail
current_branch="$(git symbolic-ref --quiet --short HEAD || true)"
if [ "$current_branch" = "erp-prod" ]; then
  echo "❌ Push para 'erp-prod' bloqueado a partir deste host. Faça PR/merge controlado."
  exit 1
fi
exit 0
HOOK
chmod +x .githooks/pre-push

# Criar/alternar para a branch local-server
if git show-ref --verify --quiet refs/heads/local-server; then
  git checkout local-server
else
  git checkout -b local-server
fi

# Vincular ao remoto origin/local-server (se não existir no remoto, será criado no primeiro push)
set +e
git rev-parse --abbrev-ref --symbolic-full-name @{u} >/dev/null 2>&1
HAS_UPSTREAM=$?
set -e
if [ $HAS_UPSTREAM -ne 0 ]; then
  echo "ℹ️  Esta branch ainda não tem upstream no remoto. No primeiro push, use:"
  echo "    git push -u origin local-server"
fi

echo "✅ Branch 'local-server' pronta."
echo "   Use 'npm run dev' para hot-reload e 'npm run preview' para build idêntica ao Vercel."

# Dicas finais
echo
echo "📌 Lembrete:"
echo "- Se o Vercel estiver com deploy automático apenas para 'erp-dev'/'erp-prod', pushes em 'local-server' NÃO vão gerar deploy."
echo "- Configure o Supabase Auth → Additional Redirect URLs com: http://localhost:3000/auth/callback"
echo
