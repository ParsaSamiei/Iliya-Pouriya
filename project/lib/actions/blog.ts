"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { deleteUpload } from "@/lib/uploads";
import { blogPostSchema } from "@/lib/validation/blog";

export type ActionResult = { ok: true } | { ok: false; error: string };

function parseBlogForm(formData: FormData) {
  const authorIds = formData.getAll("authorIds").map(String);
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return blogPostSchema.safeParse({
    slug: String(formData.get("slug") ?? ""),
    titleEn: String(formData.get("titleEn") ?? ""),
    titleFa: String(formData.get("titleFa") ?? ""),
    excerptEn: String(formData.get("excerptEn") ?? "") || undefined,
    excerptFa: String(formData.get("excerptFa") ?? "") || undefined,
    contentEn: String(formData.get("contentEn") ?? "") || undefined,
    contentFa: String(formData.get("contentFa") ?? "") || undefined,
    coverImageUrl: String(formData.get("coverImageUrl") ?? "") || undefined,
    tags,
    publishedAt: formData.get("published") === "on" ? new Date() : null,
    authorIds,
  });
}

export async function createBlogPost(formData: FormData): Promise<ActionResult> {
  const parsed = parseBlogForm(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { authorIds, ...data } = parsed.data;
  const post = await db.blogPost.create({
    data: { ...data, authors: { create: authorIds.map((personId) => ({ personId })) } },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/[locale]/blog", "page");
  redirect(`/admin/blog/${post.id}`);
}

export async function updateBlogPost(id: string, formData: FormData): Promise<ActionResult> {
  const parsed = parseBlogForm(formData);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { authorIds, ...data } = parsed.data;
  await db.blogPost.update({
    where: { id },
    data: {
      ...data,
      authors: { deleteMany: {}, create: authorIds.map((personId) => ({ personId })) },
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/[locale]/blog", "page");
  revalidatePath("/[locale]/blog/[slug]", "page");
  return { ok: true };
}

export async function deleteBlogPost(id: string): Promise<ActionResult> {
  const post = await db.blogPost.findUnique({ where: { id } });
  if (!post) return { ok: false, error: "Not found." };

  if (post.coverImageUrl) await deleteUpload(post.coverImageUrl);
  await db.blogPost.delete({ where: { id } });

  revalidatePath("/admin/blog");
  revalidatePath("/[locale]/blog", "page");
  return { ok: true };
}
