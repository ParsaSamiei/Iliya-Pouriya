import "server-only";

import { db } from "@/lib/db";
import {
  type AdminCrmAnalytics,
  type CrmFunnelStage,
  CRM_FUNNEL_STAGE_LABELS_FA,
  CRM_FUNNEL_STAGES,
  type CrmRangeMonths,
  type PeriodDelta,
  type PublicCrmReport,
} from "@/lib/crm/types";

function startOfMonth(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function addMonths(d: Date, months: number): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, 1));
}

function monthKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(d: Date, locale: "en" | "fa" = "fa"): string {
  return d.toLocaleString(locale === "fa" ? "fa-IR" : "en", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  });
}

function periodWindow(range: CrmRangeMonths, endExclusive: Date) {
  const end = startOfMonth(endExclusive);
  const start = addMonths(end, -range);
  return { start, end };
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}

function delta(current: number, previous: number): PeriodDelta {
  return {
    value: current,
    previous,
    changePercent: pctChange(current, previous),
  };
}

function successRate(delivered: number, failed: number): number | null {
  const total = delivered + failed;
  if (total === 0) return null;
  return (delivered / total) * 100;
}

function toNumber(value: { toString(): string } | number | null | undefined): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  return Number(value.toString());
}

async function getSettings() {
  const row = await db.crmSettings.upsert({
    where: { id: "default" },
    create: { id: "default", publicReportEnabled: false },
    update: {},
  });
  return {
    publicReportEnabled: row.publicReportEnabled,
    customerSatisfaction: row.customerSatisfaction,
  };
}

async function loadProjects() {
  return db.crmTrackedProject.findMany({ include: { type: true } });
}

type ProjectRow = Awaited<ReturnType<typeof loadProjects>>[number];

function inCompletedWindow(p: ProjectRow, start: Date, end: Date) {
  if (!p.completedAt) return false;
  return p.completedAt >= start && p.completedAt < end;
}

function aggregatePeriod(projects: ProjectRow[], start: Date, end: Date) {
  let delivered = 0;
  let failed = 0;
  let revenue = 0;
  let newCustomers = 0;
  let delayed = 0;

  for (const p of projects) {
    if (p.status === "DELAYED") {
      // Active delayed count for current snapshot; for previous period use
      // projects that were delayed and created before end of that window.
      if (p.createdAt < end && (p.completedAt == null || p.completedAt >= start)) {
        delayed += 1;
      }
    }

    if (!inCompletedWindow(p, start, end)) continue;

    if (p.status === "DELIVERED") {
      delivered += 1;
      revenue += toNumber(p.revenue);
      if (p.isNewCustomer) newCustomers += 1;
    } else if (p.status === "FAILED") {
      failed += 1;
      if (p.isNewCustomer) newCustomers += 1;
    }
  }

  return { delivered, failed, revenue, newCustomers, delayed };
}

function buildMonthlyTrend(projects: ProjectRow[], start: Date, end: Date, locale: "en" | "fa" = "fa") {
  const months: AdminCrmAnalytics["monthlyTrend"] = [];
  for (let cursor = new Date(start); cursor < end; cursor = addMonths(cursor, 1)) {
    const next = addMonths(cursor, 1);
    let delivered = 0;
    let failed = 0;
    for (const p of projects) {
      if (!inCompletedWindow(p, cursor, next)) continue;
      if (p.status === "DELIVERED") delivered += 1;
      if (p.status === "FAILED") failed += 1;
    }
    months.push({
      monthKey: monthKey(cursor),
      label: monthLabel(cursor, locale),
      delivered,
      failed,
      successRate: successRate(delivered, failed),
    });
  }
  return months;
}

function buildMonthlyRevenue(projects: ProjectRow[], start: Date, end: Date, locale: "en" | "fa" = "fa") {
  const months: AdminCrmAnalytics["monthlyRevenue"] = [];
  for (let cursor = new Date(start); cursor < end; cursor = addMonths(cursor, 1)) {
    const next = addMonths(cursor, 1);
    let revenue = 0;
    for (const p of projects) {
      if (!inCompletedWindow(p, cursor, next)) continue;
      if (p.status === "DELIVERED") revenue += toNumber(p.revenue);
    }
    months.push({
      monthKey: monthKey(cursor),
      label: monthLabel(cursor, locale),
      revenue,
    });
  }
  return months;
}

