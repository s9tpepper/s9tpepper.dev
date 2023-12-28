/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // DEBUG: process.env.DEBUG,
  },
  experimental: {
    instrumentationHook: false,
  },
}

module.exports = nextConfig
