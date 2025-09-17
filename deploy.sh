#!/bin/bash

# ERP La Plata Deploy Script
echo "🚀 Starting ERP La Plata deployment..."

# 1. Deploy Supabase migrations and functions
echo "📦 Deploying to Supabase..."
cd supabase

# Push migrations
echo "  - Pushing migrations..."
npx supabase db push

# Deploy functions
echo "  - Deploying Edge Functions..."
npx supabase functions deploy

# Run seeds
echo "  - Running seeds..."
npx supabase db reset --linked --no-seed

# Execute customizing seeds
echo "  - Loading customizing data..."
npx supabase db reset --linked --no-seed

cd ..

# 2. Build frontend
echo "🏗️ Building frontend..."
cd frontend
npm install
npm run build
cd ..

# 3. Deploy to Cloudflare Pages
echo "☁️ Deploying to Cloudflare Pages..."
npx wrangler pages deploy frontend/out --project-name=erp-laplata

echo "✅ Deployment completed!"
echo ""
echo "🔗 Access your ERP at: https://erp-laplata.pages.dev"
echo "📊 Supabase Dashboard: https://supabase.com/dashboard/project/gpjcfwjssfvqhppxdudp"
echo ""
echo "📋 Next steps:"
echo "1. Configure Google OAuth in Supabase Dashboard"
echo "2. Set environment variables in Cloudflare Pages"
echo "3. Run bootstrap-initial-load function to load data"