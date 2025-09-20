/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  experimental: { 
    serverActions: { allowedOrigins: ['*'] } 
  },
  trailingSlash: false,
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/supabase/**', '**/node_modules/**']
    }
    return config
  }
};
module.exports = nextConfig;
