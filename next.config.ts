import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'https://ai-recruitment-app-sigma.vercel.app/:path*',
      },
    ];
  },
};

export default nextConfig;