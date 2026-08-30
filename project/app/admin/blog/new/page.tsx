import { BlogPostForm } from "@/components/admin/blog-post-form";
import { db } from "@/lib/db";

export default async function NewBlogPostPage() {
  const people = await db.person.findMany({ orderBy: { sortOrder: "asc" } });
  return <BlogPostForm people={people} />;
}
