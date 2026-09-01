"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { SiteHeaderControls } from "@/components/site/site-header-controls";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { SITE_NAV_ITEMS } from "@/lib/site-nav";

export function SiteHeader() {
  const t = useTranslations("nav");
  const tSite = useTranslations("site");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-fg">
          <span className="led led--dim" aria-hidden />
          {tSite("name")}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {SITE_NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  active ? "text-accent" : "text-fg-muted"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <SiteHeaderControls className="hidden sm:inline-flex" />

          <SiteHeaderControls
            className="sm:hidden"
            showLanguage={false}
          />

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-border px-4 py-3 md:hidden">
          {SITE_NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-[var(--radius-sm)] px-2 py-2 text-sm font-medium text-fg-muted hover:bg-surface-raised hover:text-fg"
            >
              {t(item.key)}
            </Link>
          ))}
          <SiteHeaderControls
            layout="menu"
            showTheme={false}
            onLanguageSwitch={() => setMobileOpen(false)}
          />
        </nav>
      )}
    </header>
  );
}
