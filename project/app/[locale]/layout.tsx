import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { ContactWidget } from "@/components/site/contact-widget";
import { SiteBackground } from "@/components/site/site-background";
import { SiteCursor } from "@/components/site/site-cursor";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { routing } from "@/i18n/routing";
import "@/lib/fonts";
import { getSiteMetadata } from "@/lib/get-site-metadata";
import { buildLocaleAlternates } from "@/lib/seo";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const site = await getSiteMetadata(locale);
  return {
    title: { default: `${site.name} — ${site.tagline}`, template: `%s — ${site.name}` },
    description: site.tagline,
    alternates: buildLocaleAlternates("/"),
    openGraph: {
      siteName: site.name,
      title: `${site.name} — ${site.tagline}`,
      description: site.tagline,
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const dir = locale === "fa" ? "rtl" : "ltr";
  const site = await getSiteMetadata(locale);

  return (
    <html lang={locale} dir={dir} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="min-h-screen bg-bg font-body text-fg antialiased">
        <NextIntlClientProvider>
          <ThemeProvider>
            <SiteBackground />
            <SiteCursor />
            <div className="relative z-10 flex min-h-screen flex-col">
              <SiteHeader siteName={site.name} />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
            <ContactWidget />
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
