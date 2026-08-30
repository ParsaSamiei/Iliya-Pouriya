"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

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
            className="relative aspect-square overflow-hidden rounded-[var(--radius-sm)] border border-border transition-opacity hover:opacity-80"
          >
            <Image
              src={url}
              alt={`${alt} — ${index + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
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
                <Image
                  src={images[openIndex]}
                  alt={`${alt} — ${openIndex + 1}`}
                  fill
                  className="object-contain"
                  unoptimized
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
                    className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-bg/80 p-2 text-fg hover:bg-bg"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={() => setOpenIndex((i) => (i === null ? i : (i + 1) % images.length))}
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-bg/80 p-2 text-fg hover:bg-bg"
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
