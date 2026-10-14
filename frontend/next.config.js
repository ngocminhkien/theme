/** @type {import('next').NextConfig} */
// Accept both the documented API root (http://localhost:4000/api/v1) and an
// origin-only value without duplicating the version prefix in rewrites.
const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000')
  .replace(/\/api\/v1\/?$/, '');

const nextConfig = {
  compress: true,
  devIndicators: false,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiBase}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
