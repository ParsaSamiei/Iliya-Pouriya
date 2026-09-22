"use client";

import { useTranslations } from "next-intl";
import { GalleryGrid } from "@/components/site/gallery/gallery-grid";
import {
  normalizeProjectGallery,
  toProjectLightboxItems,
} from "@/lib/project-gallery";

export function ProjectGallery({
  gallery,
  alt,
}: {
  gallery: unknown;
  alt: string;
}) {
  const t = useTranslations("gallery");
  const items = toProjectLightboxItems(normalizeProjectGallery(gallery), alt);

  if (items.length === 0) return null;

  return <GalleryGrid items={items} openLabel={t("openItem")} />;
}
