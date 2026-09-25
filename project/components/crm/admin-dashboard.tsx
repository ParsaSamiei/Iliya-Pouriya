"use client";

import {
  MonthlyRevenueChart,
  MonthlyTrendChart,
  SuccessByTypeChart,
} from "@/components/crm/charts";
import { CrmEmptyState } from "@/components/crm/empty-state";
import { KpiCard } from "@/components/crm/kpi-card";
import { CrmRangeFilter } from "@/components/crm/range-filter";
import { SalesFunnel } from "@/components/crm/sales-funnel";
import { ActiveProjectsTable } from "@/components/crm/active-projects-table";
import { SuccessGauge } from "@/components/crm/success-gauge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AdminCrmAnalytics } from "@/lib/crm/types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminCrmDashboard({ data }: { data: AdminCrmAnalytics }) {
  return (
    <div className="space-y-8" dir="rtl" lang="fa">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">داشبورد تحویل</h1>
          <p className="mt-1 text-sm text-fg-muted">
            وضعیت عملیات در {data.range} ماه اخیر، نسبت به بازهٔ قبلی.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <CrmRangeFilter range={data.range} labels={{ months: "ماه" }} />
          <Badge
            variant={data.settings.publicReportEnabled ? "default" : "secondary"}
            className="cursor-default"
          >
            گزارش عمومی {data.settings.publicReportEnabled ? "فعال" : "غیرفعال"}
          </Badge>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/crm">
              <Settings2 className="size-4" />
              مدیریت داده
            </Link>
          </Button>
          {data.settings.publicReportEnabled ? (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/report" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
                مشاهده گزارش
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      {!data.hasData ? (
        <CrmEmptyState
          title="هنوز داده‌ای نیست"
          description="از «مدیریت داده» دسته، پروژه و قیف فروش را اضافه کنید — نمودارها خودکار پر می‌شوند."
          className="min-h-56"
        />
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            <Card className="flex items-center justify-center bg-surface/80 py-6">
              <SuccessGauge rate={data.successRate} size={200} label="نرخ موفقیت" />
            </Card>
            <div className="grid gap-4 sm:grid-cols-2">
              <KpiCard title="پروژه‌های تحویل‌شده" delta={data.kpis.delivered} />
              <KpiCard title="درآمد" delta={data.kpis.revenue} currency />
              <KpiCard title="مشتریان جدید" delta={data.kpis.newCustomers} />
              <KpiCard title="پروژه‌های با تأخیر" delta={data.kpis.delayed} invertColors />
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">روند تحویل ماهانه</CardTitle>
              </CardHeader>
              <CardContent>
                <MonthlyTrendChart
                  data={data.monthlyTrend}
                  emptyTitle="در این بازه تحویلی ثبت نشده"
                  labels={{ delivered: "تحویل‌شده", failed: "ناموفق", success: "نرخ موفقیت" }}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">قیف فروش</CardTitle>
              </CardHeader>
              <CardContent>
                <SalesFunnel data={data.funnel} emptyTitle="برای این بازه عدد قیف ثبت نشده" />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">موفقیت بر اساس نوع پروژه</CardTitle>
              </CardHeader>
              <CardContent>
                <SuccessByTypeChart
                  data={data.successByType}
                  locale="fa"
                  emptyTitle="پروژهٔ تکمیل‌شده‌ای بر اساس نوع نیست"
                  successLabel="موفقیت"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">درآمد ماهانه</CardTitle>
              </CardHeader>
              <CardContent>
                <MonthlyRevenueChart
                  data={data.monthlyRevenue}
                  emptyTitle="در این بازه درآمدی ثبت نشده"
                  revenueLabel="درآمد"
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">پروژه‌های فعال</CardTitle>
            </CardHeader>
            <CardContent>
              <ActiveProjectsTable
                projects={data.activeProjects}
                emptyTitle="پروژهٔ فعالی نیست — یا همه تمام شده‌اند یا هنوز ثبت نشده"
                locale="fa"
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
