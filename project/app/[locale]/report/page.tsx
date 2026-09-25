import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { PublicReportView } from "@/components/crm/public-report";
import { getPublicCrmReport } from "@/lib/crm/analytics";
import { parseCrmRange } from "@/lib/crm/types";
import { getSiteMetadata } from "@/lib/get-site-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "report" });
  const site = await getSiteMetadata(locale);
  return {
    title: t("title"),
    description: t("subtitle"),
    openGraph: {
      title: `${t("title")} — ${site.name}`,
      description: t("subtitle"),
    },
  };
}

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { range: rangeRaw } = await searchParams;
  const range = parseCrmRange(rangeRaw);
  const [data, t] = await Promise.all([
    getPublicCrmReport(range, locale === "en" ? "en" : "fa"),
    getTranslations("report"),
  ]);

  const copy = {
    title: t("title"),
    subtitle: t("subtitle"),
    disabledTitle: t("disabledTitle"),
    disabledBody: t("disabledBody"),
    emptyTitle: t("emptyTitle"),
    emptyBody: t("emptyBody"),
    successRate: t("successRate"),
    satisfaction: t("satisfaction"),
    onTime: t("onTime"),
    monthlyTitle: t("monthlyTitle"),
    shareTitle: t("shareTitle"),
    samplesTitle: t("samplesTitle"),
    months: t("months"),
    noChart: t("noChart"),
    noSamples: t("noSamples"),
  };

  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-fg-muted">{t("loading")}</div>}>
      <PublicReportView data={data} locale={locale === "fa" ? "fa" : "en"} copy={copy} />
    </Suspense>
  );
}
