# syntax=docker/dockerfile:1

# Same shape as Pishnam's infra/Dockerfile: deps cached on the lockfile,
# a one-off migrator that does not carry the Next build, and a standalone
# runner. Node 24 matches the image this app already built with; Alpine
# matches the Pishnam base.

# --- deps: install dependencies only (cached separately from source) ------
FROM node:24-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
# postinstall is `prisma generate`, which needs prisma/schema.prisma. The
# builder and migrator stages generate the client themselves. Skipping
# lifecycle scripts keeps this layer keyed to the lockfile.
RUN npm ci --ignore-scripts

# --- builder: generate Prisma client + build the Next.js app --------------
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Dummy values so `prisma generate` / `next build` can load prisma.config.ts
# (it calls env("DATABASE_URL")) and statically evaluate pages that do not
# hit the database. Real values come from the environment at runtime.
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
ENV AUTH_SECRET="build-time-placeholder"
ENV NEXT_TELEMETRY_DISABLED=1

# NEXT_PUBLIC_* is frozen into the bundle by `next build`. It is not read
# from the environment at runtime. Changing the public site URL requires a
# rebuild, not just an .env edit. See lib/seo.tsx.
ARG NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

RUN npx prisma generate
RUN npm run build

# --- migrator: one-off job -- applies migrations ---------------------------
#
# Built FROM deps, not FROM builder, so this image stays node_modules-sized
# instead of dragging .next along. `npm ci` above installed devDependencies,
# including the Prisma CLI and tsx.
#
# Default command is migrate only. `prisma/seed.ts` upserts placeholder
# content, so it is not run on every deploy. First boot:
#   docker compose run --rm migrator npx prisma db seed
FROM deps AS migrator
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="postgresql://user:pass@localhost:5432/db"
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
COPY lib/database-url.ts ./lib/database-url.ts
RUN npx prisma generate
CMD ["npx", "prisma", "migrate", "deploy"]

# --- runner: minimal production image --------------------------------------
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs nextjs

# Standalone output already includes a minimal node_modules + server.js.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Prisma 7 client lives in generated/prisma (schema generator output), not
# node_modules/.prisma. Standalone tracing usually bundles it; this copy
# covers anything non-bundleable that tracing skipped.
COPY --from=builder --chown=nextjs:nodejs /app/generated ./generated

# Uploads directory: created here so a fresh named volume inherits this
# owner and mode. 755, not 750. The nginx container mounts this volume
# read-only, but its worker processes drop to user nginx (uid 101). With
# 750 and owner nextjs:nodejs those workers cannot traverse the directory
# and every upload answers 403. On a directory the x bit is traverse
# permission. Uploaded files themselves stay non-executable (644 from
# writeFile).
RUN mkdir -p /app/uploads && chown nextjs:nodejs /app/uploads && chmod 755 /app/uploads

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
