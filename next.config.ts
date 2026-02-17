import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse', 'mammoth'],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '10.6.3.20:3000'],
    },
  },
};

export default nextConfig;
