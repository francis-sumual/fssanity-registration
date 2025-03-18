import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sannity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
