/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  experimental: { 
    serverActions: { allowedOrigins: ['*'] } 
  },
  trailingSlash: false,
};
module.exports = nextConfig;
