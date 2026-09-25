import { notFoundMetadata, SiteNotFound } from "@/components/site/not-found-view";

export const generateMetadata = notFoundMetadata;

export default async function LocaleNotFound() {
  return <SiteNotFound />;
}
