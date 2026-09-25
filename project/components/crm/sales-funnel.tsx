import { CrmEmptyState } from "@/components/crm/empty-state";
import type { AdminCrmAnalytics } from "@/lib/crm/types";
import { cn } from "@/lib/utils";

export function SalesFunnel({
  data,
  emptyTitle,
}: {
  data: AdminCrmAnalytics["funnel"];
  emptyTitle: string;
}) {
  const max = Math.max(...data.map((d) => d.count), 0);
  if (max === 0) return <CrmEmptyState title={emptyTitle} />;

  return (
    <ol className="space-y-3">
      {data.map((stage, i) => {
        const width = max === 0 ? 0 : (stage.count / max) * 100;
        return (
          <li key={stage.stage} className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="font-medium">
                <span className="me-2 font-mono text-xs text-fg-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {stage.label}
              </span>
              <span className="flex items-center gap-2 font-mono text-xs tabular-nums text-fg-muted">
                {stage.dropOffPercent != null && stage.dropOffPercent > 0 ? (
                  <span className="text-warning">−{stage.dropOffPercent.toFixed(0)}%</span>
                ) : null}
                <span className="text-fg">{stage.count}</span>
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-[var(--radius-sm)] bg-surface-raised">
              <div
                className={cn(
                  "h-full rounded-[var(--radius-sm)] transition-[width] duration-500 ease-out",
                  i === data.length - 1 ? "bg-accent" : "bg-signal/80",
                )}
                style={{ width: `${width}%` }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
