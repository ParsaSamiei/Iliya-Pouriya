import { Mail, MapPin, Phone } from "lucide-react";
import { SocialChannelIcon } from "@/components/site/social-channel-icon";
import type { ContactSettingsView } from "@/lib/contact-settings";
import { normalizePhoneForTel } from "@/lib/phone-display";
import {
  getSocialLinks,
  socialLinkLabel,
  type SocialChannelUrls,
} from "@/lib/social-channels";
import { cn } from "@/lib/utils";

export type ContactInfoLabels = {
  infoLabel: string;
  phone: string;
  emailLabel: string;
  address: string;
  socialTitle: string;
  opensInNewTab: string;
};

type ContactInfoDetailsProps = {
  contact: ContactSettingsView;
  socialUrls?: SocialChannelUrls;
  locale: string;
  labels: ContactInfoLabels;
  className?: string;
  compact?: boolean;
};

export function ContactInfoDetails({
  contact,
  socialUrls,
  locale,
  labels,
  className,
  compact = false,
}: ContactInfoDetailsProps) {
  const socialLinks = getSocialLinks(socialUrls);
  const sectionGap = compact ? "space-y-5" : "space-y-8";
  const listGap = compact ? "space-y-1.5" : "space-y-2";
  const textSize = compact ? "text-sm" : "text-base";

  return (
    <aside className={cn(sectionGap, className)} aria-label={labels.infoLabel}>
      {contact.phones.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Phone className="size-4 shrink-0 text-accent" aria-hidden />
            <h2 className="text-sm font-medium text-fg">{labels.phone}</h2>
          </div>
          <ul className={cn(listGap, "ps-6")}>
            {contact.phones.map((phone) => (
              <li key={phone.number}>
                <a
                  href={`tel:${normalizePhoneForTel(phone.number)}`}
                  className={cn(
                    "group inline-flex flex-col text-fg transition-colors hover:text-accent",
                    textSize,
                  )}
                  aria-label={
                    phone.name ? `${phone.name}: ${phone.number}` : phone.number
                  }
                >
                  {phone.name ? (
                    <span className="font-medium text-fg transition-colors group-hover:text-accent">
                      {phone.name}
                    </span>
                  ) : null}
                  <bdi
                    dir="ltr"
                    className={cn(
                      "transition-colors group-hover:text-accent",
                      phone.name && "text-fg-muted",
                    )}
                  >
                    {phone.number}
                  </bdi>
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
            <h2 className="text-sm font-medium text-fg">{labels.emailLabel}</h2>
          </div>
          <ul className={cn(listGap, "ps-6")}>
            {contact.emails.map((email) => (
              <li key={email}>
                <a
                  href={`mailto:${email}`}
                  dir="ltr"
                  className={cn(
                    "inline-block text-fg transition-colors hover:text-accent",
                    textSize,
                  )}
                >
                  {email}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {contact.location ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-accent" aria-hidden />
            <h2 className="text-sm font-medium text-fg">{labels.address}</h2>
          </div>
          <p
            className={cn(
              "ps-6 leading-relaxed text-fg-muted whitespace-pre-line",
              textSize,
            )}
          >
            {contact.location}
          </p>
        </div>
      ) : null}

      {socialLinks.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-fg">{labels.socialTitle}</h2>
          <ul className="flex flex-wrap gap-2">
            {socialLinks.map((link) => {
              const label = socialLinkLabel(link, locale);
              return (
                <li key={link.id}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (${labels.opensInNewTab})`}
                    className="ctrl-hover inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg-muted transition-colors hover:border-accent/40 hover:text-accent hover:shadow-[0_4px_14px_var(--glow-soft)]"
                  >
                    <SocialChannelIcon id={link.id} className="size-5 shrink-0" />
                    <span>{label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
