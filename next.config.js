/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_TENANT_ID: process.env.NEXT_PUBLIC_TENANT_ID,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  reactStrictMode: true,
  images: { 
    unoptimized: true,
    domains: ['gpjcfwjssfvqhppxdudp.supabase.co']
  },
  experimental: { 
    serverActions: { allowedOrigins: ['*'] },
    // optimizeCss: true, // Desabilitado temporariamente devido a erro de critters
    optimizePackageImports: ['lucide-react', '@supabase/ssr']
  },
  trailingSlash: false,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  webpack: (config, { dev, isServer }) => {
    // Otimizações para produção
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            chunks: 'all',
          },
        },
      }
    }
    
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/supabase/**', '**/node_modules/**']
    }
    return config
  }
};
module.exports = nextConfig;
