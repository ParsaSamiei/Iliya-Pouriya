import { defineRouting } from "next-intl/routing";

/**
 * Locale routing config — see docs/03_Information_Architecture.md.
 * FA is unprefixed (default), EN lives under /en/*.
 * localeDetection is off so / always serves Persian — browser Accept-Language
 * and NEXT_LOCALE cookies must not silently redirect first-time (or returning)
 * visitors to English.
 * Persian renders RTL with Vazirmatn + Inter (see app/globals.css and
 * i18n/request.ts); numerals stay Western digits by default per docs/03.
 */
export const routing = defineRouting({
  locales: ["fa", "en"],
  defaultLocale: "fa",
  localePrefix: "as-needed",
  localeDetection: false,
  pathnames: {
    "/": "/",
    "/projects": { en: "/projects", fa: "/projects" },
    "/projects/[slug]": { en: "/projects/[slug]", fa: "/projects/[slug]" },
    "/gallery": { en: "/gallery", fa: "/gallery" },
    "/team/[person]": { en: "/team/[person]", fa: "/team/[person]" },
    "/blog": { en: "/blog", fa: "/blog" },
    "/blog/[slug]": { en: "/blog/[slug]", fa: "/blog/[slug]" },
    "/about": { en: "/about", fa: "/about" },
    "/contact": { en: "/contact", fa: "/contact" },
    "/report": { en: "/report", fa: "/report" },
  },
});

export type AppLocale = (typeof routing.locales)[number];
