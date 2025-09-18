/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  experimental: { serverActions: { allowedOrigins: ['*'] } },
  // NUNCA usar output:'export'
};
module.exports = nextConfig;
