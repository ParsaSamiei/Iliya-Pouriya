"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { skillSchema } from "@/lib/validation/person";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createSkill(formData: FormData): Promise<ActionResult> {
  const parsed = skillSchema.safeParse({
    personId: String(formData.get("personId") ?? ""),
    name: String(formData.get("name") ?? ""),
    category: String(formData.get("category") ?? ""),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const count = await db.skill.count({ where: { personId: parsed.data.personId } });
  await db.skill.create({ data: { ...parsed.data, sortOrder: count } });

  revalidatePath("/admin/skills");
  revalidatePath("/[locale]/team/[person]", "page");
  return { ok: true };
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  await db.skill.delete({ where: { id } });
  revalidatePath("/admin/skills");
  revalidatePath("/[locale]/team/[person]", "page");
  return { ok: true };
}
