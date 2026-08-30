# syntax=docker/dockerfile:1
FROM node:24-slim AS base
WORKDIR /app
RUN corepack disable 2>/dev/null || true

FROM base AS deps
COPY package.json package-lock.json* ./
# --ignore-scripts: postinstall runs `prisma generate`, which needs
# prisma/schema.prisma — not copied into this stage yet. The builder stage
# below copies the full source and runs `prisma generate` explicitly once
# the schema is actually present.
RUN npm install --legacy-peer-deps --ignore-scripts

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
RUN groupadd --system app && useradd --system --gid app app

COPY --from=builder /app/public ./public
COPY --from=builder --chown=app:app /app/.next/standalone ./
COPY --from=builder --chown=app:app /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
# Prisma 7's generated client (prisma/schema.prisma's generator `output`) —
# Next's standalone build already bundles it into the compiled server code
# since it's a local relative import, not a node_modules package, but this
# copy is a cheap safety net in case anything non-bundleable (e.g. wasm)
# slipped through the standalone build's file tracing.
COPY --from=builder --chown=app:app /app/generated ./generated

USER app
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
