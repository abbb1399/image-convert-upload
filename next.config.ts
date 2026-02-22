import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  outputFileTracingIncludes: {
    "/api/convert": ["./node_modules/ffmpeg-static/**"],
  },
  serverExternalPackages: ["fluent-ffmpeg", "ffmpeg-static"],
};

export default nextConfig;
