#!/bin/bash

# Deploy script for ERP Laplata to Cloudflare Pages
set -e

echo "🚀 Deploying ERP Laplata to Cloudflare Pages..."

# Build the frontend
echo "📦 Building frontend..."
cd frontend
npm ci
npm run build
cd ..

# Deploy to Cloudflare Pages
echo "🌐 Deploying to Cloudflare Pages..."
npx wrangler pages deploy frontend/out \
  --project-name=erp-laplata \
  --branch=erp-git \
  --commit-dirty=true

echo "✅ Deployment completed!"
echo "🌍 Your app should be available at: https://erp-laplata.pages.dev"