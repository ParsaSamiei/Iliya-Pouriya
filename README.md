# i18n — English / Persian

## Library

**next-intl**, integrated with the App Router locale-prefixed routing (`/en/...`, `/fa/...`) described in `03_Information_Architecture.md`.

## Locale config

```ts
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fa'],
  defaultLocale: 'en',
  localePrefix: 'always', // both locales always prefixed — no bare "default locale, no prefix" ambiguity
});
```

- Root `/` redirects based on `Accept-Language` (or defaults to `en` if undetectable), per next-intl's standard middleware.
- `[locale]/layout.tsx` sets `<html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'}>`.

## Two kinds of translated content

1. **UI strings** (buttons, labels, nav, form validation messages) — static, live in `/i18n/messages/en.json` and `/i18n/messages/fa.json`, loaded via next-intl's message system. Every new UI string goes here, not hardcoded in a component — see `00_AI_INSTRUCTIONS.md`.
2. **Admin-authored content** (project descriptions, blog posts, bios, experience, skills) — dynamic, stored as `_en`/`_fa` column pairs directly on each row (`05_DATABASE.md`). This is *not* routed through next-intl's message files — it's fetched from the DB per-locale at render time.

Don't conflate the two: UI chrome goes in message files, content goes in the database.

## RTL

- Persian (`fa`) is RTL. `dir="rtl"` is set at the `<html>` level per locale (above), which flips Tailwind's logical properties automatically.
- **Mandatory:** all custom component styling uses logical Tailwind utilities (`ps-*`/`pe-*`, `ms-*`/`me-*`, `start-*`/`end-*`, `text-start`/`text-end`) instead of physical ones (`pl-*`/`pr-*`, `left-*`/`right-*`, `text-left`/`text-right`). Physical utilities will visually break in `fa`.
- shadcn/ui components (Base UI-based, per `04_DESIGN_SYSTEM.md`) have RTL support — verify each pulled component renders correctly in `dir="rtl"` before treating it as integration-complete, per `00_AI_INSTRUCTIONS.md`'s "definition of done."
- Icons that imply direction (arrows, chevrons for "next/back") need to flip in RTL — check each usage, don't assume it's automatic.

## Typography per locale

- `fa` uses a Persian-appropriate typeface (e.g. Vazirmatn) for both display and body text, set via the `[dir="rtl"]` CSS variable override in `04_DESIGN_SYSTEM.md`'s token file — not a per-component font override.
- Numerals: decide once whether to render Persian content with Western (0-9) or Persian/Eastern Arabic-Indic digits, and apply consistently (dates, phone numbers, project stats). Western digits are common in Persian tech/engineering contexts and are the simpler default unless you have a strong preference otherwise.

## Translation workflow

- Since content is admin-authored (not string-file based), translation happens directly in the admin panel's bilingual tabbed forms (`07_ADMIN_PANEL.md`) — write once in each language when creating/editing a project, post, or profile field.
- For UI message files (`en.json`/`fa.json`), keep keys structured by route/section (e.g. `nav.projects`, `contact.form.emailLabel`) so both files stay easy to diff and keep in sync as new strings are added.
- Recommend a lightweight rule: no PR that adds a new UI string merges without both `en` and `fa` values present — prevents `fa.json` silently falling behind `en.json` over time.

## SEO integration

See `08_SEO.md` for `hreflang` and per-locale canonical/sitemap handling — this file covers the app-level i18n mechanics; that one covers how it surfaces to search engines.
