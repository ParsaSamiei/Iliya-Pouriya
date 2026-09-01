import { ContactSettingsEditor } from "@/components/admin/contact-settings-editor";
import { HeroLabPanelEditor } from "@/components/admin/hero-lab-panel-editor";
import { SettingField } from "@/components/admin/setting-field";
import {
  CONTACT_SETTINGS_KEY,
  DEFAULT_CONTACT_SETTINGS,
  parseContactSettings,
} from "@/lib/contact-settings";
import {
  DEFAULT_HERO_LAB_PANEL,
  HERO_LAB_PANEL_KEY,
  parseHeroLabPanel,
} from "@/lib/hero-lab-panel";
import { db } from "@/lib/db";

const KEYS = [
  { key: "homepage_tagline", label: "Homepage tagline" },
  { key: "about_page_copy", label: "About page copy" },
  { key: "contact_page_copy", label: "Contact page copy" },
] as const;

export default async function AdminSettingsPage() {
  const [settings, heroLabSetting, contactSetting] = await Promise.all([
    db.siteSetting.findMany({
      where: { key: { in: KEYS.map((k) => k.key) } },
    }),
    db.siteSetting.findUnique({ where: { key: HERO_LAB_PANEL_KEY } }),
    db.siteSetting.findUnique({ where: { key: CONTACT_SETTINGS_KEY } }),
  ]);

  const byKey = new Map(settings.map((s) => [s.key, s] as const));
  const heroLabPanel = heroLabSetting?.valueEn
    ? parseHeroLabPanel(heroLabSetting.valueEn)
    : DEFAULT_HERO_LAB_PANEL;
  const contactSettings = contactSetting?.valueEn
    ? parseContactSettings(contactSetting.valueEn)
    : DEFAULT_CONTACT_SETTINGS;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Settings</h1>
      <p className="text-sm text-fg-muted">
        Global content that isn&apos;t tied to a single project, post, or person — see
        docs/05_DATABASE.md&apos;s <code className="font-mono">site_settings</code>.
      </p>

      <HeroLabPanelEditor initial={heroLabPanel} />

      <ContactSettingsEditor initial={contactSettings} />

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
  );
}
