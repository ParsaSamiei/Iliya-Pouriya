"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { forwardRef } from "react";
import { useReducedMotion } from "framer-motion";

type SmoothHashLinkProps = ComponentPropsWithoutRef<"a"> & {
  href: `#${string}`;
};

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function animateScrollTo(targetY: number, durationMs: number) {
  const startY = window.scrollY;
  const delta = targetY - startY;
  if (Math.abs(delta) < 1) return;

  const start = performance.now();

  const step = (now: number) => {
    const t = Math.min(1, (now - start) / durationMs);
    window.scrollTo(0, startY + delta * easeInOutCubic(t));
    if (t < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

/** Same-page hash link with eased scroll (CSS smooth is unreliable here). */
export const SmoothHashLink = forwardRef<HTMLAnchorElement, SmoothHashLinkProps>(
  function SmoothHashLink({ href, onClick, children, ...props }, ref) {
    const reduce = useReducedMotion();

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;

      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      event.preventDefault();

      const headerOffset =
        parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop || "0") || 80;
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;

      if (reduce) {
        window.scrollTo({ top, behavior: "auto" });
      } else {
        const distance = Math.abs(top - window.scrollY);
        const duration = Math.min(1100, Math.max(500, distance * 0.5));
        animateScrollTo(top, duration);
      }

      history.pushState(null, "", href);
    };

    return (
      <a ref={ref} href={href} onClick={handleClick} {...props}>
        {children}
      </a>
    );
  },
);
