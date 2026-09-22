"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FocusEvent,
} from "react";
import { cn } from "@/lib/utils";

export type ClientsCarouselItem = {
  id: string;
  name: string;
  note: string | null;
  logoUrl: string | null;
  url: string | null;
};

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

/** Repeat the roster so one half is wide enough for a seamless -50% loop. */
function buildGroup(items: ClientsCarouselItem[], minSlots: number) {
  if (items.length === 0) return [];
  const repeats = Math.max(1, Math.ceil(minSlots / items.length));
  const out: Array<ClientsCarouselItem & { key: string; primary: boolean }> = [];
  for (let r = 0; r < repeats; r++) {
    for (const item of items) {
      out.push({ ...item, key: `${item.id}-${r}`, primary: r === 0 });
    }
  }
  return out;
}

function ClientTile({
  item,
  interactive,
}: {
  item: ClientsCarouselItem;
  interactive: boolean;
}) {
  const t = useTranslations("clients.carousel");

  const body = (
    <>
      <div className="client-tile__media">
        {item.logoUrl ? (
          <Image
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

  if (item.url && interactive) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${item.name} (${t("opensInNewTab")})`}
        className="client-tile"
      >
        {body}
      </a>
    );
  }

  return (
    <div
      className="client-tile"
      aria-label={interactive ? item.name : undefined}
    >
      {body}
    </div>
  );
}

export function ClientsCarousel({ items }: { items: ClientsCarouselItem[] }) {
  const t = useTranslations("clients.carousel");
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  const canLoop = items.length > 0 && !reduceMotion;
  const groupItems = useMemo(() => buildGroup(items, 8), [items]);
  const durationSec = Math.max(24, groupItems.length * 4);

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    setPaused(false);
  }

  return (
    <div
      className={cn("clients-marquee", paused && "clients-marquee--paused")}
      dir="rtl"
      role="region"
      aria-roledescription="carousel"
      aria-label={t("label")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={handleBlur}
    >
      <div className="clients-marquee__viewport">
        <div
          className={cn(
            "clients-marquee__track",
            canLoop && "clients-marquee__track--running",
          )}
          style={
            canLoop
              ? ({ "--clients-marquee-duration": `${durationSec}s` } as CSSProperties)
              : undefined
          }
        >
          <div className="clients-marquee__group">
            {groupItems.map((item, index) => (
              <div
                key={`a-${item.key}`}
                className="clients-marquee__slide"
                aria-label={
                  item.primary
                    ? t("status", {
                        current: (index % items.length) + 1,
                        total: items.length,
                      })
                    : undefined
                }
                aria-hidden={item.primary ? undefined : true}
              >
                <ClientTile item={item} interactive={item.primary} />
              </div>
            ))}
          </div>

          {canLoop ? (
            <div className="clients-marquee__group" aria-hidden="true">
              {groupItems.map((item) => (
                <div key={`b-${item.key}`} className="clients-marquee__slide">
                  <ClientTile item={item} interactive={false} />
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
