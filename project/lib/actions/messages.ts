"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

export async function markMessageRead(id: string) {
  await db.contactMessage.update({ where: { id }, data: { readAt: new Date() } });
  revalidatePath("/admin/messages");
}
