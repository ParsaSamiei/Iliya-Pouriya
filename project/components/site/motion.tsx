"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Soft ease-out — entering elements settle, they don’t ease in linearly. */
const easeOut = [0.22, 1, 0.36, 1] as const;

/** Subtle but readable rise for section headers / blocks. */
const REVEAL_Y = 22;
/** Card / list item rise — a touch less than headers. */
const ITEM_Y = 18;

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
} & Omit<HTMLMotionProps<"div">, "children" | "className">;

/** Fade + rise on scroll; runs once by default; respects prefers-reduced-motion. */
export function MotionReveal({
  children,
  className,
  delay = 0,
  y = REVEAL_Y,
  once = true,
  ...props
}: MotionRevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-10% 0px -8% 0px", amount: 0.2 }}
      transition={{
        duration: reduce ? 0 : 0.55,
        delay: reduce ? 0 : delay,
        ease: easeOut,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type MotionStaggerProps = {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  stagger?: number;
};

/** Parent for staggered child entrances on mount (use with MotionItem). */
export function MotionStagger({
  children,
  className,
  delayChildren = 0,
  stagger = 0.07,
}: MotionStaggerProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduce ? 0 : stagger,
            delayChildren: reduce ? 0 : delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

type MotionStaggerInViewProps = {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  stagger?: number;
  once?: boolean;
};

/** Scroll-triggered stagger parent (use with MotionItem). Plays once by default. */
export function MotionStaggerInView({
  children,
  className,
  delayChildren = 0.05,
  stagger = 0.08,
  once = true,
}: MotionStaggerInViewProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-10% 0px -8% 0px", amount: 0.15 }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduce ? 0 : stagger,
            delayChildren: reduce ? 0 : delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

type MotionItemProps = {
  children: ReactNode;
  className?: string;
  y?: number;
};

export function MotionItem({ children, className, y = ITEM_Y }: MotionItemProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: reduce ? 0 : 0.5, ease: easeOut },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

type MotionHoverProps = {
  children: ReactNode;
  className?: string;
  /** Soft vertical lift in px; keep small (2–4). */
  lift?: number;
};

/** Subtle hover lift for interactive cards — no layout-shifting scale. */
export function MotionHover({ children, className, lift = 3 }: MotionHoverProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn("h-full", className)}
      whileHover={reduce ? undefined : { y: -lift }}
      transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.6 }}
    >
      {children}
    </motion.div>
  );
}
