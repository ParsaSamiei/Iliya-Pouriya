"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SmoothHashLink } from "@/components/site/smooth-hash-link";

type HomeHeroMotionProps = {
  logo: ReactNode;
  nameA: ReactNode;
  nameB: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
  actions: ReactNode;
};

/** Even pacing — avoids the “snap then linger” of aggressive ease-outs. */
const easeHero = [0.33, 0.0, 0.2, 1] as const;

/**
 * Orchestrated hero entrance — signature is the duo lockup meeting at the seam.
 * Starts after a short beat so the rest state is visible, then unfolds slowly.
 */
export function HomeHeroMotion({
  logo,
  nameA,
  nameB,
  title,
  subtitle,
  actions,
}: HomeHeroMotionProps) {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduce) return;
    // Hold the rest pose briefly so the entrance can be perceived.
    const id = window.setTimeout(() => setReady(true), 220);
    return () => window.clearTimeout(id);
  }, [reduce]);

  const enter = Boolean(reduce) || ready;

  return (
    <div className="grid w-full items-center gap-12 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16 xl:gap-20">
      <motion.div
        className="justify-self-start"
        initial={false}
        animate={
          enter
            ? { opacity: 1, scale: 1, rotate: 0 }
            : { opacity: 0, scale: 0.88, rotate: -6 }
        }
        transition={{ duration: reduce ? 0 : 1.05, ease: easeHero }}
      >
        {logo}
      </motion.div>

      <div className="flex min-w-0 flex-col">
        {/* Duo lockup — names meet at the brand seam */}
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6">
          <motion.div
            initial={false}
            animate={
              enter
                ? { opacity: 1, x: 0, y: 0 }
                : { opacity: 0, x: -36, y: 16 }
            }
            transition={{
              duration: reduce ? 0 : 1.0,
              delay: enter && !reduce ? 0.35 : 0,
              ease: easeHero,
            }}
          >
            {nameA}
          </motion.div>

          <motion.span
            className="hero-seam"
            aria-hidden
            initial={false}
            animate={
              enter
                ? { opacity: 1, scaleY: 1 }
                : { opacity: 0, scaleY: 0.2 }
            }
            style={{ transformOrigin: "center center" }}
            transition={{
              duration: reduce ? 0 : 0.9,
              delay: enter && !reduce ? 0.7 : 0,
              ease: easeHero,
            }}
          />

          <motion.div
            initial={false}
            animate={
              enter
                ? { opacity: 1, x: 0, y: 0 }
                : { opacity: 0, x: 36, y: 16 }
            }
            transition={{
              duration: reduce ? 0 : 1.0,
              delay: enter && !reduce ? 0.5 : 0,
              ease: easeHero,
            }}
          >
            {nameB}
          </motion.div>
        </div>

        <HeroCopy enter={enter} reduce={Boolean(reduce)} delay={0.95} y={28} className="mt-7 sm:mt-9">
          {title}
        </HeroCopy>
        <HeroCopy enter={enter} reduce={Boolean(reduce)} delay={1.2} y={22} className="mt-4">
          {subtitle}
        </HeroCopy>
        <HeroCopy enter={enter} reduce={Boolean(reduce)} delay={1.45} y={18} className="mt-9">
          {actions}
        </HeroCopy>
      </div>
    </div>
  );
}

function HeroCopy({
  children,
  enter,
  reduce,
  delay,
  y,
  className,
}: {
  children: ReactNode;
  enter: boolean;
  reduce: boolean;
  delay: number;
  y: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={false}
      animate={enter ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration: reduce ? 0 : 0.9,
        delay: enter && !reduce ? delay : 0,
        ease: easeHero,
      }}
    >
      {children}
    </motion.div>
  );
}

/** Scroll-to-next control at the bottom of the hero. */
export function HomeHeroScrollCue({
  href = "#projects",
  label,
}: {
  href?: `#${string}`;
  label: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="hero-scroll-cue"
      initial={reduce ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.85, delay: reduce ? 0 : 2.1, ease: easeHero }}
    >
      <SmoothHashLink href={href} className="hero-scroll-cue__btn" aria-label={label}>
        <span className="hero-scroll-cue__line" aria-hidden />
        <ChevronDown className="hero-scroll-cue__icon" aria-hidden />
        <span className="sr-only">{label}</span>
      </SmoothHashLink>
    </motion.div>
  );
}
