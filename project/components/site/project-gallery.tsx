"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function GalleryImage({
  src,
  alt,
  className,
  objectFit = "cover",
}: {
  src: string;
  alt: string;
  className?: string;
  objectFit?: "cover" | "contain";
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        onLoad={() => setLoaded(true)}
        className={cn(
          objectFit === "contain" ? "object-contain" : "object-cover",
          "transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </>
  );
}

export function ProjectGallery({ images, alt }: { images: string[]; alt: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {images.map((url, index) => (
          <button
            key={url}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="relative aspect-square cursor-pointer overflow-hidden rounded-[var(--radius-sm)] border border-border transition-opacity hover:opacity-80"
          >
            <GalleryImage src={url} alt={`${alt} — ${index + 1}`} />
          </button>
        ))}
      </div>

      <Dialog open={openIndex !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <DialogContent className="max-w-3xl border-0 bg-transparent p-0 shadow-none">
          {/* Dialog requires an accessible title; visually hidden since the image itself is the content. */}
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          {openIndex !== null && (
            <div className="relative">
              <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-lg)] bg-surface">
                <GalleryImage
                  key={images[openIndex]}
                  src={images[openIndex]}
                  alt={`${alt} — ${openIndex + 1}`}
                  objectFit="contain"
                />
              </div>
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={() =>
                      setOpenIndex((i) =>
                        i === null ? i : (i - 1 + images.length) % images.length,
                      )
                    }
                    className="absolute top-1/2 left-2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-bg/80 p-2 text-fg hover:bg-bg"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() => setOpenIndex((i) => (i === null ? i : (i + 1) % images.length))}
                    className="absolute top-1/2 right-2 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-bg/80 p-2 text-fg hover:bg-bg"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
