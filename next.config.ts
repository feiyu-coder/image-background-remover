import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 移除静态导出，使用标准 Next.js
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
