import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "assetsio.gnwcdn.com" },
      { protocol: "https", hostname: "eu-images.contentstack.com" },
      { protocol: "https", hostname: "kotaku.com" },
      { protocol: "https", hostname: "mobilegamer.biz" },
      { protocol: "https", hostname: "esportsinsider.com" },
      { protocol: "https", hostname: "www.videogameschronicle.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
    ],
  },
};

export default nextConfig;
