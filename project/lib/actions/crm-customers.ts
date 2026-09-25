"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { crmCustomerNoteSchema, crmCustomerSchema } from "@/lib/validation/crm";

export type ActionResult = { ok: true } | { ok: false; error: string };

async function requireAdmin(): Promise<{ error: ActionResult } | { email: string | null }> {
  const session = await auth();
  if (!session?.user?.id) return { error: { ok: false, error: "Unauthorized." } };
  return { email: session.user.email ?? null };
}

function revalidateCustomers(customerId?: string) {
  revalidatePath("/admin/crm");
  if (customerId) revalidatePath(`/admin/crm/customers/${customerId}`);
}

function parseOptionalDate(raw: string | null | undefined): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function createCrmCustomer(formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;

  const parsed = crmCustomerSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    company: String(formData.get("company") ?? ""),
    status: String(formData.get("status") ?? "ACTIVE"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await db.crmCustomer.create({
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      company: parsed.data.company,
      status: parsed.data.status,
    },
  });

  revalidateCustomers();
  return { ok: true };
}

export async function updateCrmCustomer(id: string, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;

  const parsed = crmCustomerSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    company: String(formData.get("company") ?? ""),
    status: String(formData.get("status") ?? "ACTIVE"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await db.crmCustomer.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "مشتری پیدا نشد." };

  await db.crmCustomer.update({
    where: { id },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      company: parsed.data.company,
      status: parsed.data.status,
    },
  });

  revalidateCustomers(id);
  return { ok: true };
}

export async function deleteCrmCustomer(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;

  await db.crmCustomer.delete({ where: { id } });
  revalidateCustomers();
  return { ok: true };
}

export async function createCrmCustomerNote(
  customerId: string,
  formData: FormData,
): Promise<ActionResult> {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;

  const parsed = crmCustomerNoteSchema.safeParse({
    kind: String(formData.get("kind") ?? ""),
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
    interactionType: String(formData.get("interactionType") ?? ""),
    occurredAt: String(formData.get("occurredAt") ?? ""),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const customer = await db.crmCustomer.findUnique({ where: { id: customerId } });
  if (!customer) return { ok: false, error: "مشتری پیدا نشد." };

  const occurredAt =
    parsed.data.kind === "INTERACTION"
      ? (parseOptionalDate(parsed.data.occurredAt) ?? new Date())
      : parseOptionalDate(parsed.data.occurredAt);

  await db.$transaction([
    db.crmCustomerNote.create({
      data: {
        customerId,
        kind: parsed.data.kind,
        title: parsed.data.title,
        body: parsed.data.body,
        interactionType: parsed.data.kind === "INTERACTION" ? parsed.data.interactionType : null,
        occurredAt,
        authorEmail: admin.email,
      },
    }),
    db.crmCustomer.update({
      where: { id: customerId },
      data: { updatedAt: new Date() },
    }),
  ]);

  revalidateCustomers(customerId);
  return { ok: true };
}

export async function deleteCrmCustomerNote(
  customerId: string,
  noteId: string,
): Promise<ActionResult> {
  const admin = await requireAdmin();
  if ("error" in admin) return admin.error;

  const note = await db.crmCustomerNote.findFirst({
    where: { id: noteId, customerId },
  });
  if (!note) return { ok: false, error: "یادداشت پیدا نشد." };

  await db.crmCustomerNote.delete({ where: { id: noteId } });
  revalidateCustomers(customerId);
  return { ok: true };
}
