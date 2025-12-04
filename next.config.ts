/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // For Docker deployment

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "devsec.awfatech.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "devaws04.awfatech.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
