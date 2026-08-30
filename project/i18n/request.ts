import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    // Western digits by default (docs/03_Information_Architecture.md);
    // flip to `fa-IR-u-nu-arabext` here if Persian numerals are wanted later.
    formats: {
      dateTime: {
        short: { day: "numeric", month: "short", year: "numeric" },
      },
    },
  };
});
