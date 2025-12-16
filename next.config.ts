import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**", // 允许该域名下的所有路径
      },
      // 如果你还有 supabase 的图片，把这个也加上
      {
        protocol: "https",
        hostname: "kyospzzlanrfhfckiquu.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
  // Enable compression for better performance
  compress: true,
  // Generate sitemap and robots.txt
  trailingSlash: false,
  // SEO headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