function buildSuccessByType(projects: ProjectRow[], start: Date, end: Date) {
  const map = new Map<
    string,
    {
      typeId: string;
      nameEn: string;
      nameFa: string;
      delivered: number;
      failed: number;
    }
  >();

  for (const p of projects) {
    if (!inCompletedWindow(p, start, end)) continue;
    if (p.status !== "DELIVERED" && p.status !== "FAILED") continue;
    const existing = map.get(p.typeId) ?? {
      typeId: p.typeId,
      nameEn: p.type.nameEn,
      nameFa: p.type.nameFa,
      delivered: 0,
      failed: 0,
    };
    if (p.status === "DELIVERED") existing.delivered += 1;
    else existing.failed += 1;
    map.set(p.typeId, existing);
  }

  return [...map.values()]
    .map((row) => ({
      ...row,
      successRate: successRate(row.delivered, row.failed),
    }))
    .sort((a, b) => (b.successRate ?? -1) - (a.successRate ?? -1));
}

async function buildFunnel(start: Date, end: Date): Promise<AdminCrmAnalytics["funnel"]> {
  const entries = await db.crmFunnelEntry.findMany({
    where: { month: { gte: start, lt: end } },
  });

  const totals = new Map<CrmFunnelStage, number>();
  for (const stage of CRM_FUNNEL_STAGES) totals.set(stage, 0);
  for (const e of entries) {
    totals.set(e.stage, (totals.get(e.stage) ?? 0) + e.count);
  }

  const funnel: AdminCrmAnalytics["funnel"] = [];
  let prevCount: number | null = null;
  for (const stage of CRM_FUNNEL_STAGES) {
    const count = totals.get(stage) ?? 0;
    let dropOffPercent: number | null = null;
    if (prevCount != null && prevCount > 0) {
      dropOffPercent = ((prevCount - count) / prevCount) * 100;
    }
    funnel.push({
      stage,
      label: CRM_FUNNEL_STAGE_LABELS_FA[stage],
      count,
      dropOffPercent,
    });
    prevCount = count;
  }
  return funnel;
}

/**
 * Full admin analytics for a rolling `range`-month window vs the prior window.
 */
export async function getAdminCrmAnalytics(range: CrmRangeMonths): Promise<AdminCrmAnalytics> {
  const now = new Date();
  const current = periodWindow(range, now);
  const previous = periodWindow(range, current.start);

  const [projects, settings, funnel] = await Promise.all([
    loadProjects(),
    getSettings(),
    buildFunnel(current.start, current.end),
  ]);

  const cur = aggregatePeriod(projects, current.start, current.end);
  const prev = aggregatePeriod(projects, previous.start, previous.end);

  const curRate = successRate(cur.delivered, cur.failed);
  const prevRate = successRate(prev.delivered, prev.failed);

  const activeProjects = projects
    .filter((p) => p.status === "ON_TRACK" || p.status === "AT_RISK" || p.status === "DELAYED")
    .sort((a, b) => {
      const ad = a.deliveryDate?.getTime() ?? Number.POSITIVE_INFINITY;
      const bd = b.deliveryDate?.getTime() ?? Number.POSITIVE_INFINITY;
      return ad - bd;
    })
    .map((p) => ({
      id: p.id,
      nameEn: p.nameEn,
      nameFa: p.nameFa,
      clientNameEn: p.clientNameEn,
      clientNameFa: p.clientNameFa,
      typeNameEn: p.type.nameEn,
      typeNameFa: p.type.nameFa,
      progress: p.progress,
      status: p.status,
      deliveryDate: p.deliveryDate ? p.deliveryDate.toISOString() : null,
    }));

  const monthlyTrend = buildMonthlyTrend(projects, current.start, current.end);
  const monthlyRevenue = buildMonthlyRevenue(projects, current.start, current.end);
  const successByType = buildSuccessByType(projects, current.start, current.end);

  const hasProjectActivity =
    projects.length > 0 ||
    funnel.some((f) => f.count > 0) ||
    monthlyTrend.some((m) => m.delivered > 0 || m.failed > 0);

  return {
    range,
    hasData: hasProjectActivity,
    successRate: {
      value: curRate ?? 0,
      previous: prevRate ?? 0,
      changePercent:
        curRate == null && prevRate == null ? null : pctChange(curRate ?? 0, prevRate ?? 0),
    },
    kpis: {
      delivered: delta(cur.delivered, prev.delivered),
      revenue: delta(cur.revenue, prev.revenue),
      newCustomers: delta(cur.newCustomers, prev.newCustomers),
      delayed: delta(cur.delayed, prev.delayed),
    },
    monthlyTrend,
    funnel,
    successByType,
    monthlyRevenue,
    activeProjects,
    settings,
  };
}

