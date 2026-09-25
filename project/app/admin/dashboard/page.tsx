import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminCrmDashboard } from "@/components/crm/admin-dashboard";
import { getAdminCrmAnalytics } from "@/lib/crm/analytics";
import { parseCrmRange } from "@/lib/crm/types";

export const metadata: Metadata = {
  title: "داشبورد تحویل",
};

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rangeRaw } = await searchParams;
  const range = parseCrmRange(rangeRaw);
  const data = await getAdminCrmAnalytics(range);

  return (
    <Suspense fallback={<div className="text-sm text-fg-muted">در حال بارگذاری…</div>}>
      <AdminCrmDashboard data={data} />
    </Suspense>
  );
}
