# 00 — AI Instructions

Read this first, before touching any code. It's the entry point for any AI coding agent (Claude Code, Cursor, Copilot, etc.) working in this repo.

## What this project is

A dark-first, technical/engineering-themed portfolio site for two robotics & embedded systems engineers, with a fully supported light theme as a secondary option. Shared projects, individual bios, bilingual (English/Persian). Content is managed through a custom admin panel backed by Postgres — not markdown files, not a headless CMS.

## Read order for full context

1. `01_PRODUCT.md` — who this is for and why
2. `02_BRAND_IDENTITY.md` — visual/verbal identity
3. `03_Information_Architecture.md` — pages and content structure
4. `04_DESIGN_SYSTEM.md` — tokens, components
5. `05_DATABASE.md` — schema
6. `06_FRONTEND_ARCHITECTURE.md` — app structure
7. `07_ADMIN_PANEL.md` — auth + CRUD
8. `08_SEO.md`
9. `09_DEVELOPMENT_GUIDELINES.md` — versions, conventions, deployment
10. `10_ANALYTICS.md`
11. `i18n/README.md` — bilingual setup

## Stack summary (see 09 for exact pinned versions)

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config.js`)
- shadcn/ui (Base UI primitives, RTL-capable)
- Postgres (self-hosted) + Prisma ORM (v7 — see `09_DEVELOPMENT_GUIDELINES.md` for the exact pinned version)
- Auth.js (NextAuth) — email/password, admin-only
- next-intl — en/fa, with RTL for Persian
- File uploads stored on local disk on the VPS (not object storage)
- Optional per-project interactive STL viewer (three.js / @react-three/fiber), models uploaded through the admin panel
- Deployed self-hosted via Docker on a VPS (not Vercel)

## Hard rules for any agent working in this repo

- **Do not introduce a headless CMS or swap the DB for a SaaS backend.** Content management is a custom admin panel on purpose — that decision is final for v1.
- **Do not move uploads to S3/object storage** unless the docs are updated first. Local disk under a persisted volume is the deliberate choice for this deployment.
- **Do not deploy config toward Vercel** (no `vercel.json`, no edge-runtime-only assumptions that break self-hosting). Assume Docker + a Linux VPS + a reverse proxy (Caddy or Nginx) in front.
- **Every user-facing string goes through next-intl.** No hardcoded English strings in components — see `i18n/README.md`.
- **RTL is not an afterthought.** Any new component must be checked in both `en` (LTR) and `fa` (RTL) before it's considered done.
- **Follow the design tokens in `04_DESIGN_SYSTEM.md`.** Don't invent new colors, spacing, or fonts ad hoc — extend the token set if something is missing, don't hardcode arbitrary Tailwind values. This applies doubly to color: a hardcoded hex breaks the light theme, not just the dark one.
- **Admin routes are auth-gated server-side**, not just hidden client-side. See `07_ADMIN_PANEL.md`.
- **The STL viewer is a client component, dynamically imported, only on projects that have a model attached.** Never let three.js load on pages/projects without one, and always provide a non-WebGL fallback. See `06_FRONTEND_ARCHITECTURE.md`.
- **Database changes go through Prisma migrations.** Never hand-edit the schema directly on the server.
- When unsure which doc governs a decision, the more specific doc wins over this one, and `09_DEVELOPMENT_GUIDELINES.md` wins on anything about tooling/versions.

## What "done" looks like for any feature

- Works in both locales, both text directions
- Uses existing design tokens/components before adding new ones
- Passes lint/typecheck (`09_DEVELOPMENT_GUIDELINES.md`)
- Admin-editable content actually round-trips through the DB, not hardcoded
- No secrets committed; new env vars documented in `.env.example`
