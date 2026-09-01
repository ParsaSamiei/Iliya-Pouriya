import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
// Relative import, not the "@/" alias — tsx (which runs this script, see
// package.json's db:seed) doesn't resolve tsconfig path aliases on its own.
import { PrismaClient } from "../generated/prisma/client";
import { normalizeDatabaseUrl } from "../lib/database-url";

const raw = process.env.DATABASE_URL;
if (!raw) {
  throw new Error("DATABASE_URL is not set");
}
const connectionString = normalizeDatabaseUrl(raw);
const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });

/**
 * Seed data. The two Person rows use the real names from docs/05_DATABASE.md
 * (this table is meant to have exactly these two rows, forever) — everything
 * else (bios, sample project, sample post, admin passwords) is placeholder
 * content to replace via the admin panel / re-seed with real credentials
 * before going live. See docs/07_ADMIN_PANEL.md ("No public sign-up. Admin
 * accounts are seeded manually").
 */
async function main() {
  const iliya = await db.person.upsert({
    where: { slug: "iliya" },
    update: {
      nameEn: "Iliya Zahedi Abghari",
      nameFa: "ایلیا زاهدی عبقری",
    },
    create: {
      slug: "iliya",
      nameEn: "Iliya Zahedi Abghari",
      nameFa: "ایلیا زاهدی عبقری",
      title: "[Placeholder title] Embedded Systems Engineer",
      bioEn: "[Placeholder bio — replace via /admin/people]",
      bioFa: "[محتوای نمونه — از طریق پنل مدیریت جایگزین شود]",
      socialLinks: {},
      sortOrder: 0,
    },
  });

  const pouriya = await db.person.upsert({
    where: { slug: "pouriya" },
    update: {
      nameEn: "Pouriya Afshari Moghadam",
      nameFa: "پوریا افشاری مقدم",
    },
    create: {
      slug: "pouriya",
      nameEn: "Pouriya Afshari Moghadam",
      nameFa: "پوریا افشاری مقدم",
      title: "[Placeholder title] Robotics Engineer",
      bioEn: "[Placeholder bio — replace via /admin/people]",
      bioFa: "[محتوای نمونه — از طریق پنل مدیریت جایگزین شود]",
      socialLinks: {},
      sortOrder: 1,
    },
  });

  // Placeholder admin logins — CHANGE THESE before deploying anywhere
  // reachable. Password hashing uses bcryptjs per lib/auth.ts.
  const placeholderPasswordHash = await bcrypt.hash("change-me-now", 10);
  await db.admin.upsert({
    where: { email: "iliya@example.com" },
    update: {},
    create: { email: "iliya@example.com", passwordHash: placeholderPasswordHash },
  });
  await db.admin.upsert({
    where: { email: "pouriya@example.com" },
    update: {},
    create: { email: "pouriya@example.com", passwordHash: placeholderPasswordHash },
  });

  const project = await db.project.upsert({
    where: { slug: "placeholder-project" },
    update: {},
    create: {
      slug: "placeholder-project",
      titleEn: "[Placeholder] Sample Project",
      titleFa: "[محتوای نمونه] پروژه نمونه",
      summaryEn: "[Placeholder] Replace this with a real project via /admin/projects.",
      summaryFa: "[محتوای نمونه] این متن را از طریق پنل مدیریت جایگزین کنید.",
      contentEn:
        "# [Placeholder] Sample Project\n\nThis is **Markdown**, written and edited via `/admin/projects` " +
        "(GitHub-README-style Write/Preview editor). Replace it with real project writeup.\n\n" +
        "## Highlights\n\n- Point one\n- Point two\n- [Link example](https://example.com)\n\n" +
        "```\nconst example = true;\n```\n",
      contentFa:
        "# [محتوای نمونه] پروژه نمونه\n\nاین متن به صورت **مارک‌داون** نوشته شده و از طریق `/admin/projects` قابل ویرایش است.\n",
      tags: ["placeholder"],
      isFeatured: true,
      publishedAt: new Date(),
      sortOrder: 0,
      contributors: {
        create: [{ personId: iliya.id }, { personId: pouriya.id }],
      },
    },
  });

  await db.blogPost.upsert({
    where: { slug: "placeholder-post" },
    update: {},
    create: {
      slug: "placeholder-post",
      titleEn: "[Placeholder] Sample Post",
      titleFa: "[محتوای نمونه] نوشته نمونه",
      excerptEn: "[Placeholder] Replace this with a real post via /admin/blog.",
      excerptFa: "[محتوای نمونه] این متن را از طریق پنل مدیریت جایگزین کنید.",
      tags: ["placeholder"],
      publishedAt: new Date(),
      authors: { create: [{ personId: iliya.id }] },
    },
  });

  await db.siteSetting.upsert({
    where: { key: "about_page_copy" },
    update: {},
    create: {
      key: "about_page_copy",
      valueEn: "[Placeholder] Write the real About copy via /admin/settings.",
      valueFa: "[محتوای نمونه] متن واقعی درباره ما را از طریق پنل مدیریت بنویسید.",
    },
  });

  await db.siteSetting.upsert({
    where: { key: "hero_lab_panel" },
    update: {},
    create: {
      key: "hero_lab_panel",
      valueEn: {
        panelTitleEn: "Lab systems",
        panelTitleFa: "سیستم‌های آزمایشگاه",
        rows: [
          {
            labelEn: "Embedded",
            labelFa: "سیستم‌های نهفته",
            detailEn: "bare-metal · RTOS · MCU",
            detailFa: "bare-metal · RTOS · MCU",
            led: "accent",
          },
          {
            labelEn: "Controls",
            labelFa: "کنترل",
            detailEn: "closed-loop · real-time",
            detailFa: "closed-loop · real-time",
            led: "signal",
          },
          {
            labelEn: "Firmware",
            labelFa: "فریمور",
            detailEn: "drivers · protocols · OTA",
            detailFa: "درایور · پروتکل · OTA",
            led: "accent",
          },
          {
            labelEn: "Hardware",
            labelFa: "سخت‌افزار",
            detailEn: "schematic · PCB · bring-up",
            detailFa: "شماتیک · PCB · bring-up",
            led: "signal",
          },
        ],
      },
      valueFa: {
        panelTitleEn: "Lab systems",
        panelTitleFa: "سیستم‌های آزمایشگاه",
        rows: [
          {
            labelEn: "Embedded",
            labelFa: "سیستم‌های نهفته",
            detailEn: "bare-metal · RTOS · MCU",
            detailFa: "bare-metal · RTOS · MCU",
            led: "accent",
          },
          {
            labelEn: "Controls",
            labelFa: "کنترل",
            detailEn: "closed-loop · real-time",
            detailFa: "closed-loop · real-time",
            led: "signal",
          },
          {
            labelEn: "Firmware",
            labelFa: "فریمور",
            detailEn: "drivers · protocols · OTA",
            detailFa: "درایور · پروتکل · OTA",
            led: "accent",
          },
          {
            labelEn: "Hardware",
            labelFa: "سخت‌افزار",
            detailEn: "schematic · PCB · bring-up",
            detailFa: "شماتیک · PCB · bring-up",
            led: "signal",
          },
        ],
      },
    },
  });

  console.log("Seed complete:");
  console.log("  People:", iliya.nameEn, "/", pouriya.nameEn);
  console.log("  Project:", project.slug);
  console.log("  Admin logins: iliya@example.com / pouriya@example.com (password: change-me-now)");
  console.log("  ⚠ Replace the admin emails/password before deploying anywhere reachable.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
