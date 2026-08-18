# 10 — Analytics for V2 not implemented NOW

## Approach

Since the site is self-hosted on your own VPS (`09_DEVELOPMENT_GUIDELINES.md`), a self-hosted, privacy-respecting analytics tool is the natural fit — no need to send visitor data to Google, and no cookie-consent banner required if the tool is genuinely cookieless.

**Recommended: Umami**, self-hosted alongside the app in the same Docker Compose setup. Lightweight (its own small Postgres or SQLite store — can reuse the same Postgres instance with a separate database), cookieless, gives you the essentials: pageviews, referrers, top pages, countries, device/browser breakdown.

Plausible (self-hosted) is a reasonable alternative if Umami's UI doesn't fit — functionally similar, slightly heavier to self-host (needs ClickHouse). Umami is the simpler operational choice at this scale.

## What to track

- Pageviews per route (naturally covers project/blog popularity)
- Referrer sources (useful for knowing whether traffic comes from LinkedIn, GitHub, search, etc.)
- Locale split (`en` vs `fa` traffic) — genuinely useful here given the bilingual investment; confirm the analytics tool can segment by URL path (`/en/*` vs `/fa/*`) since locale is in the route
- Outbound clicks worth tracking as custom events:
  - Resume downloads (per person)
  - Contact form submissions (conversion signal)
  - External project links (GitHub/demo) clicked from a project page

## What not to build

- No need for a custom analytics pipeline or event warehouse — Umami's built-in dashboard is sufficient for a two-person portfolio's traffic volume.
- No user-level tracking/fingerprinting — stay aggregate/cookieless; there's no product reason to identify individual visitors here.

## Where it lives

- Umami dashboard accessed separately from `/admin` (it's a different app) — link to it from `/admin/dashboard` for convenience rather than trying to embed/rebuild it inside your own admin panel.
- Add the Umami tracking script to the root `[locale]/layout.tsx`, loaded async so it never blocks rendering.

## Privacy note

Cookieless, aggregate analytics like Umami generally don't require a cookie-consent banner in most jurisdictions, but this isn't legal advice — worth a quick check against wherever your visitors are primarily located if that matters to you.
