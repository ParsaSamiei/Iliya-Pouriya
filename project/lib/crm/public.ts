import "server-only";

import { getPublicCrmReport } from "@/lib/crm/analytics";

export type PublicReportTeaser = {
  successRate: number | null;
  customerSatisfaction: number | null;
  onTimeDelivery: number | null;
};

/** Whether /report should be linked from public surfaces (footer, homepage). */
export async function getPublicReportVisibility(): Promise<{
  show: boolean;
  teaser: PublicReportTeaser | null;
}> {
  try {
    const report = await getPublicCrmReport(12);
    if (!report.enabled || !report.hasData) {
      return { show: false, teaser: null };
    }
    return {
      show: true,
      teaser: {
        successRate: report.successRate,
        customerSatisfaction: report.customerSatisfaction,
        onTimeDelivery: report.onTimeDelivery,
      },
    };
  } catch {
    return { show: false, teaser: null };
  }
}
