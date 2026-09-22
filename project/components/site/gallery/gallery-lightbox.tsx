"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { GalleryVideoPlayer } from "@/components/site/gallery/gallery-video-player";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface GalleryLightboxItem {
  id: string;
  mediaType: "IMAGE" | "VIDEO";
  imageUrl: string | null;
  videoUrl: string | null;
  alt: string;
  caption: string | null;
}

interface GalleryLightboxProps {
  items: GalleryLightboxItem[];
  openIndex: number | null;
  onOpenChange: (index: number | null) => void;
}

export function GalleryLightbox({ items, openIndex, onOpenChange }: GalleryLightboxProps) {
  const t = useTranslations("gallery.lightbox");
  const locale = useLocale();
  const isRtl = locale === "fa";
  const open = openIndex !== null;
  const currentIndex = openIndex ?? 0;
  const current = items[currentIndex];
  const hasMultiple = items.length > 1;

  const goPrev = useCallback(() => {
    if (openIndex === null) return;
    onOpenChange(openIndex === 0 ? items.length - 1 : openIndex - 1);
  }, [openIndex, items.length, onOpenChange]);

  const goNext = useCallback(() => {
    if (openIndex === null) return;
    onOpenChange(openIndex === items.length - 1 ? 0 : openIndex + 1);
  }, [openIndex, items.length, onOpenChange]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      const forwardKey = isRtl ? "ArrowLeft" : "ArrowRight";
      const backKey = isRtl ? "ArrowRight" : "ArrowLeft";

      if (event.key === forwardKey) {
        event.preventDefault();
        goNext();
      } else if (event.key === backKey) {
        event.preventDefault();
        goPrev();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, isRtl, goNext, goPrev]);

  if (!current) return null;

  const isVideo = current.mediaType === "VIDEO" && current.videoUrl;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onOpenChange(null)}>
      <DialogContent
        hideClose
        className="max-w-5xl border-none bg-transparent p-0 shadow-none sm:max-w-5xl"
        aria-describedby={current.caption ? "gallery-lightbox-caption" : undefined}
      >
        <DialogTitle className="sr-only">{current.alt}</DialogTitle>
        {current.caption ? (
          <DialogDescription id="gallery-lightbox-caption" className="sr-only">
            {current.caption}
          </DialogDescription>
        ) : null}

        <div className="relative flex flex-col gap-3">
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg",
              isVideo ? "aspect-video" : "aspect-[4/3] sm:aspect-[16/10]",
            )}
          >
            {isVideo ? (
              <GalleryVideoPlayer
                key={current.id}
                src={current.videoUrl!}
                poster={current.imageUrl}
                title={current.alt}
                active={open}
              />
            ) : current.imageUrl ? (
              <Image
                src={current.imageUrl}
                alt={current.alt}
                fill
                unoptimized
                className="object-contain"
                sizes="(min-width: 1024px) 80vw, 100vw"
                priority
              />
            ) : null}

            <button
              type="button"
              onClick={() => onOpenChange(null)}
              aria-label={t("close")}
              className="absolute end-3 top-3 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full border border-border bg-bg/85 text-fg backdrop-blur-sm transition-colors hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            {hasMultiple && (
              <>
                <NavButton label={t("previous")} icon={ChevronLeft} onClick={goPrev} className="start-3" />
                <NavButton label={t("next")} icon={ChevronRight} onClick={goNext} className="end-3" />
              </>
            )}
          </div>

          <div className="flex items-end justify-between gap-4 px-1">
            {current.caption ? (
              <p className="text-sm leading-relaxed text-fg sm:text-base">{current.caption}</p>
            ) : (
              <span />
            )}
            {hasMultiple && (
              <p className="shrink-0 font-mono text-sm text-fg-muted tabular-nums">
                {t("status", { current: currentIndex + 1, total: items.length })}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NavButton({
  label,
  icon: Icon,
  onClick,
  className,
}: {
  label: string;
  icon: typeof ChevronLeft;
  onClick: () => void;
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "absolute top-1/2 z-10 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-bg/85 text-fg backdrop-blur-sm transition-colors hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none sm:size-10",
        className,
      )}
    >
      <Icon className="size-4 rtl:-scale-x-100 sm:size-5" aria-hidden="true" />
    </button>
  );
}
