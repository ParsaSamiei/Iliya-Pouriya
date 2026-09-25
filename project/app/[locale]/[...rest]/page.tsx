import { notFoundMetadata, SiteNotFound } from "@/components/site/not-found-view";

export const generateMetadata = notFoundMetadata;

/**
 * Next.js 16 treats notFound() from a catch-all as an HTTP error fallback
 * (`__next_error__`) instead of `[locale]/not-found.tsx`. Render the 404 UI
 * here so unknown public URLs keep the site chrome.
 */
export default async function CatchAllPage() {
  return <SiteNotFound />;
}
