import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["ourshub.pp.ua", "api.ourshub.pp.ua"],
  output: "standalone",
  ...(isDev && {
    experimental: {
      staleTimes: {
        dynamic: 0,
        static: 0,
      },
    },
    headers: async () => [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ],
  }),
};

export default nextConfig;
