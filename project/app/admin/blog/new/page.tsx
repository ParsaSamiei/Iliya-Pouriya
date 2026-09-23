import type { Metadata } from "next";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "New post",
};

export default async function NewBlogPostPage() {
  const people = await db.person.findMany({ orderBy: { sortOrder: "asc" } });
  return <BlogPostForm people={people} />;
}
