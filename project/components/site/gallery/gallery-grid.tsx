"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import {
  GalleryLightbox,
  type GalleryLightboxItem,
} from "@/components/site/gallery/gallery-lightbox";
import { GalleryMediaThumb } from "@/components/site/gallery/gallery-media-thumb";
import { cn } from "@/lib/utils";

interface GalleryGridProps {
  items: GalleryLightboxItem[];
  openLabel: string;
}

export function GalleryGrid({ items, openLabel }: GalleryGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const locale = useLocale();
  const t = useTranslations("gallery");
  const viewLabel = locale === "fa" ? "مشاهده" : "View";

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`${openLabel}: ${item.alt}`}
            className="group relative cursor-pointer overflow-hidden rounded-[var(--radius-md)] border border-border text-start transition-colors hover:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            <GalleryMediaThumb
              item={item}
              className="aspect-[4/3]"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
            <div
              aria-hidden="true"
              className={cn(
                "absolute inset-0 bg-bg/0 transition duration-300",
                "group-hover:bg-bg/20 group-focus-visible:bg-bg/20",
              )}
            />
            {item.mediaType === "IMAGE" ? (
              <span className="pointer-events-none absolute end-2.5 top-2.5 rounded-[var(--radius-sm)] border border-border bg-bg/80 px-2 py-0.5 text-[11px] font-medium text-fg opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {viewLabel}
              </span>
            ) : null}
            {item.caption && (
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-bg/95 via-bg/70 to-transparent px-3.5 pt-8 pb-3 transition duration-300 motion-safe:group-hover:translate-y-0 motion-safe:group-focus-visible:translate-y-0"
              >
                <p className="line-clamp-2 text-sm text-fg">{item.caption}</p>
              </div>
            )}
            <span className="sr-only">{t("openItem")}</span>
          </button>
        ))}
      </div>

      <GalleryLightbox items={items} openIndex={openIndex} onOpenChange={setOpenIndex} />
    </>
  );
}
