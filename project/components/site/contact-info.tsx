import { Mail, MapPin, Phone } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { SocialChannelIcon } from "@/components/site/social-channel-icon";
import type { ContactSettingsView } from "@/lib/contact-settings";
import { normalizePhoneForTel } from "@/lib/phone-display";
import { getSocialLinks, socialLinkLabel, type SocialChannelUrls } from "@/lib/social-channels";

type ContactInfoProps = {
  contact: ContactSettingsView;
  socialUrls?: SocialChannelUrls;
};

export async function ContactInfo({ contact, socialUrls }: ContactInfoProps) {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("contact")]);
  const socialLinks = getSocialLinks(socialUrls);

  return (
    <aside className="space-y-8" aria-label={t("infoLabel")}>
      {contact.phones.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Phone className="size-4 shrink-0 text-accent" aria-hidden />
            <h2 className="text-sm font-medium text-fg">{t("phone")}</h2>
          </div>
          <ul className="space-y-2 ps-6">
            {contact.phones.map((phone) => (
              <li key={phone}>
                <a
                  href={`tel:${normalizePhoneForTel(phone)}`}
                  className="inline-block text-base text-fg transition-colors hover:text-accent"
                >
                  <bdi dir="ltr">{phone}</bdi>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {contact.emails.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="size-4 shrink-0 text-accent" aria-hidden />
            <h2 className="text-sm font-medium text-fg">{t("emailLabel")}</h2>
          </div>
          <ul className="space-y-2 ps-6">
            {contact.emails.map((email) => (
              <li key={email}>
                <a
                  href={`mailto:${email}`}
                  dir="ltr"
                  className="inline-block text-base text-fg transition-colors hover:text-accent"
                >
                  {email}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {contact.location && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-accent" aria-hidden />
            <h2 className="text-sm font-medium text-fg">{t("address")}</h2>
          </div>
          <p className="ps-6 text-base leading-relaxed text-fg-muted whitespace-pre-line">
            {contact.location}
          </p>
        </div>
      )}

      {socialLinks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-fg">{t("socialTitle")}</h2>
          <ul className="flex flex-wrap gap-2">
            {socialLinks.map((link) => {
              const label = socialLinkLabel(link, locale);
              return (
                <li key={link.id}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (${t("opensInNewTab")})`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg-muted transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    <SocialChannelIcon id={link.id} className="size-5 shrink-0" />
                    <span>{label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </aside>
  );
}
