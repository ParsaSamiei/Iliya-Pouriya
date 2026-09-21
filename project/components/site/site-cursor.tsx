"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const INTERACTIVE =
  "a, button, [role='button'], input, textarea, select, label, summary, [data-cursor='interactive']";

/** Brand hexagon cursor — teal core + violet ring, logo geometry. */
export function SiteCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [textMode, setTextMode] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.35 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.35 });

  useEffect(() => {
    if (reduce) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    setEnabled(true);
    document.documentElement.classList.add("has-site-cursor");

    const onMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onOver = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        setHovering(false);
        setTextMode(false);
        return;
      }

      const textField = target.closest("input, textarea, [contenteditable='true']");
      if (textField) {
        setTextMode(true);
        setHovering(false);
        return;
      }

      setTextMode(false);
      setHovering(Boolean(target.closest(INTERACTIVE)));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.documentElement.classList.remove("has-site-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="site-cursor pointer-events-none fixed inset-0 z-100 hidden md:block"
      style={{ opacity: visible && !textMode ? 1 : 0 }}
    >
      <motion.div
        className="site-cursor__ring absolute top-0 left-0 will-change-transform"
        style={{ x: ringX, y: ringY }}
      >
        <svg
          className={`site-cursor__hex ${hovering ? "site-cursor__hex--active" : ""}`}
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
        >
          <defs>
            <linearGradient id="site-cursor-stroke" x1="4" y1="2" x2="32" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--accent)" />
              <stop offset="1" stopColor="var(--signal)" />
            </linearGradient>
          </defs>
          <polygon
            points="18,2.5 32.5,10.5 32.5,25.5 18,33.5 3.5,25.5 3.5,10.5"
            stroke="url(#site-cursor-stroke)"
            strokeWidth="1.25"
            fill="color-mix(in srgb, var(--accent) 8%, transparent)"
          />
        </svg>
      </motion.div>

      <motion.div
        className={`site-cursor__dot absolute top-0 left-0 will-change-transform ${
          hovering ? "site-cursor__dot--active" : ""
        }`}
        style={{ x, y }}
      />
    </div>
  );
}
