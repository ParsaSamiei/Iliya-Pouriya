"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { PeriodDelta } from "@/lib/crm/types";
import { cn } from "@/lib/utils";

export function DeltaBadge({
  delta,
  invertColors = false,
  className,
}: {
  delta: Pick<PeriodDelta, "changePercent">;
  /** When true, increases are bad (e.g. delayed projects). */
  invertColors?: boolean;
  className?: string;
}) {
  const pct = delta.changePercent;
  if (pct == null) {
    return (
      <span className={cn("inline-flex items-center gap-0.5 text-xs text-fg-muted", className)}>
        <Minus className="size-3" aria-hidden />
        —
      </span>
    );
  }

  const up = pct > 0;
  const flat = pct === 0;
  const good = invertColors ? !up : up;
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 font-mono text-xs tabular-nums",
        flat && "text-fg-muted",
        !flat && good && "text-success",
        !flat && !good && "text-error",
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

export function formatCompactNumber(n: number, currency = false): string {
  if (currency) {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: "USD",
      notation: n >= 10000 ? "compact" : "standard",
      maximumFractionDigits: n >= 100 ? 0 : 2,
    }).format(n);
  }
  return new Intl.NumberFormat("en", {
    notation: n >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 0,
  }).format(n);
}
