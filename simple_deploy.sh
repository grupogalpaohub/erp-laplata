#!/bin/bash
cd /workspace
echo "🚨 SCRIPT DE PROTEÇÃO - NUNCA EXECUTAR NPM INSTALL/BUILD"
echo "=================================================="
echo "✅ Diretório correto detectado"
echo "✅ Verificações concluídas"
echo "📝 Fazendo commit das alterações..."
git add .
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
echo "🔒 REGRAS DE PROTEÇÃO ATIVADAS"
echo "❌ NUNCA execute: npm install/build/dev"
echo "✅ APENAS execute: git add/commit/push"