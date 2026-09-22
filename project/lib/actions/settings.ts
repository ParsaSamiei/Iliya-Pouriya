"use server";

import { revalidatePath } from "next/cache";
import { CONTACT_SETTINGS_KEY } from "@/lib/contact-settings";
import { LANDING_COPY_KEY } from "@/lib/landing-copy";
import { db } from "@/lib/db";
import { SITE_METADATA_KEY } from "@/lib/site-metadata";
import { SOCIAL_CHANNELS } from "@/lib/social-channels";
import {
  type ContactSettingsData,
  contactSettingsSchema,
} from "@/lib/validation/contact-settings";
import {
  type LandingCopyData,
  landingCopySchema,
} from "@/lib/validation/landing-copy";
import {
  type SiteMetadataData,
  siteMetadataSchema,
} from "@/lib/validation/site-metadata";

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

export async function updateLandingCopy(data: LandingCopyData) {
  const parsed = landingCopySchema.parse(data);

  await db.siteSetting.upsert({
    where: { key: LANDING_COPY_KEY },
    update: { valueEn: parsed, valueFa: parsed },
    create: { key: LANDING_COPY_KEY, valueEn: parsed, valueFa: parsed },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/[locale]", "page");
  return { ok: true } as const;
}

export async function updateSiteMetadata(data: SiteMetadataData) {
  const parsed = siteMetadataSchema.parse(data);

  await db.siteSetting.upsert({
    where: { key: SITE_METADATA_KEY },
    update: { valueEn: parsed, valueFa: parsed },
    create: { key: SITE_METADATA_KEY, valueEn: parsed, valueFa: parsed },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/[locale]", "layout");
  revalidatePath("/", "layout");
  return { ok: true } as const;
}

export async function updateContactSettings(data: ContactSettingsData) {
  const parsed = contactSettingsSchema.parse(data);
  const socialUrls = Object.fromEntries(
    SOCIAL_CHANNELS.map((channel) => [channel.field, parsed[channel.field].trim()]),
  );
  const normalized = {
    ...parsed,
    phones: parsed.phones.map((p) => p.trim()).filter(Boolean),
    emails: parsed.emails.map((e) => e.trim()).filter(Boolean),
    ...socialUrls,
  };

  await db.siteSetting.upsert({
    where: { key: CONTACT_SETTINGS_KEY },
    update: { valueEn: normalized, valueFa: normalized },
    create: { key: CONTACT_SETTINGS_KEY, valueEn: normalized, valueFa: normalized },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/[locale]", "layout");
  revalidatePath("/[locale]/contact", "page");
  return { ok: true } as const;
}
