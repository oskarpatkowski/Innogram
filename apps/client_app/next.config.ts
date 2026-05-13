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
};

export default nextConfig;