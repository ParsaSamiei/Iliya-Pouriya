"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CrmEmptyState } from "@/components/crm/empty-state";
import type { AdminCrmAnalytics } from "@/lib/crm/types";

const tooltipStyle = {
  background: "var(--surface-raised)",
  border: "1px solid var(--border)",
  borderRadius: "4px",
  fontSize: "12px",
  color: "var(--fg)",
};

export function MonthlyTrendChart({
  data,
  emptyTitle,
  labels,
}: {
  data: AdminCrmAnalytics["monthlyTrend"];
  emptyTitle: string;
  labels?: { delivered: string; failed: string; success: string };
}) {
  const has = data.some((d) => d.delivered > 0 || d.failed > 0);
  if (!has) return <CrmEmptyState title={emptyTitle} />;

  const delivered = labels?.delivered ?? "Delivered";
  const failed = labels?.failed ?? "Failed";
  const success = labels?.success ?? "Success %";

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "var(--fg-muted)", fontSize: 11 }} axisLine={false} />
          <YAxis
            yAxisId="count"
            allowDecimals={false}
            tick={{ fill: "var(--fg-muted)", fontSize: 11 }}
            axisLine={false}
            width={32}
          />
          <YAxis
            yAxisId="rate"
            orientation="right"
            domain={[0, 100]}
            tick={{ fill: "var(--fg-muted)", fontSize: 11 }}
            axisLine={false}
            width={36}
            unit="%"
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar yAxisId="count" dataKey="delivered" name={delivered} fill="var(--accent)" radius={[2, 2, 0, 0]} />
          <Bar yAxisId="count" dataKey="failed" name={failed} fill="var(--error)" radius={[2, 2, 0, 0]} />
          <Line
            yAxisId="rate"
            type="monotone"
            dataKey="successRate"
            name={success}
            stroke="var(--signal)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--signal)" }}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthlyRevenueChart({
  data,
  emptyTitle,
  revenueLabel = "Revenue",
}: {
  data: AdminCrmAnalytics["monthlyRevenue"];
  emptyTitle: string;
  revenueLabel?: string;
}) {
  const has = data.some((d) => d.revenue > 0);
  if (!has) return <CrmEmptyState title={emptyTitle} />;

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "var(--fg-muted)", fontSize: 11 }} axisLine={false} />
          <YAxis tick={{ fill: "var(--fg-muted)", fontSize: 11 }} axisLine={false} width={48} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) =>
              typeof value === "number"
                ? [
                    new Intl.NumberFormat("en", { style: "currency", currency: "USD" }).format(value),
                    revenueLabel,
                  ]
                : [value, revenueLabel]
            }
          />
          <Bar dataKey="revenue" name={revenueLabel} fill="var(--signal)" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SuccessByTypeChart({
  data,
  locale,
  emptyTitle,
  successLabel = "Success",
}: {
  data: AdminCrmAnalytics["successByType"];
  locale: "en" | "fa";
  emptyTitle: string;
  successLabel?: string;
}) {
  if (data.length === 0) return <CrmEmptyState title={emptyTitle} />;

  const rows = data.map((d) => ({
    name: locale === "fa" ? d.nameFa : d.nameEn,
    rate: d.successRate ?? 0,
  }));

  if (locale === "fa") {
    return (
      <ul className="flex min-h-56 flex-col justify-center gap-4" dir="rtl">
        {rows.map((row, i) => (
          <li key={`${row.name}-${i}`} className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate font-medium">{row.name}</span>
              <span className="shrink-0 font-mono text-xs tabular-nums text-fg-muted">
                {row.rate.toFixed(0)}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-[var(--radius-sm)] bg-surface-raised">
              <div
                className="h-full rounded-[var(--radius-sm)] transition-[width] duration-500 ease-out"
                style={{
                  width: `${Math.max(0, Math.min(100, row.rate))}%`,
                  background: i % 2 === 0 ? "var(--accent)" : "var(--signal)",
                }}
                role="img"
                aria-label={`${row.name}: ${row.rate.toFixed(0)}% ${successLabel}`}
              />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="h-56 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fill: "var(--fg-muted)", fontSize: 11 }} unit="%" />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fill: "var(--fg-muted)", fontSize: 11 }}
            axisLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v) => [`${Number(v).toFixed(0)}%`, successLabel]}
          />
          <Bar dataKey="rate" name={successLabel} radius={[0, 2, 2, 0]}>
            {rows.map((_, i) => (
              <Cell key={i} fill={i % 2 === 0 ? "var(--accent)" : "var(--signal)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PublicDeliveryChart({
  data,
  emptyTitle,
  deliveredLabel = "Delivered",
}: {
  data: { label: string; delivered: number }[];
  emptyTitle: string;
  deliveredLabel?: string;
}) {
  const has = data.some((d) => d.delivered > 0);
  if (!has) return <CrmEmptyState title={emptyTitle} />;

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "var(--fg-muted)", fontSize: 11 }} axisLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: "var(--fg-muted)", fontSize: 11 }} axisLine={false} width={28} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="delivered" name={deliveredLabel} fill="var(--accent)" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryShareChart({
  data,
  emptyTitle,
  projectsLabel = "Projects",
  rtl = false,
}: {
  data: { name: string; count: number; sharePercent: number }[];
  emptyTitle: string;
  projectsLabel?: string;
  /** When true, use an HTML bar list that lays out correctly under dir=rtl. */
  rtl?: boolean;
}) {
  if (data.length === 0) return <CrmEmptyState title={emptyTitle} />;

  const max = Math.max(...data.map((d) => d.count), 1);

  // Custom bars avoid Recharts SVG axis mirroring/clipping under RTL.
  if (rtl) {
    return (
      <ul className="flex min-h-56 flex-col justify-center gap-4" dir="rtl">
        {data.map((row, i) => {
          const width = (row.count / max) * 100;
          return (
            <li key={`${row.name}-${i}`} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate font-medium">{row.name}</span>
                <span className="shrink-0 font-mono text-xs tabular-nums text-fg-muted">
                  {row.count}
                  <span className="ms-1.5 text-fg-muted/80">({row.sharePercent.toFixed(0)}%)</span>
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-[var(--radius-sm)] bg-surface-raised">
                <div
                  className="h-full rounded-[var(--radius-sm)] transition-[width] duration-500 ease-out"
                  style={{
                    width: `${width}%`,
                    background: i % 2 === 0 ? "var(--signal)" : "var(--accent)",
                  }}
                  role="img"
                  aria-label={`${row.name}: ${row.count} ${projectsLabel}, ${row.sharePercent.toFixed(0)}%`}
                />
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="h-56 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fill: "var(--fg-muted)", fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fill: "var(--fg-muted)", fontSize: 11 }}
            axisLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value, _n, item) => {
              const pct = (item?.payload as { sharePercent?: number } | undefined)?.sharePercent;
              return [`${value}${pct != null ? ` (${pct.toFixed(0)}%)` : ""}`, projectsLabel];
            }}
          />
          <Bar dataKey="count" name={projectsLabel} fill="var(--signal)" radius={[0, 2, 2, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
