export const CRM_RANGES = [3, 6, 12] as const;
export type CrmRangeMonths = (typeof CRM_RANGES)[number];

export const CRM_DELIVERY_STATUSES = [
  "ON_TRACK",
  "AT_RISK",
  "DELAYED",
  "DELIVERED",
  "FAILED",
] as const;
export type CrmDeliveryStatus = (typeof CRM_DELIVERY_STATUSES)[number];

export const CRM_FUNNEL_STAGES = [
  "FIRST_CONTACT",
  "QUALIFIED",
  "PROPOSAL",
  "IN_PROGRESS",
  "DELIVERED",
] as const;
export type CrmFunnelStage = (typeof CRM_FUNNEL_STAGES)[number];

export const CRM_FUNNEL_STAGE_LABELS: Record<CrmFunnelStage, string> = {
  FIRST_CONTACT: "First contact",
  QUALIFIED: "Qualified",
  PROPOSAL: "Proposal",
  IN_PROGRESS: "In progress",
  DELIVERED: "Delivered",
};

export const CRM_FUNNEL_STAGE_LABELS_FA: Record<CrmFunnelStage, string> = {
  FIRST_CONTACT: "اولین تماس",
  QUALIFIED: "واجد شرایط",
  PROPOSAL: "پیشنهاد",
  IN_PROGRESS: "در حال انجام",
  DELIVERED: "تحویل‌شده",
};

export const CRM_STATUS_LABELS: Record<CrmDeliveryStatus, string> = {
  ON_TRACK: "On track",
  AT_RISK: "At risk",
  DELAYED: "Delayed",
  DELIVERED: "Delivered",
  FAILED: "Failed",
};

export const CRM_STATUS_LABELS_FA: Record<CrmDeliveryStatus, string> = {
  ON_TRACK: "طبق برنامه",
  AT_RISK: "در معرض خطر",
  DELAYED: "تأخیر",
  DELIVERED: "تحویل‌شده",
  FAILED: "ناموفق",
};

export type PeriodDelta = {
  value: number;
  previous: number;
  /** Percent change vs previous period; null when previous is 0. */
  changePercent: number | null;
};

export type AdminCrmAnalytics = {
  range: CrmRangeMonths;
  hasData: boolean;
  successRate: PeriodDelta;
  kpis: {
    delivered: PeriodDelta;
    revenue: PeriodDelta;
    newCustomers: PeriodDelta;
    delayed: PeriodDelta;
  };
  monthlyTrend: {
    monthKey: string;
    label: string;
    delivered: number;
    failed: number;
    successRate: number | null;
  }[];
  funnel: {
    stage: CrmFunnelStage;
    label: string;
    count: number;
    dropOffPercent: number | null;
  }[];
  successByType: {
    typeId: string;
    nameEn: string;
    nameFa: string;
    delivered: number;
    failed: number;
    successRate: number | null;
  }[];
  monthlyRevenue: {
    monthKey: string;
    label: string;
    revenue: number;
  }[];
  activeProjects: {
    id: string;
    nameEn: string;
    nameFa: string;
    clientNameEn: string;
    clientNameFa: string;
    typeNameEn: string;
    typeNameFa: string;
    progress: number;
    status: CrmDeliveryStatus;
    deliveryDate: string | null;
  }[];
  settings: {
    publicReportEnabled: boolean;
    customerSatisfaction: number | null;
  };
};

/** Public-safe payload — no revenue, delays, failures, or internal statuses. */
export type PublicCrmReport = {
  range: CrmRangeMonths;
  enabled: boolean;
  hasData: boolean;
  successRate: number | null;
  customerSatisfaction: number | null;
  onTimeDelivery: number | null;
  monthlyDeliveries: {
    monthKey: string;
    label: string;
    delivered: number;
  }[];
  shareByCategory: {
    typeId: string;
    nameEn: string;
    nameFa: string;
    count: number;
    sharePercent: number;
  }[];
  samples: {
    id: string;
    nameEn: string;
    nameFa: string;
    coverImageUrl: string | null;
    quoteEn: string | null;
    quoteFa: string | null;
    clientNameEn: string;
    clientNameFa: string;
  }[];
};

export function parseCrmRange(raw: string | undefined | null): CrmRangeMonths {
  const n = Number(raw);
  if (n === 3 || n === 6 || n === 12) return n;
  return 6;
}
