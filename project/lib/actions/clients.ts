"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { deleteUpload } from "@/lib/uploads";
import { clientSchema } from "@/lib/validation/client";

export type ActionResult = { ok: true } | { ok: false; error: string };

function parseClientForm(formData: FormData) {
  return clientSchema.safeParse({
    nameEn: String(formData.get("nameEn") ?? ""),
    nameFa: String(formData.get("nameFa") ?? ""),
    noteEn: String(formData.get("noteEn") ?? "") || undefined,
    noteFa: String(formData.get("noteFa") ?? "") || undefined,
    logoUrl: String(formData.get("logoUrl") ?? "") || undefined,
    url: String(formData.get("url") ?? "") || undefined,
    isPublished: formData.get("isPublished") === "on",
  });
}

function revalidateClientPaths() {
  revalidatePath("/admin/clients");
  revalidatePath("/[locale]", "page");
}

export async function createClient(formData: FormData): Promise<ActionResult> {
  const parsed = parseClientForm(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const count = await db.client.count();
  await db.client.create({
    data: { ...parsed.data, sortOrder: count },
  });

  revalidateClientPaths();
  return { ok: true };
}

export async function updateClient(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = parseClientForm(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await db.client.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Not found." };

  const nextLogo = parsed.data.logoUrl ?? null;
  if (existing.logoUrl && existing.logoUrl !== nextLogo) {
    await deleteUpload(existing.logoUrl);
  }

  await db.client.update({
    where: { id },
    data: parsed.data,
  });

  revalidateClientPaths();
  return { ok: true };
}

export async function deleteClient(id: string): Promise<ActionResult> {
  const existing = await db.client.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Not found." };

  if (existing.logoUrl) await deleteUpload(existing.logoUrl);
  await db.client.delete({ where: { id } });

  revalidateClientPaths();
  return { ok: true };
}

export async function reorderClients(orderedIds: string[]): Promise<ActionResult> {
  await db.$transaction(
    orderedIds.map((id, index) =>
      db.client.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );

  revalidateClientPaths();
  return { ok: true };
}
