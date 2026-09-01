import { Bot, Cpu, Layers, Zap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { HomeSection, HomeSectionInner } from "@/components/site/home-section";
import { SectionHeader } from "@/components/site/section-header";

const CAPABILITIES = [
  { key: "capabilityEmbedded", icon: Cpu, channel: "01" },
  { key: "capabilityRobotics", icon: Bot, channel: "02" },
  { key: "capabilityFirmware", icon: Zap, channel: "03" },
  { key: "capabilityHardware", icon: Layers, channel: "04" },
] as const;

export async function CapabilityGrid() {
  const t = await getTranslations("home");

  return (
    <HomeSection variant="capabilities" id="capabilities" channel="CAP">
      <HomeSectionInner>
        <SectionHeader
          eyebrow={t("capabilitiesEyebrow")}
          title={t("capabilitiesTitle")}
          subtitle={t("capabilitiesSubtitle")}
        />

        <div className="relative z-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map(({ key, icon: Icon, channel }) => (
            <article
              key={key}
              className="panel-module group cursor-default p-5 transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-px hover:border-accent/25 hover:shadow-[0_4px_14px_color-mix(in_srgb,var(--color-bg)_75%,transparent),0_0_10px_color-mix(in_srgb,var(--color-accent)_6%,transparent)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-10 items-center justify-center border border-border bg-bg font-mono text-[10px] text-fg-muted transition-[border-color,color] duration-300 group-hover:border-accent/40 group-hover:text-accent">
                  {channel}
                </div>
                <Icon
                  className="size-5 shrink-0 text-signal/80 transition-[translate,color] duration-300 group-hover:translate-x-px group-hover:text-signal rtl:group-hover:-translate-x-px"
                  aria-hidden
                />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-fg transition-colors duration-300 group-hover:text-accent">
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
