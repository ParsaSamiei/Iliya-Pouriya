import type { Metadata } from "next";
import { ContactSettingsEditor } from "@/components/admin/contact-settings-editor";
import { LandingCopyEditor } from "@/components/admin/landing-copy-editor";
import { SettingField } from "@/components/admin/setting-field";
import { SiteMetadataEditor } from "@/components/admin/site-metadata-editor";
import {
  CONTACT_SETTINGS_KEY,
  DEFAULT_CONTACT_SETTINGS,
  parseContactSettings,
} from "@/lib/contact-settings";
import {
  DEFAULT_LANDING_COPY,
  LANDING_COPY_KEY,
  parseLandingCopy,
} from "@/lib/landing-copy";
import { db } from "@/lib/db";
import {
  DEFAULT_SITE_METADATA,
  SITE_METADATA_KEY,
  parseSiteMetadata,
} from "@/lib/site-metadata";

export const metadata: Metadata = {
  title: "Settings",
};

const KEYS = [
  { key: "about_page_copy", label: "About page copy" },
  { key: "contact_page_copy", label: "Contact page copy" },
] as const;

export default async function AdminSettingsPage() {
  const [settings, landingSetting, contactSetting, siteMetadataSetting] = await Promise.all([
    db.siteSetting.findMany({
      where: { key: { in: KEYS.map((k) => k.key) } },
    }),
    db.siteSetting.findUnique({ where: { key: LANDING_COPY_KEY } }),
    db.siteSetting.findUnique({ where: { key: CONTACT_SETTINGS_KEY } }),
    db.siteSetting.findUnique({ where: { key: SITE_METADATA_KEY } }),
  ]);

  const byKey = new Map(settings.map((s) => [s.key, s] as const));
  const landingCopy = landingSetting?.valueEn
    ? parseLandingCopy(landingSetting.valueEn)
    : DEFAULT_LANDING_COPY;
  const contactSettings = contactSetting?.valueEn
    ? parseContactSettings(contactSetting.valueEn)
    : DEFAULT_CONTACT_SETTINGS;
  const siteMetadata = siteMetadataSetting?.valueEn
    ? parseSiteMetadata(siteMetadataSetting.valueEn)
    : DEFAULT_SITE_METADATA;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Global content that isn&apos;t tied to a single project, post, or person.
        </p>
      </div>

      <SiteMetadataEditor initial={siteMetadata} />

      <LandingCopyEditor initial={landingCopy} />

      <ContactSettingsEditor initial={contactSettings} />

      <div className="space-y-6">
        <div>
          <h2 className="font-display text-lg font-semibold">Other pages</h2>
          <p className="mt-1 text-sm text-fg-muted">
            Copy for About and Contact pages (not the homepage).
          </p>
        </div>
        {KEYS.map(({ key, label }) => {
          const setting = byKey.get(key);
          return (
            <SettingField
              key={key}
              settingKey={key}
              label={label}
              valueEn={(setting?.valueEn as string | undefined) ?? ""}
              valueFa={(setting?.valueFa as string | undefined) ?? ""}
            />
          );
        })}
      </div>
    </div>
  );
}
