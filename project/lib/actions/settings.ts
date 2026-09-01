"use server";

import { revalidatePath } from "next/cache";
import { CONTACT_SETTINGS_KEY } from "@/lib/contact-settings";
import { HERO_LAB_PANEL_KEY } from "@/lib/hero-lab-panel";
import { db } from "@/lib/db";
import {
  type ContactSettingsData,
  contactSettingsSchema,
} from "@/lib/validation/contact-settings";
import {
  type HeroLabPanelData,
  heroLabPanelSchema,
} from "@/lib/validation/hero-lab-panel";

export async function updateSiteSetting(key: string, valueEn: string, valueFa: string) {
  await db.siteSetting.upsert({
    where: { key },
    update: { valueEn, valueFa },
    create: { key, valueEn, valueFa },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/[locale]/about", "page");
  revalidatePath("/[locale]", "page");
  return { ok: true } as const;
}

export async function updateHeroLabPanel(data: HeroLabPanelData) {
  const parsed = heroLabPanelSchema.parse(data);

  await db.siteSetting.upsert({
    where: { key: HERO_LAB_PANEL_KEY },
    update: { valueEn: parsed, valueFa: parsed },
    create: { key: HERO_LAB_PANEL_KEY, valueEn: parsed, valueFa: parsed },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/[locale]", "page");
  return { ok: true } as const;
}

export async function updateContactSettings(data: ContactSettingsData) {
  const parsed = contactSettingsSchema.parse(data);
  const normalized = {
    ...parsed,
    phones: parsed.phones.map((p) => p.trim()).filter(Boolean),
    emails: parsed.emails.map((e) => e.trim()).filter(Boolean),
  };

  await db.siteSetting.upsert({
    where: { key: CONTACT_SETTINGS_KEY },
    update: { valueEn: normalized, valueFa: normalized },
    create: { key: CONTACT_SETTINGS_KEY, valueEn: normalized, valueFa: normalized },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/[locale]", "layout");
  return { ok: true } as const;
}
