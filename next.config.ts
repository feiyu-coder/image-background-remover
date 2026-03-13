import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 需要静态导出
  output: 'export',
  
  // 禁用图片优化（Cloudflare Pages 不支持）
  images: {
    unoptimized: true,
  },
  
  // 禁用 trailing slash
  trailingSlash: true,
};

export default nextConfig;