/**
 * Public report serializer — strips revenue, delays, failures, and internal status.
 * Returns `enabled: false` / empty charts when the admin toggle is off or there is no data.
 */
export async function getPublicCrmReport(
  range: CrmRangeMonths,
  locale: "en" | "fa" = "fa",
): Promise<PublicCrmReport> {
  const settings = await getSettings();

  const empty: PublicCrmReport = {
    range,
    enabled: settings.publicReportEnabled,
    hasData: false,
    successRate: null,
    customerSatisfaction: settings.customerSatisfaction,
    onTimeDelivery: null,
    monthlyDeliveries: [],
    shareByCategory: [],
    samples: [],
  };

  if (!settings.publicReportEnabled) {
    return empty;
  }

  const now = new Date();
  const { start, end } = periodWindow(range, now);

  const projects = await loadProjects();

  let delivered = 0;
  let failed = 0;
  let onTime = 0;

  const monthlyMap = new Map<string, { label: string; delivered: number; cursor: Date }>();
  for (let cursor = new Date(start); cursor < end; cursor = addMonths(cursor, 1)) {
    monthlyMap.set(monthKey(cursor), { label: monthLabel(cursor, locale), delivered: 0, cursor });
  }

  const categoryMap = new Map<
    string,
    { typeId: string; nameEn: string; nameFa: string; count: number }
  >();

  for (const p of projects) {
    if (!inCompletedWindow(p, start, end)) continue;

    // Public path: only count successful deliveries for visible metrics.
    // Failures affect success rate numerator/denominator only — never shown as a series.
    if (p.status === "DELIVERED") {
      delivered += 1;
      // Treat non-DELAYED completions as on-time for the public on-time rate.
      // Delayed→Delivered projects still count as delivered but not on-time;
      // we approximate: if status is DELIVERED and never flagged, count on-time.
      // Since status is terminal, admin should set completed projects that slipped
      // as DELIVERED with progress 100 — on-time uses deliveryDate vs completedAt
      // when both exist and completedAt <= deliveryDate.
      if (p.deliveryDate && p.completedAt && p.completedAt <= p.deliveryDate) {
        onTime += 1;
      } else if (!p.deliveryDate) {
        onTime += 1;
      }

      const key = monthKey(startOfMonth(p.completedAt!));
      const bucket = monthlyMap.get(key);
      if (bucket) bucket.delivered += 1;

      const cat = categoryMap.get(p.typeId) ?? {
        typeId: p.typeId,
        nameEn: p.type.nameEn,
        nameFa: p.type.nameFa,
        count: 0,
      };
      cat.count += 1;
      categoryMap.set(p.typeId, cat);
    } else if (p.status === "FAILED") {
      failed += 1;
    }
  }

  const rate = successRate(delivered, failed);
  const monthlyDeliveries = [...monthlyMap.values()].map((m) => ({
    monthKey: monthKey(m.cursor),
    label: m.label,
    delivered: m.delivered,
  }));

  const totalShare = [...categoryMap.values()].reduce((s, c) => s + c.count, 0);
  const shareByCategory = [...categoryMap.values()]
    .map((c) => ({
      ...c,
      sharePercent: totalShare === 0 ? 0 : (c.count / totalShare) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  const samples = projects
    .filter((p) => p.showOnPublic && p.status === "DELIVERED")
    .sort((a, b) => (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0))
    .slice(0, 6)
    .map((p) => ({
      id: p.id,
      nameEn: p.nameEn,
      nameFa: p.nameFa,
      coverImageUrl: p.coverImageUrl,
      quoteEn: p.quoteEn,
      quoteFa: p.quoteFa,
      clientNameEn: p.clientNameEn,
      clientNameFa: p.clientNameFa,
    }));

  const hasData =
    delivered + failed > 0 || monthlyDeliveries.some((m) => m.delivered > 0) || samples.length > 0;

  return {
    range,
    enabled: true,
    hasData,
    successRate: rate,
    customerSatisfaction: settings.customerSatisfaction,
    onTimeDelivery: delivered === 0 ? null : (onTime / delivered) * 100,
    monthlyDeliveries,
    shareByCategory,
    samples,
  };
}
