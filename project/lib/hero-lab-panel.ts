import type { HeroLabPanelData } from "@/lib/validation/hero-lab-panel";
import { heroLabPanelSchema } from "@/lib/validation/hero-lab-panel";

export const HERO_LAB_PANEL_KEY = "hero_lab_panel";

export const DEFAULT_HERO_LAB_PANEL: HeroLabPanelData = {
  panelTitleEn: "Lab systems",
  panelTitleFa: "سیستم‌های آزمایشگاه",
  rows: [
    {
      labelEn: "Embedded",
      labelFa: "سیستم‌های نهفته",
      detailEn: "bare-metal · RTOS · MCU",
      detailFa: "bare-metal · RTOS · MCU",
      led: "accent",
    },
    {
      labelEn: "Controls",
      labelFa: "کنترل",
      detailEn: "closed-loop · real-time",
      detailFa: "closed-loop · real-time",
      led: "signal",
    },
    {
      labelEn: "Firmware",
      labelFa: "فریمور",
      detailEn: "drivers · protocols · OTA",
      detailFa: "درایور · پروتکل · OTA",
      led: "accent",
    },
    {
      labelEn: "Hardware",
      labelFa: "سخت‌افزار",
      detailEn: "schematic · PCB · bring-up",
      detailFa: "شماتیک · PCB · bring-up",
      led: "signal",
    },
  ],
};

export type HeroLabPanelView = {
  panelTitle: string;
  rows: Array<{ label: string; detail: string; led: "accent" | "signal" }>;
};

export function parseHeroLabPanel(value: unknown): HeroLabPanelData {
  const result = heroLabPanelSchema.safeParse(value);
  return result.success ? result.data : DEFAULT_HERO_LAB_PANEL;
}

export function resolveHeroLabPanel(data: HeroLabPanelData, locale: string): HeroLabPanelView {
  const isFa = locale === "fa";
  return {
    panelTitle: isFa ? data.panelTitleFa : data.panelTitleEn,
    rows: data.rows.map((row) => ({
      label: isFa ? row.labelFa : row.labelEn,
      detail: isFa ? row.detailFa : row.detailEn,
      led: row.led,
    })),
  };
}
