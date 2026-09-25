"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { CRM_FUNNEL_STAGES } from "@/lib/crm/types";
import { db } from "@/lib/db";
import {
  crmFunnelMonthSchema,
  crmProjectTypeSchema,
  crmSettingsSchema,
  crmTrackedProjectSchema,
} from "@/lib/validation/crm";

export type ActionResult = { ok: true } | { ok: false; error: string };

async function requireAdmin(): Promise<ActionResult | null> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized." };
  return null;
}

function revalidateCrm() {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/crm");
  revalidatePath("/[locale]/report", "page");
}

function parseOptionalDate(raw: string | null | undefined): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function monthStartFromInput(raw: string): Date | null {
  const match = /^(\d{4})-(\d{2})$/.exec(raw.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return new Date(Date.UTC(year, month - 1, 1));
}

export async function updateCrmSettings(formData: FormData): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const satRaw = String(formData.get("customerSatisfaction") ?? "").trim();
  const parsed = crmSettingsSchema.safeParse({
    publicReportEnabled: formData.get("publicReportEnabled") === "on",
    customerSatisfaction: satRaw === "" ? null : Number(satRaw),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await db.crmSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      publicReportEnabled: parsed.data.publicReportEnabled,
      customerSatisfaction: parsed.data.customerSatisfaction ?? null,
    },
    update: {
      publicReportEnabled: parsed.data.publicReportEnabled,
      customerSatisfaction: parsed.data.customerSatisfaction ?? null,
    },
  });

  revalidateCrm();
  return { ok: true };
}

function fillBilingual(en: string, fa: string): { en: string; fa: string } {
  const e = en.trim();
  const f = fa.trim();
  const primary = e || f;
  return { en: e || primary, fa: f || primary };
}

const STATUS_PROGRESS: Record<string, number> = {
  ON_TRACK: 40,
  AT_RISK: 55,
  DELAYED: 60,
  DELIVERED: 100,
  FAILED: 100,
};

