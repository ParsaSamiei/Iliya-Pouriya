# 06 — Frontend Architecture

## Framework

Next.js 16 (App Router), React 19, TypeScript throughout. See `09_DEVELOPMENT_GUIDELINES.md` for exact pinned versions.

## Folder structure

```
/app
  /[locale]
    layout.tsx            → sets <html lang dir>, loads locale messages
    page.tsx               → Home
    /projects
      page.tsx
      /[slug]/page.tsx
    /team/[person]/page.tsx
    /blog
      page.tsx
      /[slug]/page.tsx
    /about/page.tsx
    /contact/page.tsx
    /resume/[person]/route.ts   → redirects/serves PDF
  /admin
    layout.tsx             → auth check, admin shell
    /login/page.tsx
    /dashboard/page.tsx
    /projects/...           → CRUD screens
    /experience/...
    /skills/...
    /blog/...
    /messages/page.tsx
    /settings/page.tsx
  /api
    /auth/[...nextauth]/route.ts
    /contact/route.ts        → contact form submission
    /admin/**                → server actions preferred over API routes where possible

/components
  /ui                        → shadcn/ui components (generated, lightly themed)
  /site                       → public-site composed components (ProjectCard, Hero, etc.)
  /admin                      → admin-only composed components (forms, tables)

/lib
  db.ts                        → Prisma client singleton
  auth.ts                      → Auth.js config
  validation/                   → Zod schemas (mirrors prisma/schema.prisma)
  uploads.ts                    → local-disk upload handling

/i18n
  routing.ts                    → next-intl locale config
  request.ts
  /messages
    en.json
    fa.json

/prisma
  schema.prisma                → single source of truth for the data model (05_DATABASE.md)
  /migrations                   → generated migrations
```

## Rendering strategy

- **Public pages:** Server Components by default. Data fetched directly via the Prisma client in the page/layout (no need for a separate API layer for content the app itself renders).
- **Static-ish content** (project detail, blog post): use `generateStaticParams` + revalidation (ISR-style `revalidate`) since content changes only when the admin publishes something — no need for fully dynamic rendering on every request.
- **Admin panel:** fully dynamic, server-rendered, no caching of admin data views.
- **Contact form + admin mutations:** Server Actions preferred over hand-rolled API routes; fall back to route handlers only where a plain HTTP endpoint is genuinely needed (e.g. resume file serving).

## Data fetching

- All DB access goes through `/lib/db.ts` (the Prisma client) — no direct SQL scattered in components.
- Public pages only ever query `published_at IS NOT NULL` content; draft content is only visible through `/admin`.
- No client-side data fetching library (SWR/React Query) needed for the public site — Server Components cover it. Admin panel can use simple `useActionState`/form-based mutations rather than pulling in a client data layer, given the scale.

## Media handling

- Uploaded images/video referenced by URL path served from the local-disk volume (see `05_DATABASE.md`, `09_DEVELOPMENT_GUIDELINES.md`) through a route handler or directly via the reverse proxy — decide at build time whether Nginx/Caddy serves `/uploads/*` directly (simpler, faster) vs. proxying through Next.js (simpler permissions model). Default recommendation: serve directly via the reverse proxy for static files, bypassing Next.js entirely.
- Use `next/image` for all rendered images for automatic optimization, pointed at the local upload path.

## STL viewer

Projects may have one or more `.stl` models attached (`05_DATABASE.md`'s `project_models` table), rendered as an interactive 3D viewer on the project detail page.

- **Library:** `three.js` + `@react-three/fiber` (React renderer for three.js) + `@react-three/drei` (helpers — `OrbitControls`, `Stage`/lighting, `useLoader`) + three's built-in `STLLoader`. This is the standard, well-maintained combination for STL-in-React and avoids hand-rolling WebGL setup.
- **Component boundary:** the viewer is a **Client Component** (`"use client"`) — three.js needs the browser/WebGL context. It's dynamically imported (`next/dynamic`, `ssr: false`) from the otherwise server-rendered project detail page, so it doesn't add to server-render cost or block the rest of the page.
- **Loading pattern:** show a lightweight placeholder (matching the blueprint-grid motif from `04_DESIGN_SYSTEM.md` — e.g. a static wireframe-cube icon) while the model streams in, then swap to the live canvas once loaded. Don't block the rest of the page on model load.
- **Multiple models per project:** if `project_models` returns more than one row, render a small model picker (tabs or a dropdown, styled with the monospace/technical label treatment) above the canvas; default to the first by `sort_order`.
- **Controls:** orbit + zoom + pan via `OrbitControls`, auto-rotate optional (off by default — let the visitor drive), a wireframe/solid toggle fits the blueprint aesthetic nicely and is cheap to add (`material.wireframe = true`).
- **Styling:** canvas background transparent or matching `--color-surface`, with the model rendered in `--color-fg`/`--color-accent` tones rather than three.js's default gray — keep it visually consistent with the rest of the design system rather than looking like a bolted-on generic 3D demo.
- **Performance/fallback:**
  - Lazy-load the whole three.js bundle only when a project actually has a model attached — don't ship it on pages without one.
  - Cap accepted STL file size at upload time (`07_ADMIN_PANEL.md`) so the viewer isn't asked to render an unreasonably dense mesh in-browser.
  - Detect missing WebGL support and fall back to a static message + a plain "download STL" link rather than a broken canvas.
  - Respect `prefers-reduced-motion` — disable any auto-rotation if set.

```
/components/site/StlViewer.tsx     → client component, dynamic-imported from project detail page
```

## Forms

- shadcn/ui `form` (React Hook Form + Zod) for both the public contact form and all admin CRUD forms — one validation pattern used consistently.
- Zod schemas shared between client validation and server action validation where practical (define once in `/lib/validation`, kept in sync with the models in `prisma/schema.prisma`).

## Error/loading states

- Standard Next.js `loading.tsx`/`error.tsx` per route segment.
- Admin mutations surface errors via shadcn `sonner` toasts; public contact form shows inline success/error state.
