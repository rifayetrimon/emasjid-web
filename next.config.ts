import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "devsec.awfatech.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
