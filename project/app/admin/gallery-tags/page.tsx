import type { Metadata } from "next";
import Link from "next/link";
import { GalleryTagList } from "@/components/admin/gallery-tag-list";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Gallery tags",
};

export default async function AdminGalleryTagsPage() {
  const tags = await db.galleryTag.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Gallery tags</h1>
          <p className="mt-1 text-sm text-fg-muted">
            Optional filters for the public gallery. Leave empty if you do not need filters.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/gallery">Back to gallery</Link>
        </Button>
      </div>
      <GalleryTagList entries={tags} />
    </div>
  );
}
