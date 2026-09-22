"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SmoothHashLink } from "@/components/site/smooth-hash-link";

type HomeHeroMotionProps = {
  logo: ReactNode;
  lockup: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
  actions: ReactNode;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

/** Orchestrated hero entrance — keeps content visible before hydration. */
export function HomeHeroMotion({
  logo,
  lockup,
  title,
  subtitle,
  actions,
}: HomeHeroMotionProps) {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
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
            : { opacity: 1, scale: 0.97, rotate: -3 }
        }
        transition={{ duration: reduce ? 0 : 0.7, ease: easeOut }}
      >
        {logo}
      </motion.div>

      <div className="flex min-w-0 flex-col">
        <HeroCopy enter={enter} reduce={Boolean(reduce)} delay={0.08} y={12}>
          {lockup}
        </HeroCopy>
        <HeroCopy
          enter={enter}
          reduce={Boolean(reduce)}
          delay={0.16}
          y={10}
          className="mt-7 sm:mt-9"
        >
          {title}
        </HeroCopy>
        <HeroCopy
          enter={enter}
          reduce={Boolean(reduce)}
          delay={0.24}
          y={8}
          className="mt-4"
        >
          {subtitle}
        </HeroCopy>
        <HeroCopy
          enter={enter}
          reduce={Boolean(reduce)}
          delay={0.32}
          y={6}
          className="mt-9"
        >
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
      animate={enter ? { opacity: 1, y: 0 } : { opacity: 1, y }}
      transition={{
        duration: reduce ? 0 : 0.52,
        delay: enter && !reduce ? delay : 0,
        ease: easeOut,
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
      initial={reduce ? false : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.85, ease: easeOut }}
    >
      <SmoothHashLink href={href} className="hero-scroll-cue__btn" aria-label={label}>
        <span className="hero-scroll-cue__line" aria-hidden />
        <ChevronDown className="hero-scroll-cue__icon" aria-hidden />
        <span className="sr-only">{label}</span>
      </SmoothHashLink>
    </motion.div>
  );
}
