#!/bin/bash

echo "🚀 Configurando Supabase para ERP Laplata..."

# Verificar se o Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI não encontrado. Instalando..."
    # Tentar instalar via diferentes métodos
    if command -v npm &> /dev/null; then
        echo "📦 Tentando instalar via npx..."
        npx supabase --version
    else
        echo "❌ NPM não encontrado. Instale o Supabase CLI manualmente:"
        echo "   https://supabase.com/docs/guides/cli/getting-started"
        exit 1
    fi
fi

echo "✅ Supabase CLI encontrado"

# Verificar se estamos no diretório correto
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Execute este script no diretório raiz do projeto"
    exit 1
fi

echo "📋 Configuração do Supabase:"
echo "   Project ID: gpjcfwjssfvqhppxdudp"
echo "   URL: https://gpjcfwjssfvqhppxdudp.supabase.co"
echo ""

# Fazer login no Supabase (se necessário)
echo "🔐 Verificando autenticação..."
if ! supabase projects list &> /dev/null; then
    echo "⚠️  Faça login no Supabase:"
    supabase login
fi

# Conectar ao projeto
echo "🔗 Conectando ao projeto..."
supabase link --project-ref gpjcfwjssfvqhppxdudp

# Aplicar migrations
echo "🗄️  Aplicando migrations..."
supabase db push

# Executar seeds
echo "🌱 Executando seeds..."
supabase db seed

# Deploy das Edge Functions
echo "⚡ Deploy das Edge Functions..."
supabase functions deploy setup-mm
supabase functions deploy po-create
supabase functions deploy so-create
supabase functions deploy kpi-refresh

echo ""
echo "✅ Configuração do Supabase concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure as variáveis de ambiente no Cloudflare Pages:"
echo "   - NEXT_PUBLIC_SUPABASE_URL=https://gpjcfwjssfvqhppxdudp.supabase.co"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
echo "   - NEXT_PUBLIC_APP_NAME=ERP Laplata"
echo ""
echo "2. Configure o Google OAuth no Supabase Dashboard"
echo "3. Deploy no Cloudflare Pages usando a branch erp-git"
echo ""
echo "🎉 Sistema pronto para uso!"