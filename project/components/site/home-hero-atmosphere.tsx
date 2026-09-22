"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Full-bleed hero plane — hex lattice + brand diagonal, no overlays on copy. */
export function HomeHeroAtmosphere() {
  const reduce = useReducedMotion();

  return (
    <div className="hero-atmosphere absolute inset-0 overflow-hidden" aria-hidden>
      <div className="hero-material-wash absolute inset-0" />

      <svg
        className="hero-hex-lattice absolute inset-0 size-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="hero-hex-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.45" />
            <stop offset="50%" stopColor="var(--fg)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--signal)" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="hero-beam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
            <stop offset="35%" stopColor="var(--accent)" stopOpacity="0.65" />
            <stop offset="65%" stopColor="var(--signal)" stopOpacity="0.58" />
            <stop offset="100%" stopColor="var(--signal)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="hero-node" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft hex field — logo vernacular, not a measurement grid */}
        <motion.g
          stroke="url(#hero-hex-stroke)"
          strokeWidth="1"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: reduce ? 0 : 1.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <path d="M80 120 L160 80 L240 120 L240 200 L160 240 L80 200 Z" />
          <path d="M280 200 L360 160 L440 200 L440 280 L360 320 L280 280 Z" />
          <path d="M520 80 L600 40 L680 80 L680 160 L600 200 L520 160 Z" />
          <path d="M760 220 L840 180 L920 220 L920 300 L840 340 L760 300 Z" />
          <path d="M140 420 L220 380 L300 420 L300 500 L220 540 L140 500 Z" />
          <path d="M400 480 L480 440 L560 480 L560 560 L480 600 L400 560 Z" />
          <path d="M680 460 L760 420 L840 460 L840 540 L760 580 L680 540 Z" />
          <path d="M960 120 L1040 80 L1120 120 L1120 200 L1040 240 L960 200 Z" />
          <path d="M900 520 L980 480 L1060 520 L1060 600 L980 640 L900 600 Z" />
          <path d="M60 620 L140 580 L220 620 L220 700 L140 740 L60 700 Z" />
        </motion.g>

        {/* Brand diagonal beam */}
        <motion.path
          d="M-40 720 L1280 -40"
          stroke="url(#hero-beam)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.9 }}
          transition={{ duration: reduce ? 0 : 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <path
          d="M-20 760 L1300 0"
          stroke="url(#hero-beam)"
          strokeWidth="56"
          strokeLinecap="round"
          opacity="0.09"
        />

        {/* Trace nodes along the seam */}
        <motion.circle
          cx="280"
          cy="480"
          r="18"
          fill="url(#hero-node)"
          initial={reduce ? false : { opacity: 0, scale: 0.6 }}
          animate={
            reduce
              ? { opacity: 0.7 }
              : { opacity: [0.35, 0.85, 0.35], scale: [0.9, 1.05, 0.9] }
          }
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
          }
        />
        <motion.circle
          cx="620"
          cy="290"
          r="14"
          fill="url(#hero-node)"
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? { opacity: 0.55 } : { opacity: [0.25, 0.7, 0.25] }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }
          }
        />
        <motion.circle
          cx="940"
          cy="120"
          r="12"
          fill="var(--signal)"
          opacity="0.35"
          initial={reduce ? false : { opacity: 0 }}
          animate={reduce ? { opacity: 0.35 } : { opacity: [0.15, 0.5, 0.15] }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1.4 }
          }
        />
      </svg>

      <div className="hero-orb hero-orb--accent" />
      <div className="hero-orb hero-orb--signal" />
      <div className="hero-atmosphere__floor" />
    </div>
  );
}
