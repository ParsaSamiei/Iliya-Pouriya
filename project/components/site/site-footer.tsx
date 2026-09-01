import { Mail, MapPin, Phone } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import {
  CONTACT_SETTINGS_KEY,
  DEFAULT_CONTACT_SETTINGS,
  hasContactInfo,
  parseContactSettings,
  resolveContactSettings,
} from "@/lib/contact-settings";
import { db } from "@/lib/db";
import { normalizePhoneForTel } from "@/lib/phone-display";
import { SITE_NAV_ITEMS } from "@/lib/site-nav";

function FooterSectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] tracking-wide text-fg-muted uppercase">{children}</p>
  );
}

export async function SiteFooter() {
  const [locale, t, tNav, tSite, setting] = await Promise.all([
    getLocale(),
    getTranslations("footer"),
    getTranslations("nav"),
    getTranslations("site"),
    db.siteSetting.findUnique({ where: { key: CONTACT_SETTINGS_KEY } }).catch(() => null),
  ]);

  const year = new Date().getFullYear();
  const contactData = setting?.valueEn
    ? parseContactSettings(setting.valueEn)
    : DEFAULT_CONTACT_SETTINGS;
  const contact = resolveContactSettings(contactData, locale);
  const showContact = hasContactInfo(contact);

  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-fg transition-colors hover:text-accent"
            >
              <span className="led led--dim" aria-hidden />
              {tSite("name")}
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-fg-muted">{tSite("tagline")}</p>
          </div>

          {/* Navigation */}
          <nav aria-label={t("navLabel")} className="lg:col-span-3">
            <FooterSectionLabel>{t("navTitle")}</FooterSectionLabel>
            <ul className="mt-4 space-y-2.5">
              {SITE_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-fg-muted transition-colors hover:text-accent"
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact — only rendered when admin has configured values */}
          {showContact ? (
            <div className="lg:col-span-5">
              <FooterSectionLabel>{t("contactTitle")}</FooterSectionLabel>
              <div className="mt-4 space-y-5">
                {contact.phones.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="size-4 shrink-0 text-accent" aria-hidden />
                      <span className="text-xs font-medium text-fg-muted">{t("phone")}</span>
                    </div>
                    <ul className="space-y-1.5 ps-6">
                      {contact.phones.map((phone) => (
                        <li key={phone}>
                          <a
                            href={`tel:${normalizePhoneForTel(phone)}`}
                            className="inline-block text-sm text-fg transition-colors hover:text-accent"
                          >
                            <bdi dir="ltr">{phone}</bdi>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {contact.emails.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="size-4 shrink-0 text-accent" aria-hidden />
                      <span className="text-xs font-medium text-fg-muted">{t("email")}</span>
                    </div>
                    <ul className="space-y-1.5 ps-6">
                      {contact.emails.map((email) => (
                        <li key={email}>
                          <a
                            href={`mailto:${email}`}
                            dir="ltr"
                            className="inline-block text-sm text-fg transition-colors hover:text-accent"
                          >
                            {email}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {contact.location && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 shrink-0 text-accent" aria-hidden />
                      <span className="text-xs font-medium text-fg-muted">{t("location")}</span>
                    </div>
                    <p className="ps-6 text-sm leading-relaxed text-fg">{contact.location}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden lg:col-span-5 lg:block" aria-hidden />
          )}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-fg-muted sm:flex-row">
          <p className="font-mono text-xs">
            © {year} {tSite("name")}. {t("rights")}
          </p>
          <p className="font-mono text-xs">{t("builtWith")}</p>
        </div>
      </div>
    </footer>
  );
}
