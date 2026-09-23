import { ArrowRight } from "lucide-react";
import { HomeHeroAtmosphere } from "@/components/site/home-hero-atmosphere";
import { HomeHeroMotion, HomeHeroScrollCue } from "@/components/site/home-hero-motion";
import { HomeSection, HomeSectionInner } from "@/components/site/home-section";
import { SiteLogo } from "@/components/site/site-logo";
import { SmoothHashLink } from "@/components/site/smooth-hash-link";
import { Button } from "@/components/ui/button";
import type { LandingCopyView } from "@/lib/landing-copy";

export async function HomeHero({
  copy,
  siteName,
}: {
  copy: LandingCopyView;
  siteName: string;
}) {
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
                label={siteName}
                className="hero-logo-mark relative z-10 size-32 sm:size-40 lg:size-[11rem]"
              />
            </div>
          }
          nameA={
            <p className="hero-name hero-name--a font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              {copy.heroNameA}
            </p>
          }
          nameB={
            <p className="hero-name hero-name--b font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              {copy.heroNameB}
            </p>
          }
          title={
            <h1 className="max-w-2xl text-start font-display text-xl font-semibold leading-snug text-pretty text-fg sm:text-2xl lg:text-[1.85rem]">
              {copy.heroTitle}
            </h1>
          }
          subtitle={
            <p className="max-w-xl text-start text-base leading-relaxed text-fg-muted sm:text-lg">
              {copy.heroSubtitle}
            </p>
          }
          actions={
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className="btn-motion">
                <SmoothHashLink href="#projects">
                  {copy.ctaViewProjects}
                  <ArrowRight data-icon="inline-end" className="landing-arrow" />
                </SmoothHashLink>
              </Button>
              <Button asChild size="lg" variant="outline" className="btn-motion">
                <SmoothHashLink href="#team">{copy.ctaMeetTeam}</SmoothHashLink>
              </Button>
            </div>
          }
        />
      </HomeSectionInner>

      <HomeHeroScrollCue href="#projects" label={copy.ctaViewProjects} />
    </HomeSection>
  );
}
