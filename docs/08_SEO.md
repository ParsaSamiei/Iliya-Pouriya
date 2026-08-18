# 08 — SEO

## Metadata

- Use Next.js's `generateMetadata` per route (title, description, canonical URL) — pull description from `summary_en`/`summary_fa` on projects/posts where available, otherwise a sensible per-page default.
- Title pattern: `{Page/Item Title} — {Site Name}` on subpages, plain `{Site Name} — {Tagline}` on home.

## Open Graph / social previews

- Every project and blog post gets an OG image — use the `cover_image_url` if present; fall back to a generated default OG image for pages without one (project/post creation form should nudge toward always adding a cover image).
- Standard OG tags (`og:title`, `og:description`, `og:image`, `og:type`) plus Twitter card tags, generated alongside metadata.

## Structured data (JSON-LD)

- `/team/[person]` pages: `Person` schema (name, jobTitle, sameAs → social links).
- Project pages: `CreativeWork` (or `SoftwareSourceCode`/`Product` depending on project type) with `author`/`creator` pointing at the relevant `Person` entries.
- Blog posts: `BlogPosting` with `author`, `datePublished`.
- Home: `WebSite` + `Organization`/`Person` (two-person entity — model as an informal `Organization` with `member` pointing at both people, or as two `Person` entries linked from the homepage — pick one and be consistent).

## i18n SEO

- `hreflang` alternate links on every page, pointing to the `en`/`fa` equivalents of the same content (`03_Information_Architecture.md` routing makes this a straightforward locale-prefix swap).
- `<html lang="en">` / `<html lang="fa" dir="rtl">` set correctly per locale (already required functionally, also matters for SEO).
- Canonical URLs are locale-specific (each locale's page is canonical to itself, linked via hreflang, not canonicalized to one "main" language).

## Sitemap & robots

- `app/sitemap.ts` generating a full sitemap: static routes + all published projects/blog posts, in both locales.
- `app/robots.ts` allowing full crawl of public routes, disallowing `/admin/*` and `/api/*`.
- Exclude draft (unpublished) content from the sitemap entirely.

## Performance as an SEO input

- Since public project/blog pages are statically generated with revalidation (`06_FRONTEND_ARCHITECTURE.md`), Core Web Vitals should be strong by default — keep it that way by being deliberate about client-side JS (most of the public site should ship little to no client JS beyond shadcn interactive components).
- Compress/serve images via `next/image`; don't let full-resolution uploads ship directly to the browser.

## Content-level SEO hygiene

- Every project/post requires a non-empty summary/excerpt field before it can be published (enforce in the admin form) — this becomes the meta description, so it shouldn't be an afterthought.
- Slugs are human-readable and stable — once published, avoid changing a slug (breaks inbound links/search indexing); if it must change, redirect the old slug.
