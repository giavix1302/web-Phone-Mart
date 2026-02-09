import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      // Thêm các domain khác nếu cần
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
