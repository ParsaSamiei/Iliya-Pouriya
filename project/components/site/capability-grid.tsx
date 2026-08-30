import { Bot, Cpu, Layers, Zap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { HomeSection, HomeSectionInner } from "@/components/site/home-section";
import { SectionHeader } from "@/components/site/section-header";

const CAPABILITIES = [
  { key: "capabilityEmbedded", icon: Cpu },
  { key: "capabilityRobotics", icon: Bot },
  { key: "capabilityFirmware", icon: Zap },
  { key: "capabilityHardware", icon: Layers },
] as const;

export async function CapabilityGrid() {
  const t = await getTranslations("home");

  return (
    <HomeSection variant="capabilities" id="capabilities" index="02">
      <HomeSectionInner>
        <SectionHeader
          eyebrow={t("capabilitiesEyebrow")}
          title={t("capabilitiesTitle")}
          subtitle={t("capabilitiesSubtitle")}
        />

        <div className="relative z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map(({ key, icon: Icon }) => (
            <article
              key={key}
              className="group cursor-default border border-border bg-bg/60 p-5 backdrop-blur-sm transition-colors duration-200 hover:border-accent/60 hover:bg-bg/80"
            >
              <div className="flex size-10 items-center justify-center border border-border bg-surface transition-colors duration-200 group-hover:border-accent/40">
                <Icon className="size-5 text-accent" aria-hidden />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-fg">
                {t(`${key}`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{t(`${key}Desc`)}</p>
            </article>
          ))}
        </div>
      </HomeSectionInner>
    </HomeSection>
  );
}
