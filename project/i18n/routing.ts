import { defineRouting } from "next-intl/routing";

/**
 * Locale routing config — see docs/03_Information_Architecture.md.
 * FA is unprefixed (default), EN lives under /en/*.
 * Persian renders RTL with Vazirmatn + Inter (see app/globals.css and
 * i18n/request.ts); numerals stay Western digits by default per docs/03.
 */
export const routing = defineRouting({
  locales: ["fa", "en"],
  defaultLocale: "fa",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/projects": { en: "/projects", fa: "/projects" },
    "/projects/[slug]": { en: "/projects/[slug]", fa: "/projects/[slug]" },
    "/team/[person]": { en: "/team/[person]", fa: "/team/[person]" },
    "/blog": { en: "/blog", fa: "/blog" },
    "/blog/[slug]": { en: "/blog/[slug]", fa: "/blog/[slug]" },
    "/about": { en: "/about", fa: "/about" },
    "/contact": { en: "/contact", fa: "/contact" },
  },
});

export type AppLocale = (typeof routing.locales)[number];