export async function createCrmProjectType(formData: FormData): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const names = fillBilingual(
    String(formData.get("nameEn") ?? ""),
    String(formData.get("nameFa") ?? ""),
  );
  const parsed = crmProjectTypeSchema.safeParse({
    nameEn: names.en,
    nameFa: names.fa,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const count = await db.crmProjectType.count();
  await db.crmProjectType.create({
    data: {
      nameEn: parsed.data.nameEn,
      nameFa: parsed.data.nameFa || parsed.data.nameEn,
      sortOrder: count,
    },
  });

  revalidateCrm();
  return { ok: true };
}

export async function updateCrmProjectType(id: string, formData: FormData): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const names = fillBilingual(
    String(formData.get("nameEn") ?? ""),
    String(formData.get("nameFa") ?? ""),
  );
  const parsed = crmProjectTypeSchema.safeParse({
    nameEn: names.en,
    nameFa: names.fa,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await db.crmProjectType.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Not found." };

  await db.crmProjectType.update({
    where: { id },
    data: {
      nameEn: parsed.data.nameEn,
      nameFa: parsed.data.nameFa || parsed.data.nameEn,
    },
  });
  revalidateCrm();
  return { ok: true };
}

export async function deleteCrmProjectType(id: string): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const inUse = await db.crmTrackedProject.count({ where: { typeId: id } });
  if (inUse > 0) {
    return { ok: false, error: "این دسته در پروژه‌ها استفاده شده. اول پروژه‌ها را عوض کنید." };
  }

  await db.crmProjectType.delete({ where: { id } });
  revalidateCrm();
  return { ok: true };
}

function parseTrackedProjectForm(formData: FormData) {
  const revenueRaw = String(formData.get("revenue") ?? "").trim();
  const status = String(formData.get("status") ?? "ON_TRACK");
  const progressRaw = String(formData.get("progress") ?? "").trim();
  const name = fillBilingual(
    String(formData.get("nameEn") ?? ""),
    String(formData.get("nameFa") ?? ""),
  );
  const client = fillBilingual(
    String(formData.get("clientNameEn") ?? ""),
    String(formData.get("clientNameFa") ?? ""),
  );
  const quote = fillBilingual(
    String(formData.get("quoteEn") ?? ""),
    String(formData.get("quoteFa") ?? ""),
  );

  return crmTrackedProjectSchema.safeParse({
    nameEn: name.en,
    nameFa: name.fa,
    clientNameEn: client.en,
    clientNameFa: client.fa,
    typeId: String(formData.get("typeId") ?? ""),
    progress: progressRaw === "" ? (STATUS_PROGRESS[status] ?? 0) : progressRaw,
    status,
    deliveryDate: String(formData.get("deliveryDate") ?? "") || null,
    completedAt: String(formData.get("completedAt") ?? "") || null,
    revenue: revenueRaw === "" ? null : revenueRaw,
    isNewCustomer: formData.get("isNewCustomer") === "on",
    showOnPublic: formData.get("showOnPublic") === "on",
    coverImageUrl: String(formData.get("coverImageUrl") ?? "") || null,
    quoteEn: quote.en || null,
    quoteFa: quote.fa || null,
  });
}

function toProjectWriteData(data: z.infer<typeof crmTrackedProjectSchema>) {
  const terminal = data.status === "DELIVERED" || data.status === "FAILED";
  const progress =
    data.progress && data.progress > 0
      ? data.progress
      : (STATUS_PROGRESS[data.status] ?? 0);

  return {
    nameEn: data.nameEn,
    nameFa: data.nameFa || data.nameEn,
    clientNameEn: data.clientNameEn,
    clientNameFa: data.clientNameFa || data.clientNameEn,
    typeId: data.typeId,
    progress: terminal ? 100 : progress,
    status: data.status,
    deliveryDate: parseOptionalDate(data.deliveryDate ?? null),
    completedAt: terminal
      ? (parseOptionalDate(data.completedAt ?? null) ?? new Date())
      : parseOptionalDate(data.completedAt ?? null),
    revenue: data.revenue == null ? null : new Prisma.Decimal(data.revenue),
    isNewCustomer: data.isNewCustomer,
    showOnPublic: data.showOnPublic,
    coverImageUrl: data.coverImageUrl || null,
    quoteEn: data.quoteEn || null,
    quoteFa: data.quoteFa || null,
  };
}

export async function createCrmTrackedProject(formData: FormData): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const parsed = parseTrackedProjectForm(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const type = await db.crmProjectType.findUnique({ where: { id: parsed.data.typeId } });
  if (!type) return { ok: false, error: "Project type not found." };

  await db.crmTrackedProject.create({ data: toProjectWriteData(parsed.data) });
  revalidateCrm();
  return { ok: true };
}

export async function updateCrmTrackedProject(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const parsed = parseTrackedProjectForm(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await db.crmTrackedProject.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Not found." };

  const type = await db.crmProjectType.findUnique({ where: { id: parsed.data.typeId } });
  if (!type) return { ok: false, error: "Project type not found." };

  await db.crmTrackedProject.update({
    where: { id },
    data: toProjectWriteData(parsed.data),
  });
  revalidateCrm();
  return { ok: true };
}

export async function deleteCrmTrackedProject(id: string): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  await db.crmTrackedProject.delete({ where: { id } });
  revalidateCrm();
  return { ok: true };
}

export async function upsertCrmFunnelMonth(formData: FormData): Promise<ActionResult> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const parsed = crmFunnelMonthSchema.safeParse({
    month: String(formData.get("month") ?? ""),
    FIRST_CONTACT: String(formData.get("FIRST_CONTACT") ?? "0"),
    QUALIFIED: String(formData.get("QUALIFIED") ?? "0"),
    PROPOSAL: String(formData.get("PROPOSAL") ?? "0"),
    IN_PROGRESS: String(formData.get("IN_PROGRESS") ?? "0"),
    DELIVERED: String(formData.get("DELIVERED") ?? "0"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const month = monthStartFromInput(parsed.data.month);
  if (!month) return { ok: false, error: "Invalid month." };

  await db.$transaction(
    CRM_FUNNEL_STAGES.map((stage) =>
      db.crmFunnelEntry.upsert({
        where: { month_stage: { month, stage } },
        create: { month, stage, count: parsed.data[stage] },
        update: { count: parsed.data[stage] },
      }),
    ),
  );

  revalidateCrm();
  return { ok: true };
}

export async function loadCrmSampleData(force = false): Promise<ActionResult & { reason?: string }> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { seedCrmSampleData } = await import("@/lib/crm/sample-data");
  const result = await seedCrmSampleData(db, { force });
  if (!result.seeded) {
    return {
      ok: false,
      error:
        "چون از قبل پروژه دارید، نمونه رد شد. برای پاک‌کردن و بارگذاری دوباره از «جایگزینی با دادهٔ نمونه» استفاده کنید.",
      reason: result.reason,
    };
  }

  revalidateCrm();
  return { ok: true };
}
