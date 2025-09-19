/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  experimental: { serverActions: { allowedOrigins: ['*'] } },
};
module.exports = nextConfig;
