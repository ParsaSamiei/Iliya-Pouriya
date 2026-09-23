import { getLocale, getTranslations } from "next-intl/server";
import { ContactInfoDetails } from "@/components/site/contact-info-details";
import type { ContactSettingsView } from "@/lib/contact-settings";
import type { SocialChannelUrls } from "@/lib/social-channels";

type ContactInfoProps = {
  contact: ContactSettingsView;
  socialUrls?: SocialChannelUrls;
};

export async function ContactInfo({ contact, socialUrls }: ContactInfoProps) {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("contact")]);

  return (
    <ContactInfoDetails
      contact={contact}
      socialUrls={socialUrls}
      locale={locale}
      labels={{
        infoLabel: t("infoLabel"),
        phone: t("phone"),
        emailLabel: t("emailLabel"),
        address: t("address"),
        socialTitle: t("socialTitle"),
        opensInNewTab: t("opensInNewTab"),
      }}
    />
  );
}
