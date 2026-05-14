import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/',
        destination: '/app/feed',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${process.env.CORE_URL || 'http://core:3000'}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;