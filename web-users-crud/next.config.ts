import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["localhost:8000", "s3proxy.cdn-zlib.sk"],
  },
};

export default nextConfig;
