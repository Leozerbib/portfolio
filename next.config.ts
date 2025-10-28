import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['three'],
  images: {
    unoptimized: true, // Allow local images without optimization
    qualities: [50, 75, 85, 90, 95, 100], // Configure allowed quality values
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
