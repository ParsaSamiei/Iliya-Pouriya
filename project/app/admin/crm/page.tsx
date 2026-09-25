import type { Metadata } from "next";
import Link from "next/link";
import { CrmDataManager, type CrmTrackedProjectInput } from "@/components/admin/crm-data-manager";
import { Button } from "@/components/ui/button";
import { countsFromKinds } from "@/lib/crm/customers";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "داده CRM",
};

function serializeProject(
  p: Awaited<ReturnType<typeof db.crmTrackedProject.findMany>>[number],
): CrmTrackedProjectInput {
  return {
    id: p.id,
    nameEn: p.nameEn,
    nameFa: p.nameFa,
    clientNameEn: p.clientNameEn,
    clientNameFa: p.clientNameFa,
    typeId: p.typeId,
    progress: p.progress,
    status: p.status,
    deliveryDate: p.deliveryDate?.toISOString() ?? null,
    completedAt: p.completedAt?.toISOString() ?? null,
    revenue: p.revenue == null ? null : Number(p.revenue),
    isNewCustomer: p.isNewCustomer,
    showOnPublic: p.showOnPublic,
    coverImageUrl: p.coverImageUrl,
    quoteEn: p.quoteEn,
    quoteFa: p.quoteFa,
  };
}

export default async function AdminCrmDataPage() {
  const [types, projects, funnelEntries, settings, customers] = await Promise.all([
    db.crmProjectType.findMany({ orderBy: { sortOrder: "asc" } }),
    db.crmTrackedProject.findMany({ orderBy: { updatedAt: "desc" } }),
    db.crmFunnelEntry.findMany({ orderBy: { month: "desc" } }),
    db.crmSettings.upsert({
      where: { id: "default" },
      create: { id: "default", publicReportEnabled: false },
      update: {},
    }),
    db.crmCustomer.findMany({
      orderBy: { updatedAt: "desc" },
      include: { notes: { select: { kind: true } } },
    }),
  ]);

  return (
    <div className="space-y-6" dir="rtl" lang="fa">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">داده CRM</h1>
          <p className="mt-1 text-sm text-fg-muted">
            مشتریان، تعامل‌ها و پروژه‌ها را اینجا نگه دارید — نمودارهای داشبورد خودش حساب می‌کند.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/dashboard">مشاهده داشبورد</Link>
        </Button>
      </div>

      <CrmDataManager
        types={types}
        projects={projects.map(serializeProject)}
        funnelEntries={funnelEntries.map((e) => ({
          id: e.id,
          month: e.month.toISOString(),
          stage: e.stage,
          count: e.count,
        }))}
        settings={{
          publicReportEnabled: settings.publicReportEnabled,
          customerSatisfaction: settings.customerSatisfaction,
        }}
        customers={customers.map((c) => ({
          id: c.id,
          name: c.name,
          phone: c.phone,
          email: c.email,
          company: c.company,
          status: c.status,
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString(),
          ...countsFromKinds(c.notes.map((n) => n.kind)),
        }))}
      />
    </div>
  );
}
