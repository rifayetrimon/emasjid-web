import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "devsec.awfatech.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "devapi02.awfatech.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
