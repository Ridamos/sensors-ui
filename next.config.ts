import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Лаб. №6 (Docker): режим standalone складає в .next/standalone усе, що
  // потрібно для запуску командою `node server.js`, без папки node_modules.
  // Вмикається лише під час збирання образу (змінну задає Dockerfile);
  // звичайний `npm run build` на комп'ютері й на Vercel працює як раніше.
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
