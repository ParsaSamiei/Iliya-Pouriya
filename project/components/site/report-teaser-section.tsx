import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { HomeSection, HomeSectionInner } from "@/components/site/home-section";
import { MotionReveal } from "@/components/site/motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { PublicReportTeaser } from "@/lib/crm/public";

function Stat({ label, value }: { label: string; value: number | null }) {
  if (value == null) return null;
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium tracking-wide text-fg-muted uppercase">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold tabular-nums tracking-tight">
        {value.toFixed(0)}
        <span className="text-lg text-fg-muted">%</span>
      </p>
    </div>
  );
}

export async function ReportTeaserSection({ teaser }: { teaser: PublicReportTeaser }) {
  const t = await getTranslations("report");
  const stats = [
    { label: t("successRate"), value: teaser.successRate },
    { label: t("satisfaction"), value: teaser.customerSatisfaction },
    { label: t("onTime"), value: teaser.onTimeDelivery },
  ].filter((s) => s.value != null);

  if (stats.length === 0) return null;

  return (
    <HomeSection variant="recommendations" id="report">
      <HomeSectionInner>
        <MotionReveal>
          <div className="relative z-10 flex flex-col gap-8 rounded-[var(--radius-lg)] border border-border bg-surface/70 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-md">
              {/* <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
                {t("teaserEyebrow")}
              </p> */}
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {t("teaserTitle")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{t("teaserBody")}</p>
            </div>

            <div className="flex flex-1 flex-col gap-6 sm:flex-row sm:items-end sm:justify-end lg:max-w-xl">
              <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
                {stats.map((s) => (
                  <Stat key={s.label} label={s.label} value={s.value} />
                ))}
              </div>
              <Button asChild className="btn-motion shrink-0">
                <Link href="/report">
                  {t("teaserCta")}
                  <ArrowRight data-icon="inline-end" className="landing-arrow" />
                </Link>
              </Button>
            </div>
          </div>
        </MotionReveal>
      </HomeSectionInner>
    </HomeSection>
  );
}
