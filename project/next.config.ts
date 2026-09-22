import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Self-hosted on a Docker VPS, never targeting Vercel-only features.
  output: "standalone",
  // Keep Server Action body room for STL model uploads and other form posts.
  // Browser media uploads use /api/admin/upload (not Server Actions).
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  images: {
    // Uploaded media is served from local disk (via the reverse proxy or /uploads route),
    // not an external image host — see docs/05_DATABASE.md and docs/09_DEVELOPMENT_GUIDELINES.md.
    remotePatterns: [],
  },
};

export default withNextIntl(nextConfig);
