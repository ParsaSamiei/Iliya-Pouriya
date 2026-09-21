"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
  y = 12,
  once = true,
  ...props
}: MotionRevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-40px 0px" }}
      transition={{
        duration: reduce ? 0 : 0.45,
        delay: reduce ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
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

/** Parent for staggered child entrances (use with MotionItem). */
export function MotionStagger({
  children,
  className,
  delayChildren = 0,
  stagger = 0.08,
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

type MotionItemProps = {
  children: ReactNode;
  className?: string;
  y?: number;
};

export function MotionItem({ children, className, y = 10 }: MotionItemProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] },
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
  scale?: number;
};

/** Subtle hover lift for interactive cards. */
export function MotionHover({ children, className, scale = 1.01 }: MotionHoverProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      whileHover={reduce ? undefined : { scale }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
    >
      {children}
    </motion.div>
  );
}
