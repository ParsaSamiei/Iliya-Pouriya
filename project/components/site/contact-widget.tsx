import { getLocale } from "next-intl/server";
import { ContactWidgetClient } from "@/components/site/contact-widget-client";
import {
  CONTACT_SETTINGS_KEY,
  DEFAULT_CONTACT_SETTINGS,
  hasContactInfo,
  parseContactSettings,
  resolveContactSettings,
} from "@/lib/contact-settings";
import { db } from "@/lib/db";
import { getSocialLinks } from "@/lib/social-channels";

export async function ContactWidget() {
  const [locale, setting] = await Promise.all([
    getLocale(),
    db.siteSetting.findUnique({ where: { key: CONTACT_SETTINGS_KEY } }).catch(() => null),
  ]);

  const contactData = setting?.valueEn
    ? parseContactSettings(setting.valueEn)
    : DEFAULT_CONTACT_SETTINGS;
  const contact = resolveContactSettings(contactData, locale);
  const socialLinks = getSocialLinks(contactData);

  if (!hasContactInfo(contact) && socialLinks.length === 0) {
    return null;
  }

  return <ContactWidgetClient contact={contact} socialUrls={contactData} />;
}
