import type { Metadata } from "next";
import Link from "next/link";
import { GalleryItemList } from "@/components/admin/gallery-item-list";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Gallery",
};

export default async function AdminGalleryPage() {
  const [items, tags] = await Promise.all([
    db.galleryItem.findMany({
      orderBy: { sortOrder: "asc" },
      include: { tags: { include: { tag: true } } },
    }),
    db.galleryTag.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Gallery</h1>
          <p className="mt-1 text-sm text-fg-muted">
            Site-wide photos and videos — home carousel and /gallery page.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/gallery-tags">Manage tags</Link>
        </Button>
      </div>
      <GalleryItemList items={items} tags={tags} />
    </div>
  );
}
