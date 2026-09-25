import type { PrismaClient } from "../../generated/prisma/client";
import { CRM_FUNNEL_STAGES } from "./types";

type Db = PrismaClient;

function monthsAgo(n: number): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - n, 1));
}

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + n);
  return d;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

/**
 * Idempotent sample CRM dataset for demos / empty installs.
 * Skips entirely when any tracked project already exists (unless `force`).
 */
export async function seedCrmSampleData(db: Db, options?: { force?: boolean }) {
  const existing = await db.crmTrackedProject.count();
  if (existing > 0 && !options?.force) {
    return { seeded: false as const, reason: "already-has-data" as const };
  }

  if (options?.force) {
    await db.crmFunnelEntry.deleteMany();
    await db.crmTrackedProject.deleteMany();
    await db.crmProjectType.deleteMany();
  }

  await db.crmSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      publicReportEnabled: true,
      customerSatisfaction: 96,
    },
    update: {
      publicReportEnabled: true,
      customerSatisfaction: 96,
    },
  });

  const types = [
    { nameEn: "Embedded systems", nameFa: "سیستم‌های نهفته", sortOrder: 0 },
    { nameEn: "Robotics", nameFa: "رباتیک", sortOrder: 1 },
    { nameEn: "Firmware", nameFa: "فریمور", sortOrder: 2 },
    { nameEn: "Hardware", nameFa: "سخت‌افزار", sortOrder: 3 },
  ];

  const createdTypes = [];
  for (const t of types) {
    const row = await db.crmProjectType.create({ data: t });
    createdTypes.push(row);
  }

  const [embedded, robotics, firmware, hardware] = createdTypes;

  await db.crmTrackedProject.createMany({
    data: [
      {
        nameEn: "Gripper arm v2",
        nameFa: "بازو گیرنده نسخه ۲",
        clientNameEn: "Field Robotics Co.",
        clientNameFa: "شرکت رباتیک میدانی",
        typeId: robotics.id,
        progress: 100,
        status: "DELIVERED",
        deliveryDate: daysAgo(40),
        completedAt: daysAgo(45),
        revenue: 18500,
        isNewCustomer: true,
        showOnPublic: true,
        quoteEn: "They shipped a control stack that held up on the first field trial.",
        quoteFa: "پشته کنترلی تحویل دادند که در اولین آزمایش میدانی دوام آورد.",
      },
      {
        nameEn: "Sensor hub MCU",
        nameFa: "هاب سنسور MCU",
        clientNameEn: "Example Lab",
        clientNameFa: "آزمایشگاه نمونه",
        typeId: embedded.id,
        progress: 100,
        status: "DELIVERED",
        deliveryDate: daysAgo(90),
        completedAt: daysAgo(88),
        revenue: 12200,
        isNewCustomer: true,
        showOnPublic: true,
        quoteEn: "Clear bring-up plan and honest timelines — exactly what we needed.",
        quoteFa: "برنامه راه‌اندازی شفاف و زمان‌بندی صادقانه — دقیقاً همان چیزی که لازم داشتیم.",
      },
      {
        nameEn: "OTA bootloader",
        nameFa: "بوت‌لودر OTA",
        clientNameEn: "University Workshop",
        clientNameFa: "کارگاه دانشگاهی",
        typeId: firmware.id,
        progress: 100,
        status: "DELIVERED",
        deliveryDate: daysAgo(20),
        completedAt: daysAgo(25),
        revenue: 9800,
        isNewCustomer: false,
        showOnPublic: true,
        quoteEn: "Firmware landed clean — we flashed production units the same week.",
        quoteFa: "فریمور تمیز رسید — همان هفته واحدهای تولیدی را فلش کردیم.",
      },
      {
        nameEn: "Motor driver PCB",
        nameFa: "PCB درایور موتور",
        clientNameEn: "Field Robotics Co.",
        clientNameFa: "شرکت رباتیک میدانی",
        typeId: hardware.id,
        progress: 100,
        status: "FAILED",
        deliveryDate: daysAgo(60),
        completedAt: daysAgo(55),
        revenue: null,
        isNewCustomer: false,
        showOnPublic: false,
      },
      {
        nameEn: "Mobile base firmware",
        nameFa: "فریمور پایه متحرک",
        clientNameEn: "Example Lab",
        clientNameFa: "آزمایشگاه نمونه",
        typeId: firmware.id,
        progress: 72,
        status: "ON_TRACK",
        deliveryDate: daysFromNow(35),
        completedAt: null,
        revenue: 15000,
        isNewCustomer: true,
        showOnPublic: false,
      },
      {
        nameEn: "Vision mount redesign",
        nameFa: "بازطراحی پایه ویژن",
        clientNameEn: "University Workshop",
        clientNameFa: "کارگاه دانشگاهی",
        typeId: hardware.id,
        progress: 45,
        status: "AT_RISK",
        deliveryDate: daysFromNow(14),
        completedAt: null,
        revenue: 6400,
        isNewCustomer: true,
        showOnPublic: false,
      },
      {
        nameEn: "Battery BMS bring-up",
        nameFa: "راه‌اندازی BMS باتری",
        clientNameEn: "Field Robotics Co.",
        clientNameFa: "شرکت رباتیک میدانی",
        typeId: embedded.id,
        progress: 58,
        status: "DELAYED",
        deliveryDate: daysAgo(5),
        completedAt: null,
        revenue: 11000,
        isNewCustomer: false,
        showOnPublic: false,
      },
      {
        nameEn: "Closed-loop demo rig",
        nameFa: "ریگ دمو حلقه بسته",
        clientNameEn: "Example Lab",
        clientNameFa: "آزمایشگاه نمونه",
        typeId: robotics.id,
        progress: 100,
        status: "DELIVERED",
        deliveryDate: daysAgo(150),
        completedAt: daysAgo(148),
        revenue: 21000,
        isNewCustomer: true,
        showOnPublic: false,
      },
    ],
  });

  // Funnel for the last 6 months (roughly declining toward delivery)
  for (let i = 5; i >= 0; i--) {
    const month = monthsAgo(i);
    const scale = 1 + (5 - i) * 0.08;
    const counts = {
      FIRST_CONTACT: Math.round(18 * scale),
      QUALIFIED: Math.round(12 * scale),
      PROPOSAL: Math.round(8 * scale),
      IN_PROGRESS: Math.round(5 * scale),
      DELIVERED: Math.round(3 * scale),
    };
    for (const stage of CRM_FUNNEL_STAGES) {
      await db.crmFunnelEntry.upsert({
        where: { month_stage: { month, stage } },
        create: { month, stage, count: counts[stage] },
        update: { count: counts[stage] },
      });
    }
  }

  return { seeded: true as const, reason: "ok" as const };
}
