import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prohausen.cl",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "prohausen.s3.us-east-2.amazonaws.com",
        pathname: "/properties/**",
      },
    ],
  },
};

export default nextConfig;
