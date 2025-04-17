import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/books",
        permanent: true,
      },
    ];
  }
};

export default nextConfig;
