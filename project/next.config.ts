import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

function siteActionOrigins(): string[] {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) return [];
  try {
    return [new URL(raw).host];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  // Self-hosted on a Docker VPS, never targeting Vercel-only features.
  output: "standalone",
  // Keep Server Action body room for STL model uploads and other form posts.
  // Browser media uploads use /api/admin/upload (not Server Actions).
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
      // Host nginx terminates TLS and proxies to this app. Without the
      // public host here, Next can reject the people-save Server Action
      // as a CSRF mismatch (works locally, flakes in production).
      ...(siteActionOrigins().length > 0
        ? { allowedOrigins: siteActionOrigins() }
        : {}),
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
