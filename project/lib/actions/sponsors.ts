"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { deleteUpload } from "@/lib/uploads";
import { sponsorSchema } from "@/lib/validation/sponsor";

export type ActionResult = { ok: true } | { ok: false; error: string };

function parseSponsorForm(formData: FormData) {
  return sponsorSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    logoUrl: String(formData.get("logoUrl") ?? "") || undefined,
    url: String(formData.get("url") ?? "") || undefined,
    isPublished: formData.get("isPublished") === "on",
  });
}

function revalidateSponsorPaths() {
  revalidatePath("/admin/sponsors");
  // Footer lives in the locale layout — refresh every public page.
  revalidatePath("/[locale]", "layout");
}

export async function createSponsor(formData: FormData): Promise<ActionResult> {
  const parsed = parseSponsorForm(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const count = await db.sponsor.count();
  await db.sponsor.create({
    data: { ...parsed.data, sortOrder: count },
  });

  revalidateSponsorPaths();
  return { ok: true };
}

export async function updateSponsor(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = parseSponsorForm(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await db.sponsor.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Not found." };

  const nextLogo = parsed.data.logoUrl ?? null;
  if (existing.logoUrl && existing.logoUrl !== nextLogo) {
    await deleteUpload(existing.logoUrl);
  }

  await db.sponsor.update({
    where: { id },
    data: parsed.data,
  });

  revalidateSponsorPaths();
  return { ok: true };
}

export async function deleteSponsor(id: string): Promise<ActionResult> {
  const existing = await db.sponsor.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Not found." };

  if (existing.logoUrl) await deleteUpload(existing.logoUrl);
  await db.sponsor.delete({ where: { id } });

  revalidateSponsorPaths();
  return { ok: true };
}

export async function reorderSponsors(orderedIds: string[]): Promise<ActionResult> {
  await db.$transaction(
    orderedIds.map((id, index) =>
      db.sponsor.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );

  revalidateSponsorPaths();
  return { ok: true };
}
