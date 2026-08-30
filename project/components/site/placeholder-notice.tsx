import { useTranslations } from "next-intl";

export function PlaceholderNotice() {
  const t = useTranslations("common");
  return (
    <div className="bp-grid rounded-[var(--radius-lg)] border border-dashed border-border p-8 text-center font-mono text-sm text-fg-muted">
      {t("placeholderNotice")}
    </div>
  );
}
