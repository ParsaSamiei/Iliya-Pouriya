import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { db } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await db.blogPost.findUnique({
    where: { id },
    select: { titleEn: true },
  });
  return { title: post ? `Edit: ${post.titleEn}` : "Edit post" };
}

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [post, people] = await Promise.all([
    db.blogPost.findUnique({ where: { id }, include: { authors: true } }),
    db.person.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!post) notFound();

  return <BlogPostForm post={post} people={people} />;
}
