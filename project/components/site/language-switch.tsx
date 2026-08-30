"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LanguageSwitch({
  className,
  onSwitch,
}: {
  className?: string;
  onSwitch?: () => void;
}) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const nextLocale = locale === "fa" ? "en" : "fa";

  function handleSwitch() {
    router.replace(
      // @ts-expect-error -- params shape is dynamic per-route, next-intl types this loosely
      { pathname, params },
      { locale: nextLocale },
    );
    onSwitch?.();
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSwitch}
      aria-label={t("toggleLanguage")}
      className={cn(className)}
    >
      {t("toggleLanguage")}
    </Button>
  );
}
