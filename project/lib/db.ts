import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { normalizeDatabaseUrl } from "@/lib/database-url";

/**
 * Prisma client singleton — see docs/06_FRONTEND_ARCHITECTURE.md:
 * "All DB access goes through /lib/db.ts — no direct SQL scattered in
 * components." The globalThis cache avoids exhausting Postgres connections
 * from hot-reloaded module instances in dev.
 *
 * Prisma 7 removed the client's built-in connection engine — it now
 * requires an explicit driver adapter. @prisma/adapter-pg wraps the plain
 * `pg` driver, which is also what prisma.config.ts's CLI-side connection
 * uses conceptually (same DATABASE_URL, different consumer).
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not set");
  }
  const connectionString = normalizeDatabaseUrl(raw);
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
