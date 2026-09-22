import { cache } from "react";
import { db } from "@/lib/db";
import {
  DEFAULT_SITE_METADATA,
  SITE_METADATA_KEY,
  parseSiteMetadata,
  resolveSiteMetadata,
  type SiteMetadataData,
  type SiteMetadataView,
} from "@/lib/site-metadata";

async function loadSiteMetadataData(): Promise<SiteMetadataData> {
  const setting = await db.siteSetting
    .findUnique({ where: { key: SITE_METADATA_KEY } })
    .catch(() => null);

  return setting?.valueEn
    ? parseSiteMetadata(setting.valueEn)
    : DEFAULT_SITE_METADATA;
}

/** Cached per-request load of bilingual site metadata (for admin / EN-facing surfaces). */
export const getSiteMetadataData = cache(loadSiteMetadataData);

/** Cached per-request load of site metadata resolved for a locale. */
export const getSiteMetadata = cache(async (locale: string): Promise<SiteMetadataView> => {
  const data = await loadSiteMetadataData();
  return resolveSiteMetadata(data, locale);
});
