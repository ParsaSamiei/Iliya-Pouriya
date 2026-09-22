import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { SiteLogo } from "@/components/site/site-logo";
import { SocialChannelIcon } from "@/components/site/social-channel-icon";
import { Link } from "@/i18n/navigation";
import {
  CONTACT_SETTINGS_KEY,
  DEFAULT_CONTACT_SETTINGS,
  hasContactInfo,
  parseContactSettings,
  resolveContactSettings,
} from "@/lib/contact-settings";
import { db } from "@/lib/db";
import { getSiteMetadata } from "@/lib/get-site-metadata";
import { normalizePhoneForTel } from "@/lib/phone-display";
import { SITE_NAV_ITEMS } from "@/lib/site-nav";
import { getSocialLinks, socialLinkLabel } from "@/lib/social-channels";
import { getFooterSponsors } from "@/lib/sponsors";

const footerLinkClass =
  "inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-accent";

function FooterSectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-medium tracking-[0.12em] text-fg-muted uppercase">{children}</p>
  );
}

export async function SiteFooter() {
  const [locale, t, tNav, setting, sponsors] = await Promise.all([
    getLocale(),
    getTranslations("footer"),
    getTranslations("nav"),
    db.siteSetting.findUnique({ where: { key: CONTACT_SETTINGS_KEY } }).catch(() => null),
    getFooterSponsors(),
  ]);
  const site = await getSiteMetadata(locale);

  const year = new Date().getFullYear();
  const contactData = setting?.valueEn
    ? parseContactSettings(setting.valueEn)
    : DEFAULT_CONTACT_SETTINGS;
  const contact = resolveContactSettings(contactData, locale);
  const socialLinks = getSocialLinks(contactData);
  const showContact = hasContactInfo(contact);

  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-fg transition-colors hover:text-accent"
            >
              <SiteLogo size="sm" />
              <span>{site.name}</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-fg-muted">{site.tagline}</p>
          </div>

          {/* Navigation */}
          <nav aria-label={t("navLabel")} className="lg:col-span-3">
            <FooterSectionLabel>{t("navTitle")}</FooterSectionLabel>
            <ul className="mt-4 space-y-2.5">
              {SITE_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={footerLinkClass}>
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          {showContact ? (
            <div className="lg:col-span-3">
              <FooterSectionLabel>{t("contactTitle")}</FooterSectionLabel>
              <ul className="mt-4 space-y-2.5">
                {contact.phones.map((phone) => (
                  <li key={phone}>
                    <a href={`tel:${normalizePhoneForTel(phone)}`} className={footerLinkClass}>
                      <Phone className="size-3.5 shrink-0" aria-hidden />
                      <bdi dir="ltr">{phone}</bdi>
                    </a>
                  </li>
                ))}
                {contact.emails.map((email) => (
                  <li key={email}>
                    <a href={`mailto:${email}`} dir="ltr" className={footerLinkClass}>
                      <Mail className="size-3.5 shrink-0" aria-hidden />
                      {email}
                    </a>
                  </li>
                ))}
                {contact.location ? (
                  <li>
                    <span className={footerLinkClass}>
                      <MapPin className="size-3.5 shrink-0" aria-hidden />
                      <span className="whitespace-pre-line">{contact.location}</span>
                    </span>
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}

          {/* Follow us */}
          {socialLinks.length > 0 ? (
            <div className="lg:col-span-3">
              <FooterSectionLabel>{t("follow")}</FooterSectionLabel>
              <ul className="mt-4 flex flex-wrap items-center gap-1">
                {socialLinks.map((link) => {
                  const label = socialLinkLabel(link, locale);
                  return (
                    <li key={link.id}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${label} (${t("opensInNewTab")})`}
                        className="inline-flex size-10 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-surface hover:text-accent"
                      >
                        <SocialChannelIcon id={link.id} className="size-5" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>

        {sponsors.length > 0 ? (
          <div className="mt-10 flex flex-col items-center gap-3 border-t border-border pt-8">
            <FooterSectionLabel>{t("sponsors")}</FooterSectionLabel>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {sponsors.map((sponsor) => {
                const content = sponsor.logoUrl ? (
                  <Image
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    width={200}
                    height={80}
                    className="h-13 w-auto object-contain"
                  />
                ) : (
                  <span className="text-sm font-medium">{sponsor.name}</span>
                );

                const className =
                  "opacity-60 transition-opacity duration-150 hover:opacity-100" +
                  (sponsor.logoUrl ? "" : " text-fg-muted hover:text-fg");

                if (sponsor.url) {
                  return (
                    <a
                      key={sponsor.id}
                      href={sponsor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${sponsor.name} (${t("opensInNewTab")})`}
                      className={className}
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <span key={sponsor.id} className={className} aria-label={sponsor.name}>
                    {content}
                  </span>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-fg-muted sm:flex-row">
          <p className="text-xs">
            © {year} {site.name}. {t("rights")}
          </p>
          <p className="text-xs">{t("builtWith")}</p>
        </div>
      </div>
    </footer>
  );
}
