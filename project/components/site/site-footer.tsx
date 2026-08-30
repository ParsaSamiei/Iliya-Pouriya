import { useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-fg-muted sm:flex-row">
        <p className="font-mono">
          © {year} {t("builtWith")}
        </p>
        <p>{t("rights")}</p>
      </div>
    </footer>
  );
}
