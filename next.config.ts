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
    ],
  },
};

export default nextConfig;
