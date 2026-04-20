import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.igdb.com",
        pathname: "/igdb/image/**",
      },
    ],
  },
  // Allow server-side imports of mongoose without bundling it
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;
