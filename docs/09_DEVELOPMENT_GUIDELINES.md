# 09 — Development Guidelines

## Pinned versions (as of August 2026 — verify before a fresh install, these move)

| Tool                                            | Version                          | Notes                                                                                                                                                                                       |
| ----------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node.js                                         | **24.x LTS** ("Krypton")         | Active LTS, supported through Apr 2028. Node 26 is "Current" as of Aug 2026 and won't hit LTS until Oct 2026 — don't build on it yet for a self-hosted app that needs stability.            |
| Next.js                                         | **16.3.x**                       | Current stable LTS-equivalent release line. App Router only.                                                                                                                                |
| React                                           | **19.2.x**                       | `ref`-as-prop, no `forwardRef` needed in new components.                                                                                                                                    |
| Tailwind CSS                                    | **v4.3.x**                       | CSS-first config via `@theme`, no `tailwind.config.js`.                                                                                                                                     |
| shadcn/ui                                       | latest CLI (`npx shadcn@latest`) | Now defaults to Base UI primitives; RTL-capable.                                                                                                                                            |
| TypeScript                                      | latest stable                    | `next build` can use TS for type-checking directly.                                                                                                                                         |
| Postgres                                        | 16 or 17                         | Self-hosted via Docker.                                                                                                                                                                     |
| Prisma ORM                                      | **v7.7.x**                       | `prisma` + `@prisma/client`. This is the current stable/production-recommended line. Prisma 8 is in early access as of Aug 2026 and not yet recommended for production — don't build on it. |
| Auth.js (next-auth)                             | v5                               | Credentials provider.                                                                                                                                                                       |
| next-intl                                       | latest stable                    | Locale routing + RTL.                                                                                                                                                                       |
| three.js, @react-three/fiber, @react-three/drei | latest stable                    | STL model viewer on project pages — client-only, dynamically imported.                                                                                                                      |
| next-themes                                     | latest stable                    | Dark/light theme toggle, class-based, dark as default (`04_DESIGN_SYSTEM.md`).                                                                                                              |
| Package manager                                 | npm                              | Ships with Node, no extra tooling to learn/install. If a React 19 peer-dependency conflict comes up, use `npm install --legacy-peer-deps` rather than switching package managers.           |

Re-check `next.js`, `react`, and `tailwindcss` release notes at project kickoff — these are fast-moving and this table is a snapshot, not a promise.

## Repo conventions

- **Language:** TypeScript everywhere, `strict` mode on. No `any` without a comment explaining why.
- **Formatting/linting:** Biome (formatter + linter in one tool) — faster than separate ESLint+Prettier, and Next.js 16's tooling plays well with it. If the team prefers, ESLint (Next's default config) + Prettier is an acceptable substitute; pick one and don't mix.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`) — makes it easy to scan history on a two-person repo without heavier tooling.
- **Branching:** trunk-based is fine at this scale — short-lived feature branches, PR (even self-reviewed) before merging to `main`, no long-lived `develop` branch needed.

## Environment variables

- `.env.example` checked in with every required var documented; real `.env` never committed.
- Expected vars: `DATABASE_URL`, `AUTH_SECRET`, `UPLOAD_DIR`, SMTP/email vars if contact notifications are wired up (`07_ADMIN_PANEL.md`).

## Local development

```bash
npm install
npm run db:up        # docker compose up postgres (see below)
npm run db:migrate
npm run dev
```

## Testing

- Given the scope (two-person portfolio, not a large product), full E2E coverage isn't a priority. Worth having:
  - Type-checking (`tsc --noEmit`) and lint in CI as the baseline gate.
  - A handful of Playwright smoke tests for the critical paths: homepage loads in both locales, project detail renders, contact form submits, admin login gate works. Not a large suite.
- Skip unit-testing simple presentational components; do test the contact-form and admin-mutation server actions since those touch the DB.

## Deployment — self-hosted, Docker, VPS

This project deploys to a **self-hosted VPS**, not Vercel. Keep that constraint in mind throughout — no dependence on Vercel-only features (e.g. no reliance on Vercel Blob/Edge Config).

```
docker-compose.yml
  services:
    app        → Next.js production build, `next start`
    postgres   → Postgres, with a named volume for data
    (reverse proxy — Caddy or Nginx — either in the same compose file or
     managed separately on the VPS, handling TLS + serving /uploads directly)
```

- **Uploads volume:** a persisted Docker volume (or bind mount) at the path referenced in `05_DATABASE.md`/`07_ADMIN_PANEL.md` (e.g. `/var/app-data/uploads`) — must survive container recreation and be included in backups.
- **Postgres volume:** likewise persisted and backed up. A simple `pg_dump` cron job to off-VPS storage is enough at this scale — don't over-engineer backup infra for a two-person portfolio.
- **TLS:** Nginx + certbot.
- **CI:** a simple pipeline (GitHub Actions) that runs lint/typecheck/tests on PR, and on merge to `main` builds the Docker image and deploys via SSH (or a `docker compose pull && up -d` on the VPS triggered by the pipeline).

## What NOT to do

- Don't reach for Vercel-specific deployment tooling.
- Don't add a second database or ORM "just in case" — Postgres + Prisma covers everything in `05_DATABASE.md`.
- Don't adopt Prisma 8 while it's still in early access — stay on the v7 line until it's GA and this doc is updated.
- Don't over-build the admin panel with roles/permissions — two trusted owners, full access each (`07_ADMIN_PANEL.md`).
