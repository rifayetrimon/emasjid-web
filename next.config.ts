import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add this line to configure the base path
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",

  /* other config options here */
};

export default nextConfig;
