"use client";

import { ArrowRight, Mail } from "lucide-react";
import { HomeSection, HomeSectionInner } from "@/components/site/home-section";
import { MotionItem, MotionStaggerInView } from "@/components/site/motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type HomeContactCtaProps = {
  title: string;
  subtitle: string;
  cta: string;
};

export function HomeContactCta({ title, subtitle, cta }: HomeContactCtaProps) {
  return (
    <HomeSection variant="contact" id="contact">
      <HomeSectionInner tight>
        <MotionStaggerInView
          className="relative z-10 flex flex-col items-start gap-6 border-s-2 border-transparent ps-6 [border-image:linear-gradient(to_bottom,var(--color-accent),var(--color-signal))_1] sm:flex-row sm:items-center sm:justify-between sm:ps-8"
          stagger={0.1}
          delayChildren={0.06}
        >
          <MotionItem className="max-w-xl">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl lg:text-[2rem]">
              {title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-fg-muted">{subtitle}</p>
          </MotionItem>
          <MotionItem>
            <Button asChild size="lg" className="btn-motion shrink-0">
              <Link href="/contact">
                <Mail data-icon="inline-start" aria-hidden />
                {cta}
                <ArrowRight data-icon="inline-end" className="landing-arrow" aria-hidden />
              </Link>
            </Button>
          </MotionItem>
        </MotionStaggerInView>
      </HomeSectionInner>
    </HomeSection>
  );
}
