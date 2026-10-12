const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000')
  .replace(/\/api\/v1\/?$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{ source: '/api/v1/:path*', destination: `${apiBase}/api/v1/:path*` }];
  },
};

module.exports = nextConfig;
