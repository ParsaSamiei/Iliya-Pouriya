"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { deleteUpload } from "@/lib/uploads";
import { galleryItemSchema } from "@/lib/validation/gallery";

export type ActionResult = { ok: true } | { ok: false; error: string };

function parseGalleryItemForm(formData: FormData) {
  return galleryItemSchema.safeParse({
    mediaType: String(formData.get("mediaType") ?? "IMAGE"),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    videoUrl: String(formData.get("videoUrl") ?? ""),
    altEn: String(formData.get("altEn") ?? ""),
    altFa: String(formData.get("altFa") ?? ""),
    captionEn: String(formData.get("captionEn") ?? ""),
    captionFa: String(formData.get("captionFa") ?? ""),
    sortOrder: String(formData.get("sortOrder") ?? "0"),
    tagIds: formData.getAll("tagIds").map(String),
  });
}

function revalidateGalleryPaths() {
  revalidatePath("/admin/gallery");
  revalidatePath("/admin/gallery-tags");
  revalidatePath("/[locale]", "page");
  revalidatePath("/[locale]/gallery", "page");
}

async function assertTagIdsExist(tagIds: string[]) {
  if (tagIds.length === 0) return true;
  const count = await db.galleryTag.count({ where: { id: { in: tagIds } } });
  return count === tagIds.length;
}

export async function createGalleryItem(formData: FormData): Promise<ActionResult> {
  const parsed = parseGalleryItemForm(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { tagIds, ...data } = parsed.data;
  if (!(await assertTagIdsExist(tagIds))) {
    return { ok: false, error: "One of the selected tags is invalid." };
  }

  const count = await db.galleryItem.count();
  await db.galleryItem.create({
    data: {
      ...data,
      sortOrder: count,
      tags: { create: tagIds.map((tagId) => ({ tagId })) },
    },
  });

  revalidateGalleryPaths();
  return { ok: true };
}

export async function updateGalleryItem(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = parseGalleryItemForm(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await db.galleryItem.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Not found." };

  const { tagIds, ...data } = parsed.data;
  if (!(await assertTagIdsExist(tagIds))) {
    return { ok: false, error: "One of the selected tags is invalid." };
  }

  const removedUrls = [existing.imageUrl, existing.videoUrl].filter(
    (url): url is string =>
      Boolean(url) && url !== data.imageUrl && url !== data.videoUrl,
  );

  await db.$transaction([
    db.galleryItemTag.deleteMany({ where: { itemId: id } }),
    db.galleryItem.update({
      where: { id },
      data: {
        ...data,
        tags: { create: tagIds.map((tagId) => ({ tagId })) },
      },
    }),
  ]);

  await Promise.all(removedUrls.map((url) => deleteUpload(url)));

  revalidateGalleryPaths();
  return { ok: true };
}

export async function deleteGalleryItem(id: string): Promise<ActionResult> {
  const existing = await db.galleryItem.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Not found." };

  await db.galleryItem.delete({ where: { id } });

  await Promise.all(
    [existing.imageUrl, existing.videoUrl]
      .filter((url): url is string => Boolean(url))
      .map((url) => deleteUpload(url)),
  );

  revalidateGalleryPaths();
  return { ok: true };
}

export async function reorderGalleryItems(orderedIds: string[]): Promise<ActionResult> {
  await db.$transaction(
    orderedIds.map((id, index) =>
      db.galleryItem.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );
  revalidateGalleryPaths();
  return { ok: true };
}
