import { getTranslations } from "next-intl/server";
import { HomeSection, HomeSectionInner } from "@/components/site/home-section";
import { MotionReveal } from "@/components/site/motion";
import { SectionHeader } from "@/components/site/section-header";

const CAPABILITIES = [
  { key: "capabilityEmbedded" },
  { key: "capabilityRobotics" },
  { key: "capabilityFirmware" },
  { key: "capabilityHardware" },
] as const;

export async function CapabilityGrid() {
  const t = await getTranslations("home");

  return (
    <HomeSection variant="capabilities" id="capabilities">
      <HomeSectionInner>
        <MotionReveal>
          <SectionHeader
            eyebrow={t("capabilitiesEyebrow")}
            title={t("capabilitiesTitle")}
            subtitle={t("capabilitiesSubtitle")}
          />
        </MotionReveal>

        <div className="relative z-10 grid gap-8 sm:grid-cols-2">
          {CAPABILITIES.map(({ key }, i) => (
            <MotionReveal key={key} delay={0.05 * i}>
              <article className="group relative border-s-2 border-transparent ps-5 transition-[padding] duration-200 [border-image:linear-gradient(to_bottom,var(--color-accent),var(--color-signal))_1] hover:ps-6">
                <h3 className="font-display text-base font-semibold text-fg transition-colors duration-200 group-hover:text-accent">
                  {t(`${key}`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{t(`${key}Desc`)}</p>
              </article>
            </MotionReveal>
          ))}
        </div>
      </HomeSectionInner>
    </HomeSection>
  );
}
