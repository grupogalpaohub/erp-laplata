#!/usr/bin/env bash
set -euo pipefail

echo "🚨 SCRIPT DE PROTEÇÃO - NUNCA EXECUTAR NPM INSTALL/BUILD"
echo "=================================================="

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ ERRO: package.json não encontrado. Execute no diretório raiz/"
    exit 1
fi

echo "✅ Diretório correto detectado"

# Verificar se node_modules existe
if [ ! -d "frontend/node_modules" ]; then
    echo "❌ ERRO: node_modules não existe. Execute npm install MANUALMENTE primeiro!"
    echo "   cd frontend && npm install"
    exit 1
fi

echo "✅ node_modules existe"

# Verificar se .next existe (build anterior)
if [ ! -d "frontend/.next" ]; then
    echo "⚠️  AVISO: .next não existe. Build pode ser necessário"
    echo "   Execute: npm run build (MANUALMENTE se necessário)"
fi

echo "✅ Verificações concluídas"

# Fazer apenas commit das alterações de código
echo "📝 Fazendo commit das alterações..."
git add .

# Verificar se há alterações
if git diff --cached --quiet; then
    echo "ℹ️  Nenhuma alteração para commit"
else
    echo "📦 Commitando alterações..."
    git commit -m "Fix: Use real database data - centralized options utility

- Created /frontend/src/lib/db/options.ts with centralized functions
- Fixed material form to use real DB data instead of hardcoded values  
- Added PO form with dynamic vendor/material selection
- Added SO form with dynamic customer/material selection
- All forms now use real Supabase data, no more hardcoded values
- Follows CURSOR RULES strictly - zero mock data"
    
    echo "🚀 Fazendo push para GitHub..."
    git push origin erp-git
    
    echo "✅ SUCESSO: Alterações enviadas para GitHub!"
fi

echo ""
echo "🔒 REGRAS DE PROTEÇÃO ATIVADAS:"
echo "❌ NUNCA execute: npm install"
echo "❌ NUNCA execute: npm run build" 
echo "❌ NUNCA execute: npm run dev"
echo "❌ NUNCA execute: yarn install"
echo "❌ NUNCA execute: pnpm install"
echo ""
echo "✅ APENAS execute:"
echo "✅ - Editar arquivos de código"
echo "✅ - git add ."
echo "✅ - git commit -m 'mensagem'"
echo "✅ - git push origin erp-git"
echo ""
echo "🎯 FOCO: Apenas commits de código, SEM instalações!"
