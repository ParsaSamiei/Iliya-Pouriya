import { DeltaBadge, formatCompactNumber } from "@/components/crm/delta-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PeriodDelta } from "@/lib/crm/types";

export function KpiCard({
  title,
  delta,
  currency = false,
  invertColors = false,
}: {
  title: string;
  delta: PeriodDelta;
  currency?: boolean;
  invertColors?: boolean;
}) {
  return (
    <Card className="bg-surface/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium tracking-wide text-fg-muted uppercase">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-2">
        <p className="font-display text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">
          {formatCompactNumber(delta.value, currency)}
        </p>
        <DeltaBadge delta={delta} invertColors={invertColors} />
      </CardContent>
    </Card>
  );
}
