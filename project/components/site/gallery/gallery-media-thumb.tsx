"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { GalleryLightboxItem } from "@/components/site/gallery/gallery-lightbox";

interface GalleryMediaThumbProps {
  item: GalleryLightboxItem;
  sizes: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
}

export function GalleryMediaThumb({
  item,
  sizes,
  priority,
  className,
  imageClassName,
}: GalleryMediaThumbProps) {
  const t = useTranslations("gallery");
  const isVideo = item.mediaType === "VIDEO";

  return (
    <div className={cn("relative overflow-hidden bg-surface-raised", className)}>
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt=""
          fill
          priority={priority}
          unoptimized
          className={cn("object-cover", imageClassName)}
          sizes={sizes}
        />
      ) : item.videoUrl ? (
        <video
          src={item.videoUrl}
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          className={cn("absolute inset-0 size-full object-cover", imageClassName)}
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-surface via-bg to-surface-raised"
        />
      )}

      {isVideo && (
        <>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-bg/30" />
          <span
            aria-hidden="true"
            className="absolute start-2.5 top-2.5 rounded-[var(--radius-sm)] bg-accent px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-accent-fg uppercase"
          >
            {t("videoBadge")}
          </span>
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-accent-fg shadow-[0_0_24px_var(--glow-accent)] transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 sm:size-12"
          >
            <Play className="size-5 fill-current sm:size-5" />
          </span>
        </>
      )}
    </div>
  );
}
