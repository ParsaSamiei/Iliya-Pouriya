"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function updateSiteSetting(key: string, valueEn: string, valueFa: string) {
  await db.siteSetting.upsert({
    where: { key },
    update: { valueEn, valueFa },
    create: { key, valueEn, valueFa },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/[locale]/about", "page");
  revalidatePath("/[locale]", "page");
  return { ok: true } as const;
}
