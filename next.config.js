/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // DEBUG: process.env.DEBUG,
  },
  experimental: {
    instrumentationHook: false,
  },
  async rewrites() {
    return [
      {
        source: '/:slug(coding|games|bbq|gardening)',
        destination: '/category/:slug',
      },
    ]
  },
}

module.exports = nextConfig
