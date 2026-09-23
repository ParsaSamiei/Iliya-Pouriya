"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type StatusBoardCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  empty: string;
  activeCount: number;
  fieldCount: number;
  completeCount: number;
};

type StatusMetric = {
  key: "active" | "field" | "complete";
  count: number;
  tone: "accent" | "signal" | "muted";
};

const easeOut = [0.22, 1, 0.36, 1] as const;

function AnimatedCount({
  value,
  locale,
  active,
}: {
  value: number;
  locale: string;
  active: boolean;
}) {
  const reduce = useReducedMotion();
  const spring = useSpring(0, {
    stiffness: 90,
    damping: 28,
    mass: 0.8,
  });
  const display = useTransform(spring, (latest) =>
    new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(
      Math.round(latest),
    ),
  );
  const [text, setText] = useState(() =>
    new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(
      reduce ? value : 0,
    ),
  );

  useEffect(() => {
    if (reduce) {
      setText(
        new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value),
      );
      spring.set(value);
      return;
    }
    if (!active) return;
    spring.jump(0);
    const id = requestAnimationFrame(() => spring.set(value));
    return () => cancelAnimationFrame(id);
  }, [active, locale, reduce, spring, value]);

  useEffect(() => {
    const unsub = display.on("change", (v) => setText(v));
    return unsub;
  }, [display]);

  return (
    <span className="status-board-count tabular-nums" aria-label={String(value)}>
      {text}
    </span>
  );
}

export function ProjectsStatusBoard({ copy }: { copy: StatusBoardCopy }) {
  const locale = useLocale();
  const t = useTranslations("projects.statusBoard");
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, margin: "-64px 0px" });
  const total = copy.activeCount + copy.fieldCount + copy.completeCount;
  const hasActive = copy.activeCount > 0;
  const play = Boolean(reduce) || inView;

  const metrics: StatusMetric[] = [
    { key: "active", count: copy.activeCount, tone: "accent" },
    { key: "field", count: copy.fieldCount, tone: "signal" },
    { key: "complete", count: copy.completeCount, tone: "muted" },
  ];

  return (
    <div ref={rootRef} className="status-board relative z-10 mt-12">
      <motion.div
        className="status-board-chrome"
        aria-hidden
        initial={false}
        animate={play ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0.4 }}
        style={{ transformOrigin: locale === "fa" ? "100% 50%" : "0% 50%" }}
        transition={{ duration: reduce ? 0 : 0.7, ease: easeOut }}
      />

      <motion.div
        className="status-board-panel"
        initial={false}
        animate={play ? { opacity: 1 } : { opacity: 0.92 }}
        transition={{ duration: reduce ? 0 : 0.45, ease: easeOut }}
      >
        <div className="status-board-header">
          <motion.div
            className="min-w-0 flex-1"
            initial={false}
            animate={
              play
                ? { opacity: 1, y: 0 }
                : { opacity: reduce ? 1 : 0, y: reduce ? 0 : 18 }
            }
            transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.08, ease: easeOut }}
          >
            <p className="status-board-eyebrow">{copy.eyebrow}</p>
            <h3 className="status-board-title">{copy.title}</h3>
            <p className="status-board-subtitle">{copy.subtitle}</p>
          </motion.div>

          {hasActive && (
            <motion.span
              className="status-board-live"
              initial={false}
              animate={
                play
                  ? { opacity: 1, y: 0 }
                  : { opacity: reduce ? 1 : 0, y: reduce ? 0 : 6 }
              }
              transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : 0.22, ease: easeOut }}
            >
              <span className="status-board-live-dot" aria-hidden />
              {t("live")}
            </motion.span>
          )}
        </div>

        {total === 0 ? (
          <p className="status-board-empty">{copy.empty}</p>
        ) : (
          <div className="status-board-metrics" role="list">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.key}
                role="listitem"
                className={cn("status-board-metric", `status-board-metric--${metric.tone}`)}
                initial={false}
                animate={
                  play
                    ? { opacity: 1, y: 0 }
                    : { opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 }
                }
                transition={{
                  duration: reduce ? 0 : 0.5,
                  delay: reduce ? 0 : 0.18 + index * 0.09,
                  ease: easeOut,
                }}
              >
                <div className="status-board-metric-top">
                  <span
                    className={cn(
                      "status-board-indicator",
                      metric.tone === "accent" && "status-board-indicator--active",
                      metric.tone === "signal" && "status-board-indicator--field",
                      metric.tone === "muted" && "status-board-indicator--complete",
                    )}
                    aria-hidden
                  />
                  <p className="status-board-metric-label">{t(metric.key)}</p>
                </div>
                <p className="status-board-metric-value">
                  <AnimatedCount value={metric.count} locale={locale} active={play} />
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
