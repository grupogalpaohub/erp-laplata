/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use export for production builds
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true
    },
    distDir: 'out'
  })
}

module.exports = nextConfig