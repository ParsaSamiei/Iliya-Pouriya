import { notFound } from "next/navigation";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { db } from "@/lib/db";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [post, people] = await Promise.all([
    db.blogPost.findUnique({ where: { id }, include: { authors: true } }),
    db.person.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!post) notFound();

  return <BlogPostForm post={post} people={people} />;
}
