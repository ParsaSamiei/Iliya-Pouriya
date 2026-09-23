import { HomeSection, HomeSectionInner } from "@/components/site/home-section";
import {
  MotionItem,
  MotionReveal,
  MotionStaggerInView,
} from "@/components/site/motion";
import { SectionHeader } from "@/components/site/section-header";
import type { LandingCopyView } from "@/lib/landing-copy";

export function CapabilityGrid({ copy }: { copy: LandingCopyView }) {
  return (
    <HomeSection variant="capabilities" id="capabilities">
      <HomeSectionInner>
        <MotionReveal>
          <SectionHeader
            eyebrow={copy.capabilitiesEyebrow}
            title={copy.capabilitiesTitle}
            subtitle={copy.capabilitiesSubtitle}
          />
        </MotionReveal>

        <MotionStaggerInView className="relative z-10 grid gap-8 sm:grid-cols-2" stagger={0.08}>
          {copy.capabilities.map((item, index) => (
            <MotionItem key={`${item.title}-${index}`}>
              <article className="group relative border-s-2 border-transparent ps-5 transition-[padding] duration-200 [border-image:linear-gradient(to_bottom,var(--color-accent),var(--color-signal))_1] hover:ps-6">
                <h3 className="font-display text-base font-semibold text-fg transition-colors duration-200 group-hover:text-accent">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.desc}</p>
              </article>
            </MotionItem>
          ))}
        </MotionStaggerInView>
      </HomeSectionInner>
    </HomeSection>
  );
}
