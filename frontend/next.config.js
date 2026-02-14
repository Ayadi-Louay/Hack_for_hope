/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mode standalone pour Docker
  output: 'standalone',
  
  // Variables d'environnement publiques
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },
}

module.exports = nextConfig
