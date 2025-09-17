#!/bin/bash

echo "🚀 Deploying ERP Laplata..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd frontend
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Output directory: frontend/out"
    echo ""
    echo "🌐 Deploy to Cloudflare Pages:"
    echo "1. Connect your GitHub repository to Cloudflare Pages"
    echo "2. Set build command: cd frontend && npm install && npm run build"
    echo "3. Set output directory: frontend/out"
    echo "4. Set environment variables:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL=https://gpjcfwjssfvqhppxdudp.supabase.co"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    echo "   - NEXT_PUBLIC_APP_NAME=ERP Laplata"
    echo ""
    echo "🗄️ Don't forget to:"
    echo "1. Run Supabase migrations: supabase db push"
    echo "2. Deploy Edge Functions: supabase functions deploy"
    echo "3. Run seeds: supabase db seed"
else
    echo "❌ Build failed!"
    exit 1
fi