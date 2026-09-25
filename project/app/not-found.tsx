import { notFoundMetadata, SiteNotFound } from "@/components/site/not-found-view";

export const generateMetadata = notFoundMetadata;

/**
 * Parent fallback when a segment calls notFound() outside `[locale]`.
 * Unknown public URLs are handled by `[locale]/[...rest]`.
 */
export default async function RootNotFound() {
  return <SiteNotFound />;
}
