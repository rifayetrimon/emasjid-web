import type { NextConfig } from "next";

const nextConfig = {
  standalone: true,
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
