"use client";

import { DeltaBadge } from "@/components/crm/delta-badge";
import type { PeriodDelta } from "@/lib/crm/types";
import { cn } from "@/lib/utils";

/**
 * Signature telemetry ring — circuit teal → hex violet arc around success %.
 */
export function SuccessGauge({
  rate,
  size = 200,
  label = "Success rate",
  className,
}: {
  rate: PeriodDelta;
  size?: number;
  label?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, rate.value));
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  const mid = size / 2;

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
          <defs>
            <linearGradient id="crm-gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--signal)" />
            </linearGradient>
          </defs>
          <circle
            cx={mid}
            cy={mid}
            r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth={stroke}
          />
          <circle
            cx={mid}
            cy={mid}
            r={r}
            fill="none"
            stroke="url(#crm-gauge-gradient)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c - dash}`}
            transform={`rotate(-90 ${mid} ${mid})`}
            className="motion-safe:transition-[stroke-dasharray] motion-safe:duration-700 motion-safe:ease-out"
          />
          {/* Tick marks — instrumentation vernacular */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const inner = r - 16;
            const outer = r - 10;
            return (
              <line
                key={i}
                x1={mid + Math.cos(angle) * inner}
                y1={mid + Math.sin(angle) * inner}
                x2={mid + Math.cos(angle) * outer}
                y2={mid + Math.sin(angle) * outer}
                stroke="var(--fg-muted)"
                strokeOpacity={0.35}
                strokeWidth={1.5}
              />
            );
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl font-semibold tabular-nums tracking-tight">
            {pct.toFixed(0)}
            <span className="text-lg text-fg-muted">%</span>
          </span>
          <DeltaBadge delta={rate} />
        </div>
      </div>
      <p className="text-sm font-medium text-fg-muted">{label}</p>
    </div>
  );
}
