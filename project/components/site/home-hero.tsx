import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { HeroInstrumentPanel } from "@/components/site/hero-instrument-panel";
import { HomeSection, HomeSectionInner } from "@/components/site/home-section";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  DEFAULT_HERO_LAB_PANEL,
  HERO_LAB_PANEL_KEY,
  parseHeroLabPanel,
  resolveHeroLabPanel,
} from "@/lib/hero-lab-panel";
import { db } from "@/lib/db";

type HomeHeroProps = {
  projectCount: number;
  engineerCount: number;
};

export async function HomeHero({ projectCount, engineerCount }: HomeHeroProps) {
  const locale = await getLocale();
  const t = await getTranslations("home");

  const setting = await db.siteSetting
    .findUnique({ where: { key: HERO_LAB_PANEL_KEY } })
    .catch(() => null);
  const labPanelData = setting?.valueEn
    ? parseHeroLabPanel(setting.valueEn)
    : DEFAULT_HERO_LAB_PANEL;
  const labPanel = resolveHeroLabPanel(labPanelData, locale);

  return (
    <HomeSection variant="hero" channel="SYS">
      <HomeSectionInner hero>
        <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div className="hero-copy relative z-10 min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="led" aria-hidden />
              <p className="font-mono text-[11px] tracking-wide text-accent uppercase">
                {t("heroEyebrow")}
              </p>
            </div>

            <h1 className="mt-5 text-start font-display text-4xl font-semibold leading-[1.15] text-pretty text-fg sm:text-5xl lg:text-[3.25rem]">
              {t("heroTitle")}
            </h1>

            <p className="mt-6 max-w-xl text-start text-lg leading-relaxed text-fg-muted">
              {t("heroSubtitle")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className="btn-motion">
                <Link href="/projects">
                  {t("ctaViewProjects")}
                  <ArrowRight data-icon="inline-end" className="landing-arrow" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">{t("ctaContact")}</Link>
              </Button>
            </div>

            <dl className="mt-10 flex flex-wrap items-stretch gap-3 sm:gap-4">
              <div className="panel-readout min-w-[7rem] flex-1 px-4 py-3 sm:flex-none">
                <dt className="font-mono text-[10px] tracking-wide text-fg-muted uppercase">
                  {t("statProjects")}
                </dt>
                <dd className="mt-1 font-display text-3xl font-semibold tabular-nums text-accent">
                  {String(projectCount).padStart(2, "0")}
                </dd>
              </div>
              <div className="panel-readout min-w-[7rem] flex-1 px-4 py-3 sm:flex-none">
                <dt className="font-mono text-[10px] tracking-wide text-fg-muted uppercase">
                  {t("statEngineers")}
                </dt>
                <dd className="mt-1 font-display text-3xl font-semibold tabular-nums text-signal">
                  {String(engineerCount).padStart(2, "0")}
                </dd>
              </div>
            </dl>
          </div>

          <HeroInstrumentPanel
            projectCount={projectCount}
            engineerCount={engineerCount}
            labPanel={labPanel}
          />
        </div>
      </HomeSectionInner>
    </HomeSection>
  );
}
