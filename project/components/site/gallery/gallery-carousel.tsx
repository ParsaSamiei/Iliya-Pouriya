"use client";

import type { EmblaOptionsType } from "embla-carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Expand, type LucideIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GalleryLightbox,
  type GalleryLightboxItem,
} from "@/components/site/gallery/gallery-lightbox";
import { GalleryMediaThumb } from "@/components/site/gallery/gallery-media-thumb";
import { cn } from "@/lib/utils";

const SIZES = "(min-width: 1024px) 22vw, (min-width: 640px) 32vw, 55vw";
const DRAG_THRESHOLD_PX = 8;
const SCROLL_SPEED = 2.2;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useSlideClick(onOpen: (index: number) => void) {
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
    dragged.current = false;
  }, []);

  const onPointerMove = useCallback((event: React.PointerEvent) => {
    if (!pointerStart.current) return;
    const dx = Math.abs(event.clientX - pointerStart.current.x);
    const dy = Math.abs(event.clientY - pointerStart.current.y);
    if (dx > DRAG_THRESHOLD_PX || dy > DRAG_THRESHOLD_PX) {
      dragged.current = true;
    }
  }, []);

  const onPointerUp = useCallback(() => {
    pointerStart.current = null;
  }, []);

  const onClick = useCallback(
    (index: number) => {
      if (!dragged.current) onOpen(index);
      dragged.current = false;
    },
    [onOpen],
  );

  return { onPointerDown, onPointerMove, onPointerUp, onClick };
}

export function GalleryCarousel({ items }: { items: GalleryLightboxItem[] }) {
  const t = useTranslations("gallery.carousel");
  const tGallery = useTranslations("gallery");
  const locale = useLocale();
  const isRtl = locale === "fa";
  const reduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const slideClick = useSlideClick(setOpenIndex);
  const viewLabel = locale === "fa" ? "مشاهده" : "View";

  const hasMultipleSlides = items.length > 1;
  const canAutoScroll = hasMultipleSlides && !reduceMotion;

  const plugins = useMemo(
    () =>
      canAutoScroll
        ? [
            AutoScroll({
              speed: SCROLL_SPEED,
              startDelay: 0,
              playOnInit: true,
              stopOnMouseEnter: true,
              stopOnFocusIn: true,
              stopOnInteraction: false,
            }),
          ]
        : [],
    [canAutoScroll],
  );

  const options: EmblaOptionsType = useMemo(
    () => ({
      loop: hasMultipleSlides,
      align: "start",
      dragFree: true,
      direction: isRtl ? "rtl" : "ltr",
    }),
    [hasMultipleSlides, isRtl],
  );

  const [viewportRef, emblaApi] = useEmblaCarousel(options, plugins);

  useEffect(() => {
    if (!emblaApi) return;
    const autoScroll = emblaApi.plugins()?.autoScroll;
    if (!autoScroll) return;

    if (canAutoScroll) {
      autoScroll.play();
    } else {
      autoScroll.stop();
    }
  }, [emblaApi, canAutoScroll]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    emblaApi?.plugins()?.autoScroll?.play();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    emblaApi?.plugins()?.autoScroll?.play();
  }, [emblaApi]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const forwardKey = isRtl ? "ArrowLeft" : "ArrowRight";
    const backKey = isRtl ? "ArrowRight" : "ArrowLeft";

    if (event.key === forwardKey) {
      event.preventDefault();
      scrollNext();
    } else if (event.key === backKey) {
      event.preventDefault();
      scrollPrev();
    }
  }

  return (
    <>
      <div className="gallery-carousel relative">
        <div
          ref={viewportRef}
          role="group"
          aria-roledescription="carousel"
          aria-label={t("label")}
          className="gallery-carousel__viewport overflow-hidden rounded-[var(--radius-lg)]"
        >
          <div className="flex">
            {items.map((item, index) => (
              <div
                key={item.id}
                role="group"
                aria-roledescription={t("slide")}
                aria-label={t("status", { current: index + 1, total: items.length })}
                className="gallery-carousel__slide relative flex min-w-0 shrink-0 grow-0 basis-[52%] justify-center pe-2 sm:basis-[38%] sm:pe-3 md:basis-[32%] lg:basis-[26%]"
              >
                <button
                  type="button"
                  onPointerDown={slideClick.onPointerDown}
                  onPointerMove={slideClick.onPointerMove}
                  onPointerUp={slideClick.onPointerUp}
                  onPointerCancel={slideClick.onPointerUp}
                  onClick={() => slideClick.onClick(index)}
                  aria-label={`${tGallery("openItem")}: ${item.alt}`}
                  className="gallery-carousel__tile group relative aspect-[3/2] w-full max-w-[280px] cursor-pointer overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface-raised shadow-sm focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none sm:max-w-none"
                >
                  <GalleryMediaThumb
                    item={item}
                    sizes={SIZES}
                    priority={index === 0}
                    className="gallery-carousel__media absolute inset-0"
                    imageClassName="pointer-events-none gallery-carousel__image"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-fg/5"
                  />
                  {item.mediaType === "IMAGE" ? (
                    <span className="pointer-events-none absolute end-2 top-2 inline-flex items-center gap-1 rounded-[var(--radius-sm)] border border-border bg-bg/80 px-2 py-0.5 text-[11px] font-medium text-fg opacity-0 shadow-sm backdrop-blur-sm transition-[opacity,color,border-color,background-color,box-shadow,translate] duration-200 group-hover:translate-y-[-1px] group-hover:border-accent group-hover:bg-bg/90 group-hover:text-accent group-hover:opacity-100 group-hover:shadow-[0_4px_14px_var(--glow-soft)] group-focus-visible:translate-y-[-1px] group-focus-visible:border-accent group-focus-visible:bg-bg/90 group-focus-visible:text-accent group-focus-visible:opacity-100 group-focus-visible:shadow-[0_4px_14px_var(--glow-soft)]">
                      <Expand className="size-3" aria-hidden="true" />
                      {viewLabel}
                    </span>
                  ) : null}
                </button>
              </div>
            ))}
          </div>
        </div>

        {hasMultipleSlides && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-1 sm:px-2">
            <StepButton
              label={t("previous")}
              icon={ChevronLeft}
              onClick={scrollPrev}
              onKeyDown={handleKeyDown}
              className="start-0"
            />
            <StepButton
              label={t("next")}
              icon={ChevronRight}
              onClick={scrollNext}
              onKeyDown={handleKeyDown}
              className="end-0"
            />
          </div>
        )}
      </div>

      <GalleryLightbox items={items} openIndex={openIndex} onOpenChange={setOpenIndex} />
    </>
  );
}

function StepButton({
  label,
  icon: Icon,
  onClick,
  onKeyDown,
  className,
}: {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-label={label}
      className={cn(
        "pointer-events-auto absolute top-1/2 -translate-y-1/2",
        "ctrl-hover-glow flex size-9 items-center justify-center rounded-full border border-border bg-bg/85 text-fg backdrop-blur-sm sm:size-10",
        "cursor-pointer transition-colors duration-200 hover:border-accent hover:text-accent",
        "focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
        className,
      )}
    >
      <Icon className="size-4 rtl:-scale-x-100 sm:size-5" aria-hidden="true" />
    </button>
  );
}
