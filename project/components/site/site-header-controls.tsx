"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useId, useState } from "react";
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

function ThemeGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="3" y1="2" x2="21" y2="22">
      <stop offset="0%" stopColor="var(--accent)" />
      <stop offset="100%" stopColor="var(--signal)" />
    </linearGradient>
  );
}

/** Sun — shown in dark mode (action: switch to light). Brand teal→violet stroke. */
function ThemeSunIcon() {
  const gid = useId().replace(/:/g, "");
  const gradId = `theme-sun-${gid}`;

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-[1.15rem] shrink-0">
      <defs>
        <ThemeGradient id={gradId} />
      </defs>
      <circle cx="12" cy="12" r="3.35" fill={`url(#${gradId})`} />
      <path
        d="M12 3.2v2.1M12 18.7v2.1M3.2 12h2.1M18.7 12h2.1M5.9 5.9l1.5 1.5M16.6 16.6l1.5 1.5M18.1 5.9l-1.5 1.5M7.4 16.6l-1.5 1.5"
        stroke={`url(#${gradId})`}
        strokeWidth="1.55"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Moon — shown in light mode (action: switch to dark). Brand teal→violet fill. */
function ThemeMoonIcon() {
  const gid = useId().replace(/:/g, "");
  const gradId = `theme-moon-${gid}`;

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-[1.15rem] shrink-0">
      <defs>
        <ThemeGradient id={gradId} />
      </defs>
      <path
        d="M14.2 4.4a7.6 7.6 0 1 0 5.4 13.3 6.2 6.2 0 1 1-5.4-13.3Z"
        fill={`url(#${gradId})`}
      />
    </svg>
  );
}

const plate =
  "border border-border/70 bg-[color-mix(in_srgb,var(--surface)_55%,transparent)] shadow-[inset_0_1px_0_var(--panel-highlight)]";

const utilBase =
  "inline-flex cursor-pointer items-center justify-center gap-2.5 text-fg-muted outline-none transition-[color,background-color,border-color,box-shadow,translate] duration-200 ease-out focus-visible:shadow-[0_0_0_2px_var(--bg),0_0_0_4px_var(--accent)]";

const utilToolbar = cn(
  plate,
  "rounded-[var(--radius-sm)]",
  "hover:border-[color-mix(in_srgb,var(--accent)_45%,var(--border))] hover:bg-[color-mix(in_srgb,var(--accent)_10%,var(--surface))] hover:text-fg",
  "hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_28%,transparent),0_8px_22px_-12px_color-mix(in_srgb,var(--accent)_50%,transparent)]",
  "motion-safe:hover:-translate-y-px motion-safe:active:translate-y-px",
);

const utilMenu =
  "w-full justify-start rounded-[var(--radius-sm)] px-2 py-2 text-sm font-medium hover:bg-surface-raised hover:text-accent motion-safe:active:translate-y-px";

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

  const themeButton = showTheme ? (
    <button
      key="theme"
      type="button"
      aria-label={t("toggleTheme")}
      title={t("toggleTheme")}
      onClick={toggleTheme}
      className={cn(
        utilBase,
        layout === "toolbar" ? cn(utilToolbar, "size-9") : utilMenu,
        "group/theme",
      )}
    >
      <span
        className={cn(
          "inline-grid place-items-center transition-[transform,filter] duration-200 ease-out",
          "motion-safe:group-hover/theme:scale-110",
          isDark
            ? "drop-shadow-[0_0_8px_color-mix(in_srgb,var(--accent)_45%,transparent)]"
            : "drop-shadow-[0_0_6px_color-mix(in_srgb,var(--signal)_30%,transparent)]",
          "motion-safe:group-hover/theme:drop-shadow-[0_0_11px_color-mix(in_srgb,var(--accent)_50%,transparent)]",
        )}
      >
        {isDark ? <ThemeSunIcon /> : <ThemeMoonIcon />}
      </span>
      {layout === "menu" ? <span>{t("toggleTheme")}</span> : null}
    </button>
  ) : null;

  const languageButton = showLanguage ? (
    <button
      key="language"
      type="button"
      aria-label={t("toggleLanguage")}
      title={t("toggleLanguage")}
      onClick={handleLanguageSwitch}
      className={cn(
        utilBase,
        layout === "toolbar"
          ? cn(utilToolbar, "h-9 min-w-9 px-2.5")
          : utilMenu,
        "group/locale",
      )}
    >
      <span
        dir="ltr"
        className={cn(
          "inline-flex items-center gap-1.5",
          layout === "menu" && "shrink-0",
        )}
      >
        <span
          aria-hidden
          className="h-3.5 w-0.5 shrink-0 rounded-full bg-[linear-gradient(to_bottom,var(--accent),var(--signal))] shadow-[0_0_10px_color-mix(in_srgb,var(--accent)_35%,transparent)]"
        />
        <span
          className={cn(
            "leading-none text-fg transition-colors duration-200 group-hover/locale:text-accent",
            nextLocale === "fa"
              ? "font-display text-[0.9375rem] font-semibold tracking-normal"
              : "font-mono text-[0.7rem] font-semibold tracking-[0.16em]",
          )}
        >
          {LOCALE_LABELS[nextLocale]}
        </span>
      </span>
      {layout === "menu" ? <span>{t("toggleLanguage")}</span> : null}
    </button>
  ) : null;

  if (!themeButton && !languageButton) {
    return null;
  }

  return (
    <div
      className={cn(
        layout === "menu"
          ? "flex flex-col gap-1"
          : "inline-flex items-center gap-1.5",
        className,
      )}
    >
      {themeButton}
      {languageButton}
    </div>
  );
}
