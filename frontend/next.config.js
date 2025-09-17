/** @type {import('next').NextConfig} */
const nextConfig = {
  // Always use export for Cloudflare Pages
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig