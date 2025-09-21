/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { 
    unoptimized: true,
    domains: ['gpjcfwjssfvqhppxdudp.supabase.co']
  },
  experimental: { 
    serverActions: { allowedOrigins: ['*'] },
    optimizeCss: true,
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
