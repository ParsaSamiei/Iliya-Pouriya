# 03 — Information Architecture

## Sitemap

All public routes are locale-prefixed (see `i18n/README.md`): `/en/...` and `/fa/...`, with a root redirect to a detected/default locale.

```
/                          → redirect to /en or /fa
/[locale]                  → Home
/[locale]/projects         → Projects index (shared, filterable by contributor/tag)
/[locale]/projects/[slug]  → Project detail
/[locale]/about            → About/landing for "the two of us" (short, links out to profiles)
/[locale]/team/[person]    → Individual profile (bio, experience, skills, resume link)
                              e.g. /en/team/iliya, /en/team/pouriya, /fa/team/iliya, /fa/team/pouriya
/[locale]/blog             → Blog index
/[locale]/blog/[slug]      → Blog post
/[locale]/contact          → Contact form
/[locale]/resume/[person]  → Resume/CV download (redirects to PDF asset, or served inline)

/admin                     → Admin login (not locale-prefixed, single interface language is fine)
/admin/dashboard
/admin/people              → edit each person's profile: name, title, photo, bio, per-person social links (github, linkedin, etc.)
/admin/projects            → CRUD
/admin/experience          → CRUD (per person)
/admin/skills              → CRUD (per person)
/admin/blog                → CRUD
/admin/messages            → View contact submissions
/admin/resume              → Upload/replace resume PDFs
/admin/settings            → Site-level settings shared across the whole site (homepage tagline, contact page copy) — not per-person data, that's /admin/people
```

## Home page structure

1. Hero — both names, shared tagline, primary CTA (view projects / contact)
2. Featured projects (2–3 pulled from Projects, admin-flagged "featured")
3. Quick intro to each person with link to their profile
4. Skills/tools snapshot (combined highlight, not the full list)
5. Recent blog posts (2–3)
6. Contact CTA

## Projects index

- Grid/list of project cards: title, cover image, short description, tags (hardware/software/domain), contributor avatars
- Filter by contributor and/or tag
- Each card links to project detail

## Project detail page

- Title, summary, cover media, gallery (images/video)
- **3D/STL viewer** — optional, shown only if the project has one or more models attached. Interactive: orbit/zoom/pan, wireframe toggle, and a model picker if more than one STL is attached (e.g. full assembly vs. individual parts). See `06_FRONTEND_ARCHITECTURE.md` for implementation and `07_ADMIN_PANEL.md` for how models are uploaded.
- Contributors (one or both people, linking to their profiles)
- Tech/tools used (tags)
- Long-form description (rich text, admin-authored)
- Optional: links (GitHub, demo video, publication)
- Optional: related blog posts

## Individual profile page (`/team/[person]`)

- Photo, name, title/focus
- Bio (long-form, admin-authored)
- Work experience & timeline (chronological list: role, org, dates, description)
- Skills & tools (categorized: hardware, software/firmware, other)
- Resume download button
- Contact/social links
- Projects they've contributed to (auto-pulled from shared Projects data)

## Blog

- Index: chronological list, tag filter, author attribution (which person wrote it, or both)
- Post: title, cover image, rich content, author(s), publish date, related posts

## Contact page

- Form (name, email, message, optional "who is this for" — either person or both)
- Submits to backend, stored in DB, surfaced in `/admin/messages`
- Direct email/social links as fallback

## Content ownership model

- **Projects, blog posts:** shared entities, each with a many-to-many link to one or both people as contributors/authors (see `05_DATABASE.md`)
- **Experience, skills, bio, resume:** owned by exactly one person
- **Contact messages:** shared inbox, not per-person
