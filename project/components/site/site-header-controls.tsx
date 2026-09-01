"use client";

import { Moon, Sun } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const LOCALE_CODES = {
  en: "EN",
  fa: "FA",
} as const;

type SiteHeaderControlsProps = {
  className?: string;
  layout?: "toolbar" | "menu";
  showTheme?: boolean;
  showLanguage?: boolean;
  onLanguageSwitch?: () => void;
};

export function SiteHeaderControls({
  className,
  layout = "toolbar",
  showTheme = true,
  showLanguage = true,
  onLanguageSwitch,
}: SiteHeaderControlsProps) {
  const t = useTranslations("nav");
  const locale = useLocale() as keyof typeof LOCALE_CODES;
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const nextLocale = locale === "fa" ? "en" : "fa";
  const nextLocaleCode = LOCALE_CODES[nextLocale];

  function handleLanguageSwitch() {
    router.replace(
      // @ts-expect-error -- params shape is dynamic per-route, next-intl types this loosely
      { pathname, params },
      { locale: nextLocale },
    );
    onLanguageSwitch?.();
  }

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  const controlButtonClass = cn(
    "cursor-pointer rounded-none text-fg-muted transition-colors duration-200",
    "hover:bg-surface-raised hover:text-accent",
    "active:bg-surface-raised/80",
  );

  const themeButton = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={t("toggleTheme")}
      onClick={toggleTheme}
      className={cn(
        controlButtonClass,
        layout === "menu" && "w-full justify-start gap-2 px-2 py-2 text-sm font-medium",
      )}
    >
      <Sun className="hidden dark:block" />
      <Moon className="dark:hidden" />
      {layout === "menu" ? t("toggleTheme") : null}
    </Button>
  );

  const languageButton = (
    <Button
      type="button"
      variant="ghost"
      size={layout === "menu" ? "default" : "sm"}
      aria-label={t("toggleLanguage")}
      onClick={handleLanguageSwitch}
      className={cn(
        controlButtonClass,
        layout === "toolbar" && "h-9 px-2.5 font-mono text-xs tracking-wider",
        layout === "menu" && "w-full justify-start gap-2 px-2 py-2 text-sm font-medium",
      )}
    >
      {layout === "menu" ? t("toggleLanguage") : nextLocaleCode}
    </Button>
  );

  if (layout === "menu") {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {showTheme ? themeButton : null}
        {showLanguage ? languageButton : null}
      </div>
    );
  }

  const controls = [
    showTheme ? themeButton : null,
    showTheme && showLanguage ? (
      <Separator key="sep" orientation="vertical" className="h-5 self-center" />
    ) : null,
    showLanguage ? languageButton : null,
  ].filter(Boolean);

  if (controls.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-[var(--radius-sm)] border border-border bg-surface/80 shadow-[inset_0_1px_0_var(--panel-highlight)]",
        className,
      )}
      role="group"
      aria-label={t("headerControls")}
    >
      {controls}
    </div>
  );
}
