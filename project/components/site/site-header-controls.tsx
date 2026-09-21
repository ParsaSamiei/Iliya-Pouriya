"use client";

import { Moon, Sun } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const LOCALE_LABELS = {
  en: "EN",
  fa: "فا",
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
  const locale = useLocale() as keyof typeof LOCALE_LABELS;
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextLocale = locale === "fa" ? "en" : "fa";
  const nextLocaleLabel = LOCALE_LABELS[nextLocale];
  const isDark = mounted && resolvedTheme === "dark";

  function handleLanguageSwitch() {
    router.replace(
      // @ts-expect-error -- params shape is dynamic per-route, next-intl types this loosely
      { pathname, params },
      { locale: nextLocale },
    );
    onLanguageSwitch?.();
  }

  function toggleTheme() {
    setTheme(isDark ? "light" : "dark");
  }

  const toolbarButtonClass = cn(
    "cursor-pointer border border-border bg-surface/80 text-fg-muted shadow-none",
    "transition-[color,background-color,border-color,transform] duration-200",
    "hover:border-accent/40 hover:bg-surface-raised hover:text-accent",
    "active:translate-y-px active:bg-surface-raised/80",
  );

  const menuButtonClass = cn(
    "w-full cursor-pointer justify-start gap-2 px-2 py-2 text-sm font-medium text-fg-muted",
    "hover:bg-surface-raised hover:text-accent",
    "active:bg-surface-raised/80",
  );

  const themeButton = showTheme ? (
    <Button
      key="theme"
      type="button"
      variant={layout === "toolbar" ? "outline" : "ghost"}
      size={layout === "menu" ? "default" : "icon"}
      aria-label={t("toggleTheme")}
      title={t("toggleTheme")}
      onClick={toggleTheme}
      className={cn(layout === "toolbar" ? toolbarButtonClass : menuButtonClass)}
    >
      {isDark ? <Sun /> : <Moon />}
      {layout === "menu" ? t("toggleTheme") : null}
    </Button>
  ) : null;

  const languageButton = showLanguage ? (
    <Button
      key="language"
      type="button"
      variant={layout === "toolbar" ? "outline" : "ghost"}
      size={layout === "menu" ? "default" : "icon"}
      aria-label={t("toggleLanguage")}
      title={t("toggleLanguage")}
      onClick={handleLanguageSwitch}
      className={cn(
        layout === "toolbar"
          ? cn(
              toolbarButtonClass,
              nextLocale === "fa" ? "font-display text-sm tracking-normal" : "font-mono text-xs tracking-[0.14em]",
            )
          : menuButtonClass,
      )}
    >
      {layout === "menu" ? t("toggleLanguage") : nextLocaleLabel}
    </Button>
  ) : null;

  if (!themeButton && !languageButton) {
    return null;
  }

  return (
    <div
      className={cn(
        layout === "menu" ? "flex flex-col gap-1" : "inline-flex items-center gap-2",
        className,
      )}
    >
      {themeButton}
      {languageButton}
    </div>
  );
}
