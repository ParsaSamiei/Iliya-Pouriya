"use client";

import { CategoryShareChart, PublicDeliveryChart } from "@/components/crm/charts";
import { CrmEmptyState } from "@/components/crm/empty-state";
import { CrmRangeFilter } from "@/components/crm/range-filter";
import { SuccessGauge } from "@/components/crm/success-gauge";
import { MediaImage } from "@/components/media-image";
import { MotionItem, MotionReveal, MotionStaggerInView } from "@/components/site/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicCrmReport } from "@/lib/crm/types";
import { Quote } from "lucide-react";

export function PublicReportView({
  data,
  locale,
  copy,
}: {
  data: PublicCrmReport;
  locale: "en" | "fa";
  copy: {
    title: string;
    subtitle: string;
    disabledTitle: string;
    disabledBody: string;
    emptyTitle: string;
    emptyBody: string;
    successRate: string;
    satisfaction: string;
    onTime: string;
    monthlyTitle: string;
    shareTitle: string;
    samplesTitle: string;
    months: string;
    noChart: string;
    noSamples: string;
  };
}) {
  const isFa = locale === "fa";

  if (!data.enabled) {
    return (
      <CrmEmptyState
        title={copy.disabledTitle}
        description={copy.disabledBody}
        className="mx-auto mt-16 max-w-lg min-h-64"
      />
    );
  }

  if (!data.hasData) {
    return (
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-16">
        <header className="text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {copy.title}
          </h1>
          <p className="mt-3 text-fg-muted">{copy.subtitle}</p>
        </header>
        <CrmEmptyState title={copy.emptyTitle} description={copy.emptyBody} className="min-h-48" />
      </div>
    );
  }

  const shareRows = data.shareByCategory.map((c) => ({
    name: isFa ? c.nameFa : c.nameEn,
    count: c.count,
    sharePercent: c.sharePercent,
  }));

  return (
    <div className="mx-auto max-w-5xl space-y-14 px-4 py-12 sm:px-6 sm:py-16">
      <MotionReveal>
        <header className="flex flex-col items-center gap-6 text-center">
          <div className="space-y-3">
            <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
              {copy.title}
            </p>
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              {copy.subtitle}
            </h1>
          </div>
          <CrmRangeFilter range={data.range} labels={{ months: copy.months }} />
        </header>
      </MotionReveal>

      <MotionReveal>
        <section className="grid items-center gap-8 rounded-[var(--radius-lg)] border border-border bg-surface/70 p-6 sm:p-10 lg:grid-cols-[1fr_auto_1fr]">
          <div className="order-2 space-y-6 text-center lg:order-1 lg:text-start">
            <StatBlock
              label={copy.satisfaction}
              value={data.customerSatisfaction}
              empty="—"
            />
          </div>
          <div className="order-1 flex justify-center lg:order-2">
            <SuccessGauge
              rate={{
                value: data.successRate ?? 0,
                previous: data.successRate ?? 0,
                changePercent: null,
              }}
              label={copy.successRate}
              size={220}
            />
          </div>
          <div className="order-3 space-y-6 text-center lg:text-end">
            <StatBlock label={copy.onTime} value={data.onTimeDelivery} empty="—" />
          </div>
        </section>
      </MotionReveal>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{copy.monthlyTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <PublicDeliveryChart data={data.monthlyDeliveries} emptyTitle={copy.noChart} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{copy.shareTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryShareChart
              data={shareRows}
              emptyTitle={copy.noChart}
              projectsLabel={isFa ? "پروژه" : "Projects"}
              rtl={isFa}
            />
          </CardContent>
        </Card>
      </div>

      <section className="space-y-6">
        <h2 className="font-display text-xl font-semibold">{copy.samplesTitle}</h2>
        {data.samples.length === 0 ? (
          <CrmEmptyState title={copy.noSamples} />
        ) : (
          <MotionStaggerInView className="grid gap-5 sm:grid-cols-2">
            {data.samples.map((sample) => {
              const name = isFa ? sample.nameFa : sample.nameEn;
              const quote = isFa ? sample.quoteFa : sample.quoteEn;
              const client = isFa ? sample.clientNameFa : sample.clientNameEn;
              return (
                <MotionItem key={sample.id}>
                  <article className="flex h-full flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-surface/60 p-5">
                    <div className="flex items-start gap-4">
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-surface-raised">
                        {sample.coverImageUrl ? (
                          <MediaImage
                            src={sample.coverImageUrl}
                            alt={name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center bg-gradient-to-br from-[var(--material-wash-a)] to-[var(--material-wash-b)]">
                            <Quote className="size-5 text-accent" aria-hidden />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display text-base font-semibold leading-snug">{name}</h3>
                        <p className="mt-0.5 text-xs text-fg-muted">{client}</p>
                      </div>
                    </div>
                    {quote ? (
                      <blockquote className="border-s-2 border-accent/50 ps-3 text-sm leading-relaxed text-fg-muted">
                        “{quote}”
                      </blockquote>
                    ) : null}
                  </article>
                </MotionItem>
              );
            })}
          </MotionStaggerInView>
        )}
      </section>
    </div>
  );
}

function StatBlock({
  label,
  value,
  empty,
}: {
  label: string;
  value: number | null;
  empty: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-fg-muted uppercase">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl">
        {value == null ? empty : `${value.toFixed(0)}%`}
      </p>
    </div>
  );
}
