import type { NextConfig } from "next";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_FRONTEND_VERSION: pkg.version,
  },
  rewrites: async () => [
    {
      source: "/api/:path*",
      destination: "http://localhost:8000/api/:path*",
    },
    {
      source: "/ws/:path*",
      destination: "http://localhost:8000/ws/:path*",
    },
  ],
};

export default nextConfig;
