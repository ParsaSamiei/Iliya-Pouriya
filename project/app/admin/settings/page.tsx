import { SettingField } from "@/components/admin/setting-field";
import { db } from "@/lib/db";

const KEYS = [
  { key: "homepage_tagline", label: "Homepage tagline" },
  { key: "about_page_copy", label: "About page copy" },
  { key: "contact_page_copy", label: "Contact page copy" },
] as const;

export default async function AdminSettingsPage() {
  const settings = await db.siteSetting.findMany({
    where: { key: { in: KEYS.map((k) => k.key) } },
  });
  const byKey = new Map(settings.map((s) => [s.key, s] as const));

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Settings</h1>
      <p className="text-sm text-fg-muted">
        Global content that isn&apos;t tied to a single project, post, or person — see
        docs/05_DATABASE.md&apos;s <code className="font-mono">site_settings</code>.
      </p>

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
