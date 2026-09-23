import type { GalleryLightboxItem } from "@/components/site/gallery/gallery-lightbox";

export type ProjectGalleryMediaType = "IMAGE" | "VIDEO";

/** Stored shape for Project.gallery JSON (new entries). */
export type ProjectGalleryMedia = {
  mediaType: ProjectGalleryMediaType;
  imageUrl: string | null;
  videoUrl: string | null;
};

const VIDEO_EXT = /\.(mp4|webm)(\?|$)/i;

export function isVideoUrl(url: string): boolean {
  return VIDEO_EXT.test(url);
}

/** Normalize legacy string URLs and new objects into a consistent media list. */
export function normalizeProjectGallery(raw: unknown): ProjectGalleryMedia[] {
  if (!Array.isArray(raw)) return [];

  const items: ProjectGalleryMedia[] = [];

  for (const entry of raw) {
    if (typeof entry === "string" && entry.trim()) {
      const url = entry.trim();
      if (isVideoUrl(url)) {
        items.push({ mediaType: "VIDEO", imageUrl: null, videoUrl: url });
      } else {
        items.push({ mediaType: "IMAGE", imageUrl: url, videoUrl: null });
      }
      continue;
    }

    if (!entry || typeof entry !== "object") continue;
    const obj = entry as Record<string, unknown>;
    const mediaType =
      obj.mediaType === "VIDEO" || obj.mediaType === "IMAGE"
        ? obj.mediaType
        : null;
    const imageUrl =
      typeof obj.imageUrl === "string" && obj.imageUrl.trim()
        ? obj.imageUrl.trim()
        : null;
    const videoUrl =
      typeof obj.videoUrl === "string" && obj.videoUrl.trim()
        ? obj.videoUrl.trim()
        : null;

    if (mediaType === "VIDEO" && videoUrl) {
      items.push({ mediaType: "VIDEO", imageUrl, videoUrl });
    } else if (mediaType === "IMAGE" && imageUrl) {
      items.push({ mediaType: "IMAGE", imageUrl, videoUrl: null });
    } else if (videoUrl) {
      items.push({ mediaType: "VIDEO", imageUrl, videoUrl });
    } else if (imageUrl) {
      items.push({ mediaType: "IMAGE", imageUrl, videoUrl: null });
    }
  }

  return items;
}

export function projectGalleryUrls(items: ProjectGalleryMedia[]): string[] {
  const urls: string[] = [];
  for (const item of items) {
    if (item.imageUrl) urls.push(item.imageUrl);
    if (item.videoUrl) urls.push(item.videoUrl);
  }
  return urls;
}

export function toProjectLightboxItems(
  items: ProjectGalleryMedia[],
  alt: string,
): GalleryLightboxItem[] {
  return items.map((item, index) => ({
    id: `project-gallery-${index}-${item.videoUrl ?? item.imageUrl}`,
    mediaType: item.mediaType,
    imageUrl: item.imageUrl,
    videoUrl: item.videoUrl,
    alt: `${alt} — ${index + 1}`,
    caption: null,
  }));
}
