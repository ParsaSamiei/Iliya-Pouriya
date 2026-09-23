import type { SiteMetadataData } from "@/lib/validation/site-metadata";
import { siteMetadataSchema } from "@/lib/validation/site-metadata";

export type { SiteMetadataData };

export const SITE_METADATA_KEY = "site_metadata";

export const DEFAULT_SITE_METADATA: SiteMetadataData = {
  nameEn: "Iliya & Pouriya",
  nameFa: "ایلیا و پوریا",
  taglineEn: "Robotics & embedded systems, built from first principles.",
  taglineFa: "رباتیک و سیستم‌های نهفته، ساخته‌شده از پایه.",
};

export type SiteMetadataView = {
  name: string;
  tagline: string;
};

export function parseSiteMetadata(value: unknown): SiteMetadataData {
  const result = siteMetadataSchema.safeParse(value);
  return result.success ? result.data : DEFAULT_SITE_METADATA;
}

export function resolveSiteMetadata(
  data: SiteMetadataData,
  locale: string,
): SiteMetadataView {
  const isFa = locale === "fa";
  return {
    name: isFa ? data.nameFa : data.nameEn,
    tagline: isFa ? data.taglineFa : data.taglineEn,
  };
}
