"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { galleryTagSchema } from "@/lib/validation/gallery-tag";

export type ActionResult = { ok: true } | { ok: false; error: string };

function parseGalleryTagForm(formData: FormData) {
  return galleryTagSchema.safeParse({
    slug: String(formData.get("slug") ?? ""),
    nameEn: String(formData.get("nameEn") ?? ""),
    nameFa: String(formData.get("nameFa") ?? ""),
    sortOrder: String(formData.get("sortOrder") ?? "0"),
    isActive: formData.get("isActive") === "on",
  });
}

function revalidateGalleryTagPaths() {
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/gallery-tags");
  revalidatePath("/[locale]/gallery", "page");
}

export async function createGalleryTag(formData: FormData): Promise<ActionResult> {
  const parsed = parseGalleryTagForm(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await db.galleryTag.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { ok: false, error: "That slug is already in use." };

  const count = await db.galleryTag.count();
  await db.galleryTag.create({
    data: { ...parsed.data, sortOrder: parsed.data.sortOrder || count },
  });

  revalidateGalleryTagPaths();
  return { ok: true };
}

export async function updateGalleryTag(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = parseGalleryTagForm(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await db.galleryTag.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Not found." };

  const slugTaken = await db.galleryTag.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (slugTaken) return { ok: false, error: "That slug is already in use." };

  await db.galleryTag.update({ where: { id }, data: parsed.data });
  revalidateGalleryTagPaths();
  return { ok: true };
}

export async function deleteGalleryTag(id: string): Promise<ActionResult> {
  const existing = await db.galleryTag.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Not found." };

  await db.galleryTag.delete({ where: { id } });
  revalidateGalleryTagPaths();
  return { ok: true };
}

export async function reorderGalleryTags(orderedIds: string[]): Promise<ActionResult> {
  await db.$transaction(
    orderedIds.map((id, index) =>
      db.galleryTag.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );
  revalidateGalleryTagPaths();
  return { ok: true };
}
