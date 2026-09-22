"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const easeOut = [0.22, 1, 0.36, 1] as const;

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
} & Omit<HTMLMotionProps<"div">, "children" | "className">;

/** Fade + rise entrance; respects prefers-reduced-motion without SSR branch. */
export function MotionReveal({
  children,
  className,
  delay = 0,
  y = 10,
  once = true,
  ...props
}: MotionRevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-48px 0px" }}
      transition={{
        duration: reduce ? 0 : 0.5,
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

/** Scroll-triggered stagger parent (use with MotionItem). */
export function MotionStaggerInView({
  children,
  className,
  delayChildren = 0.04,
  stagger = 0.07,
  once = true,
}: MotionStaggerInViewProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-48px 0px" }}
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

export function MotionItem({ children, className, y = 8 }: MotionItemProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: reduce ? 0 : 0.48, ease: easeOut },
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
