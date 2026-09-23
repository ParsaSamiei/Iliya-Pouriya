import type { GalleryLightboxItem } from "@/components/site/gallery/gallery-lightbox";

export function toGalleryLightboxItem(
  row: {
    id: string;
    mediaType: "IMAGE" | "VIDEO";
    imageUrl: string | null;
    videoUrl: string | null;
  },
  locale: { alt: string; caption: string | null },
): GalleryLightboxItem {
  return {
    id: row.id,
    mediaType: row.mediaType,
    imageUrl: row.imageUrl,
    videoUrl: row.videoUrl,
    alt: locale.alt,
    caption: locale.caption,
  };
}

export function pickLocaleText(
  fa: string | null | undefined,
  en: string | null | undefined,
  locale: string,
): string | null {
  const primary = locale === "fa" ? fa : en;
  const fallback = locale === "fa" ? en : fa;
  return primary?.trim() || fallback?.trim() || null;
}
