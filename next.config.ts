import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com" },
      { hostname: "tong.visitkorea.or.kr" },
      { hostname: "cdn.visitkorea.or.kr" },
      { hostname: "map.naver.com" },
    ],
  },
};

export default nextConfig;
