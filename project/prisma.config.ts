import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Prisma 7 moved connection URLs and CLI settings out of schema.prisma —
 * this file is what `prisma migrate`, `prisma studio`, and `prisma
 * generate` read instead. The runtime PrismaClient (lib/db.ts) is
 * separate: it takes a driver adapter (@prisma/adapter-pg) built from the
 * same DATABASE_URL, since Prisma 7 removed the built-in connection engine
 * from the client itself. See https://pris.ly/d/config-datasource.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
