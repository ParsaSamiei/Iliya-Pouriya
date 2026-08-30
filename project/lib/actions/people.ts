"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { personSchema } from "@/lib/validation/person";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updatePerson(id: string, formData: FormData): Promise<ActionResult> {
  const raw = {
    slug: String(formData.get("slug") ?? ""),
    nameEn: String(formData.get("nameEn") ?? ""),
    nameFa: String(formData.get("nameFa") ?? ""),
    title: String(formData.get("title") ?? ""),
    photoUrl: String(formData.get("photoUrl") ?? "") || undefined,
    bioEn: String(formData.get("bioEn") ?? "") || undefined,
    bioFa: String(formData.get("bioFa") ?? "") || undefined,
    resumeUrlEn: String(formData.get("resumeUrlEn") ?? "") || undefined,
    resumeUrlFa: String(formData.get("resumeUrlFa") ?? "") || undefined,
    socialLinks: {
      github: String(formData.get("github") ?? "") || undefined,
      linkedin: String(formData.get("linkedin") ?? "") || undefined,
      email: String(formData.get("socialEmail") ?? "") || undefined,
    },
  };

  const parsed = personSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await db.person.update({ where: { id }, data: parsed.data });

  revalidatePath("/admin/people");
  revalidatePath("/[locale]/about", "page");
  revalidatePath("/[locale]/team/[person]", "page");
  revalidatePath("/[locale]/projects/[slug]", "page");
  revalidatePath("/[locale]/blog/[slug]", "page");

  return { ok: true };
}
