import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prohausen.cl",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
