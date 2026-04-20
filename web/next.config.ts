import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "assetsio.gnwcdn.com" },
      { protocol: "https", hostname: "eu-images.contentstack.com" },
      { protocol: "https", hostname: "kotaku.com" },
      { protocol: "https", hostname: "mobilegamer.biz" },
      { protocol: "https", hostname: "esportsinsider.com" },
    ],
  },
};

export default nextConfig;
