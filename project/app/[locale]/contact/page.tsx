import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/site/contact-form";
import { ContactInfo } from "@/components/site/contact-info";
import {
  CONTACT_SETTINGS_KEY,
  DEFAULT_CONTACT_SETTINGS,
  hasContactInfo,
  parseContactSettings,
  resolveContactSettings,
} from "@/lib/contact-settings";
import { db } from "@/lib/db";
import { getSocialLinks } from "@/lib/social-channels";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, setting] = await Promise.all([
    getTranslations("contact"),
    db.siteSetting.findUnique({ where: { key: CONTACT_SETTINGS_KEY } }).catch(() => null),
  ]);

  const contactData = setting?.valueEn
    ? parseContactSettings(setting.valueEn)
    : DEFAULT_CONTACT_SETTINGS;
  const contact = resolveContactSettings(contactData, locale);
  const socialLinks = getSocialLinks(contactData);
  const showInfo = hasContactInfo(contact) || socialLinks.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className={showInfo ? "max-w-xl" : "mx-auto max-w-xl"}>
        <h1 className="font-display text-3xl font-semibold text-fg">{t("title")}</h1>
        <p className="mt-2 text-fg-muted">{t("subtitle")}</p>
      </div>

      <div
        className={
          showInfo
            ? "mt-10 grid gap-12 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-16"
            : "mx-auto mt-10 max-w-xl"
        }
      >
        {showInfo ? <ContactInfo contact={contact} socialUrls={contactData} /> : null}
        <div className={showInfo ? "min-w-0" : undefined}>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
