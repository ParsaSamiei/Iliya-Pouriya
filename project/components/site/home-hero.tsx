import { ArrowRight, Cpu } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { HomeSection, HomeSectionInner } from "@/components/site/home-section";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type HomeHeroProps = {
  projectCount: number;
  engineerCount: number;
};

export async function HomeHero({ projectCount, engineerCount }: HomeHeroProps) {
  const t = await getTranslations("home");

  return (
    <HomeSection variant="hero" index="01" className="flex flex-col">
      {/* Schematic corner marks */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-8 z-0 mx-auto hidden h-32 max-w-6xl px-4 sm:block"
      >
        <span className="absolute inset-s-4 top-0 block size-8 border-s-2 border-t-2 border-accent/40" />
        <span className="absolute inset-e-4 top-0 block size-8 border-e-2 border-t-2 border-accent/40" />
      </div>

      <HomeSectionInner hero>
        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
        <div className="hero-copy relative z-10 min-w-0">
          <p className="font-mono text-xs text-accent rtl:normal-case">
            {t("heroEyebrow")}
          </p>
          <h1 className="mt-4 text-start font-display text-4xl font-semibold leading-relaxed tracking-normal text-pretty text-fg sm:text-5xl lg:text-6xl lg:leading-[1.2]">
            {t("heroTitle")}
          </h1>
          <p className="mt-6 text-justify text-lg leading-relaxed tracking-normal text-fg-muted [text-align-last:start]">
            {t("heroSubtitle")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="cursor-pointer">
              <Link href="/projects">
                {t("ctaViewProjects")}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="cursor-pointer">
              <Link href="/contact">{t("ctaContact")}</Link>
            </Button>
          </div>

          <dl className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div>
              <dt className="font-mono text-xs tracking-wide text-fg-muted uppercase rtl:normal-case rtl:tracking-normal">
                {t("statProjects")}
              </dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-fg">
                {String(projectCount).padStart(2, "0")}
              </dd>
            </div>
            <div className="hidden h-8 w-px bg-border sm:block" aria-hidden />
            <div>
              <dt className="font-mono text-xs tracking-wide text-fg-muted uppercase rtl:normal-case rtl:tracking-normal">
                {t("statEngineers")}
              </dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-fg">
                {String(engineerCount).padStart(2, "0")}
              </dd>
            </div>
          </dl>
        </div>

        <aside
          className="relative z-10 hidden w-72 shrink-0 border border-border bg-surface/90 p-5 shadow-[0_0_0_1px_var(--color-border)] backdrop-blur-sm lg:block"
          aria-label={t("heroStatus")}
        >
          <div className="flex items-center justify-between gap-3 border-b border-border pb-3 font-mono text-xs">
            <span className="min-w-0 text-fg-muted">{t("heroStatus")}</span>
            <span className="flex shrink-0 items-center gap-1.5 text-success">
              <span className="size-1.5 rounded-full bg-success" aria-hidden />
              {t("heroStatusOnline")}
            </span>
          </div>

          <div className="mt-4 space-y-3 font-mono text-xs text-fg-muted">
            <div className="flex items-start gap-2">
              <Cpu className="mt-0.5 size-3.5 shrink-0 text-accent" aria-hidden />
              <p className="min-w-0 leading-relaxed">{t("heroReadout")}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
              <div className="min-w-0">
                <p className="text-[10px] tracking-wide uppercase rtl:normal-case rtl:tracking-normal">
                  {t("statProjects")}
                </p>
                <p className="mt-0.5 text-sm text-fg">{projectCount}</p>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] tracking-wide uppercase rtl:normal-case rtl:tracking-normal">
                  {t("statEngineers")}
                </p>
                <p className="mt-0.5 text-sm text-fg">{engineerCount}</p>
              </div>
            </div>
          </div>
        </aside>
        </div>
      </HomeSectionInner>
    </HomeSection>
  );
}
