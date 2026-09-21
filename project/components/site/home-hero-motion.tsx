"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type HomeHeroMotionProps = {
  logo: ReactNode;
  lockup: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
  actions: ReactNode;
};

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
        transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {logo}
      </motion.div>

      <div className="flex min-w-0 flex-col">
        <HeroCopy enter={enter} reduce={Boolean(reduce)} delay={0.08} y={14}>
          {lockup}
        </HeroCopy>
        <HeroCopy
          enter={enter}
          reduce={Boolean(reduce)}
          delay={0.16}
          y={12}
          className="mt-7 sm:mt-9"
        >
          {title}
        </HeroCopy>
        <HeroCopy
          enter={enter}
          reduce={Boolean(reduce)}
          delay={0.24}
          y={10}
          className="mt-4"
        >
          {subtitle}
        </HeroCopy>
        <HeroCopy
          enter={enter}
          reduce={Boolean(reduce)}
          delay={0.32}
          y={8}
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
        duration: reduce ? 0 : 0.5,
        delay: enter && !reduce ? delay : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
