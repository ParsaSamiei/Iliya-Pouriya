"use client";

import type { EmblaOptionsType } from "embla-carousel";
import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { MediaImage } from "@/components/media-image";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type ClientsCarouselItem = {
  id: string;
  name: string;
  note: string | null;
  logoUrl: string | null;
  url: string | null;
};

const DRAG_THRESHOLD_PX = 8;
const SCROLL_SPEED = 1.6;
/**
 * Embla silently falls back to `loop: false` unless slide content is wider
 * than the viewport. Fixed-width tiles need enough copies to unlock looping.
 */
const MIN_LOOP_SLIDES = 20;

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

type LoopSlide = ClientsCarouselItem & {
  key: string;
  sourceIndex: number;
};

/** Repeat the roster until there is enough content for seamless infinite scroll. */
function buildLoopSlides(items: ClientsCarouselItem[], minSlides: number): LoopSlide[] {
  if (items.length === 0) return [];
  if (items.length === 1) {
    return [{ ...items[0], key: items[0].id, sourceIndex: 0 }];
  }

  const repeats = Math.max(2, Math.ceil(minSlides / items.length));
  const out: LoopSlide[] = [];
  for (let r = 0; r < repeats; r++) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      out.push({
        ...item,
        key: `${item.id}-${r}`,
        sourceIndex: i,
      });
    }
  }
  return out;
}

function useDragGuard() {
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

  const wasDragged = useCallback(() => {
    const result = dragged.current;
    dragged.current = false;
    return result;
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp, wasDragged };
}

function ClientTile({
  item,
  dragGuard,
}: {
  item: ClientsCarouselItem;
  dragGuard: ReturnType<typeof useDragGuard>;
}) {
  const t = useTranslations("clients.carousel");

  const body = (
    <>
      <div className="client-tile__media">
        {item.logoUrl ? (
          <MediaImage
            src={item.logoUrl}
            alt=""
            width={160}
            height={56}
            className="client-tile__logo"
            draggable={false}
          />
        ) : (
          <span aria-hidden className="client-tile__mark">
            {item.name.slice(0, 1)}
          </span>
        )}
      </div>
      <p className="client-tile__name">{item.name}</p>
      <p className="client-tile__note">{item.note ?? "\u00a0"}</p>
    </>
  );

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${item.name} (${t("opensInNewTab")})`}
        className="client-tile"
        onPointerDown={dragGuard.onPointerDown}
        onPointerMove={dragGuard.onPointerMove}
        onPointerUp={dragGuard.onPointerUp}
        onPointerCancel={dragGuard.onPointerUp}
        onClick={(event) => {
          if (dragGuard.wasDragged()) event.preventDefault();
        }}
      >
        {body}
      </a>
    );
  }

  return (
    <div className="client-tile" aria-label={item.name}>
      {body}
    </div>
  );
}

export function ClientsCarousel({ items }: { items: ClientsCarouselItem[] }) {
  const t = useTranslations("clients.carousel");
  const locale = useLocale();
  const isRtl = locale === "fa";
  const reduceMotion = useReducedMotion();
  const dragGuard = useDragGuard();
  const [minSlides, setMinSlides] = useState(MIN_LOOP_SLIDES);

  const hasMultipleSlides = items.length > 1;
  const canAutoScroll = hasMultipleSlides && !reduceMotion;
  const slides = useMemo(
    () => buildLoopSlides(items, hasMultipleSlides ? minSlides : 1),
    [items, hasMultipleSlides, minSlides],
  );

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
      containScroll: false,
      direction: isRtl ? "rtl" : "ltr",
    }),
    [hasMultipleSlides, isRtl],
  );

  const [viewportRef, emblaApi] = useEmblaCarousel(options, plugins);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
  }, [emblaApi, slides.length]);

  // Grow the slide list until Embla confirms looping is possible.
  useEffect(() => {
    if (!emblaApi || !hasMultipleSlides) return;

    const ensureLoop = () => {
      if (emblaApi.internalEngine().slideLooper.canLoop()) return;

      setMinSlides((current) => {
        const next = current + Math.max(items.length, 4);
        const cap = Math.max(MIN_LOOP_SLIDES, items.length * 10);
        return next > cap ? current : next;
      });
    };

    // After reInit from slides.length, measure on the next frame.
    const frame = window.requestAnimationFrame(ensureLoop);
    emblaApi.on("resize", ensureLoop);
    return () => {
      window.cancelAnimationFrame(frame);
      emblaApi.off("resize", ensureLoop);
    };
  }, [emblaApi, hasMultipleSlides, items.length, slides.length]);

  useEffect(() => {
    if (!emblaApi) return;
    const autoScroll = emblaApi.plugins()?.autoScroll;
    if (!autoScroll) return;

    if (canAutoScroll) {
      autoScroll.play();
    } else {
      autoScroll.stop();
    }
  }, [emblaApi, canAutoScroll, slides.length]);

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
    <div className="clients-marquee relative">
      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={t("label")}
        className="clients-marquee__viewport"
      >
        <div className="clients-marquee__track">
          {slides.map((slide) => (
            <div
              key={slide.key}
              role="group"
              aria-roledescription={t("slide")}
              aria-label={t("status", {
                current: slide.sourceIndex + 1,
                total: items.length,
              })}
              className="clients-marquee__slide"
            >
              <ClientTile item={slide} dragGuard={dragGuard} />
            </div>
          ))}
        </div>
      </div>

      {hasMultipleSlides ? (
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
      ) : null}
    </div>
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
