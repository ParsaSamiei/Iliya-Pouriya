"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { experienceSchema } from "@/lib/validation/person";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createExperience(formData: FormData): Promise<ActionResult> {
  const parsed = experienceSchema.safeParse({
    personId: String(formData.get("personId") ?? ""),
    roleEn: String(formData.get("roleEn") ?? ""),
    roleFa: String(formData.get("roleFa") ?? ""),
    organization: String(formData.get("organization") ?? ""),
    startDate: new Date(String(formData.get("startDate") ?? "")),
    endDate: formData.get("endDate") ? new Date(String(formData.get("endDate"))) : null,
    descriptionEn: String(formData.get("descriptionEn") ?? "") || undefined,
    descriptionFa: String(formData.get("descriptionFa") ?? "") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const count = await db.experience.count({ where: { personId: parsed.data.personId } });
  await db.experience.create({ data: { ...parsed.data, sortOrder: count } });

  revalidatePath("/admin/experience");
  revalidatePath("/[locale]/team/[person]", "page");
  return { ok: true };
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  await db.experience.delete({ where: { id } });
  revalidatePath("/admin/experience");
  revalidatePath("/[locale]/team/[person]", "page");
  return { ok: true };
}

export async function reorderExperience(orderedIds: string[]): Promise<ActionResult> {
  await db.$transaction(
    orderedIds.map((id, index) =>
      db.experience.update({ where: { id }, data: { sortOrder: index } }),
    ),
  );

  revalidatePath("/admin/experience");
  revalidatePath("/[locale]/team/[person]", "page");
  return { ok: true };
}
