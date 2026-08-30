import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/site/contact-form";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="font-display text-3xl font-semibold text-fg">{t("title")}</h1>
      <p className="mt-2 text-fg-muted">{t("subtitle")}</p>
      <div className="mt-10">
        <ContactForm />
      </div>
    </div>
  );
}
