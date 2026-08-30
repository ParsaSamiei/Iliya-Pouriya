import Link from "next/link";
import { DeleteBlogPostButton } from "@/components/admin/delete-blog-post-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";

export default async function AdminBlogPage() {
  const posts = await db.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    include: { authors: { include: { person: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Blog</h1>
        <Button asChild size="sm">
          <Link href="/admin/blog/new">New post</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Authors</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-32" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.titleEn}</TableCell>
              <TableCell className="text-fg-muted">
                {post.authors.map((a) => a.person.nameEn).join(", ")}
              </TableCell>
              <TableCell>
                {post.publishedAt ? (
                  <Badge variant="secondary">Published</Badge>
                ) : (
                  <Badge variant="outline">Draft</Badge>
                )}
              </TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/blog/${post.id}`}>Edit</Link>
                </Button>
                <DeleteBlogPostButton id={post.id} title={post.titleEn} />
              </TableCell>
            </TableRow>
          ))}
          {posts.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-fg-muted">
                No posts yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
