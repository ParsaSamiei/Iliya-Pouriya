import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

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
  // This app lives in `project/` under a parent git repo. Without this,
  // Turbopack walks up to ~/package-lock.json and ignores this app's lockfile.
  turbopack: {
    root: projectRoot,
  },
  images: {
    // Uploaded media is rendered with `unoptimized` (see MediaImage).
    // `/logo.png` and other public assets still use this optimizer.
    remotePatterns: [],
  },
};

export default withNextIntl(nextConfig);
