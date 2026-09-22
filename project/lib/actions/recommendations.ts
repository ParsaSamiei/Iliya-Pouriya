"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { deleteUpload } from "@/lib/uploads";
import { recommendationSchema } from "@/lib/validation/recommendation";

export type ActionResult = { ok: true } | { ok: false; error: string };

function parseRecommendationForm(formData: FormData) {
  return recommendationSchema.safeParse({
    quoteEn: String(formData.get("quoteEn") ?? ""),
    quoteFa: String(formData.get("quoteFa") ?? ""),
    authorNameEn: String(formData.get("authorNameEn") ?? ""),
    authorNameFa: String(formData.get("authorNameFa") ?? ""),
    authorRoleEn: String(formData.get("authorRoleEn") ?? "") || undefined,
    authorRoleFa: String(formData.get("authorRoleFa") ?? "") || undefined,
    authorPhotoUrl: String(formData.get("authorPhotoUrl") ?? "") || undefined,
    authorUrl: String(formData.get("authorUrl") ?? "") || undefined,
    isPublished: formData.get("isPublished") === "on",
  });
}

function revalidateRecommendationPaths() {
  revalidatePath("/admin/recommendations");
  revalidatePath("/[locale]", "page");
}

export async function createRecommendation(formData: FormData): Promise<ActionResult> {
  const parsed = parseRecommendationForm(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const count = await db.recommendation.count();
  await db.recommendation.create({
    data: { ...parsed.data, sortOrder: count },
  });

  revalidateRecommendationPaths();
  return { ok: true };
}

export async function updateRecommendation(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = parseRecommendationForm(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await db.recommendation.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Not found." };

  const nextPhoto = parsed.data.authorPhotoUrl ?? null;
  if (existing.authorPhotoUrl && existing.authorPhotoUrl !== nextPhoto) {
    await deleteUpload(existing.authorPhotoUrl);
  }

  await db.recommendation.update({
    where: { id },
    data: parsed.data,
  });

  revalidateRecommendationPaths();
  return { ok: true };
}

export async function deleteRecommendation(id: string): Promise<ActionResult> {
  const existing = await db.recommendation.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Not found." };

  if (existing.authorPhotoUrl) await deleteUpload(existing.authorPhotoUrl);
  await db.recommendation.delete({ where: { id } });

  revalidateRecommendationPaths();
  return { ok: true };
}

export async function reorderRecommendations(orderedIds: string[]): Promise<ActionResult> {
  await db.$transaction(
    orderedIds.map((id, index) =>
      db.recommendation.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );

  revalidateRecommendationPaths();
  return { ok: true };
}
