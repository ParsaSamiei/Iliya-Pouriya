import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { HomeHeroAtmosphere } from "@/components/site/home-hero-atmosphere";
import { HomeHeroMotion } from "@/components/site/home-hero-motion";
import { HomeSection, HomeSectionInner } from "@/components/site/home-section";
import { SiteLogo } from "@/components/site/site-logo";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export async function HomeHero() {
  const t = await getTranslations("home");
  const tSite = await getTranslations("site");

  return (
    <HomeSection variant="hero">
      <HomeHeroAtmosphere />

      <HomeSectionInner hero className="relative z-10">
        <HomeHeroMotion
          logo={
            <div className="hero-logo-stage">
              <span className="hero-logo-halo" aria-hidden />
              <SiteLogo
                size="hero"
                priority
                labeled
                label={tSite("name")}
                className="hero-logo-mark relative z-10 size-32 sm:size-40 lg:size-[11rem]"
              />
            </div>
          }
          lockup={
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6">
              <p className="hero-name hero-name--a font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                {t("heroNameA")}
              </p>
              <span className="hero-seam" aria-hidden />
              <p className="hero-name hero-name--b font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                {t("heroNameB")}
              </p>
            </div>
          }
          title={
            <h1 className="max-w-2xl text-start font-display text-xl font-semibold leading-snug text-pretty text-fg sm:text-2xl lg:text-[1.85rem]">
              {t("heroTitle")}
            </h1>
          }
          subtitle={
            <p className="max-w-xl text-start text-base leading-relaxed text-fg-muted sm:text-lg">
              {t("heroSubtitle")}
            </p>
          }
          actions={
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className="btn-motion">
                <Link href="/projects">
                  {t("ctaViewProjects")}
                  <ArrowRight data-icon="inline-end" className="landing-arrow" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="btn-motion">
                <a href="#team">{t("ctaMeetTeam")}</a>
              </Button>
            </div>
          }
        />
      </HomeSectionInner>

      <div className="hero-scroll-cue" aria-hidden>
        <span className="hero-scroll-cue__line" />
      </div>
    </HomeSection>
  );
}
