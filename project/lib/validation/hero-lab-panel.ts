import { z } from "zod";

export const heroLabPanelRowSchema = z.object({
  labelEn: z.string().trim().min(1).max(80),
  labelFa: z.string().trim().min(1).max(80),
  detailEn: z.string().trim().min(1).max(120),
  detailFa: z.string().trim().min(1).max(120),
  led: z.enum(["accent", "signal"]),
});

export const heroLabPanelSchema = z.object({
  panelTitleEn: z.string().trim().min(1).max(80),
  panelTitleFa: z.string().trim().min(1).max(80),
  rows: z.array(heroLabPanelRowSchema).min(1).max(8),
});

export type HeroLabPanelData = z.infer<typeof heroLabPanelSchema>;
export type HeroLabPanelRow = z.infer<typeof heroLabPanelRowSchema>;
