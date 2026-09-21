import { useTranslations } from "next-intl";

export function PlaceholderNotice() {
  const t = useTranslations("common");
  return (
    <div className="rounded-[var(--radius-md)] border border-dashed border-border bg-surface/60 p-8 text-center text-sm text-fg-muted">
      {t("placeholderNotice")}
    </div>
  );
}
