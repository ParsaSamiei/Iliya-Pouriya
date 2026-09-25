import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { normalizeDatabaseUrl } from "../lib/database-url";
import { seedCrmSampleData } from "../lib/crm/sample-data";

const connectionString = normalizeDatabaseUrl(process.env.DATABASE_URL!);
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const result = await seedCrmSampleData(db, { force: true });
  console.log(result);
  const [types, projects, funnel, settings] = await Promise.all([
    db.crmProjectType.count(),
    db.crmTrackedProject.count(),
    db.crmFunnelEntry.count(),
    db.crmSettings.findUnique({ where: { id: "default" } }),
  ]);
  console.log({ types, projects, funnel, public: settings?.publicReportEnabled });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
