"use client";

import { Pencil, Trash2 } from "lucide-react";
import { MediaImage } from "@/components/media-image";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { DragHandle } from "@/components/admin/drag-handle";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { useDragReorder } from "@/components/admin/use-drag-reorder";
import { VideoUploadField } from "@/components/admin/video-upload-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { GalleryItem, GalleryTag } from "@/generated/prisma/client";
import {
  createGalleryItem,
  deleteGalleryItem,
  reorderGalleryItems,
  updateGalleryItem,
} from "@/lib/actions/gallery";

type GalleryItemWithTags = GalleryItem & {
  tags: { tagId: string; tag: GalleryTag }[];
};

function GalleryItemFields({
  defaults,
  tags,
  idPrefix,
}: {
  defaults?: GalleryItemWithTags;
  tags: GalleryTag[];
  idPrefix: string;
}) {
  const [mediaType, setMediaType] = useState<"IMAGE" | "VIDEO">(
    defaults?.mediaType ?? "IMAGE",
  );
  const selectedTagIds = new Set(defaults?.tags.map((t) => t.tagId) ?? []);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5 sm:col-span-2">
        <Label>Media type</Label>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mediaType"
              value="IMAGE"
              checked={mediaType === "IMAGE"}
              onChange={() => setMediaType("IMAGE")}
              className="size-4 accent-[var(--accent)]"
            />
            Image
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mediaType"
              value="VIDEO"
              checked={mediaType === "VIDEO"}
              onChange={() => setMediaType("VIDEO")}
              className="size-4 accent-[var(--accent)]"
            />
            Video
          </label>
        </div>
      </div>

      {mediaType === "IMAGE" ? (
        <div className="sm:col-span-2">
          <ImageUploadField
            name="imageUrl"
            label="Image"
            category="gallery"
            defaultValue={defaults?.imageUrl ?? ""}
            accept="image/jpeg,image/png,image/webp"
          />
        </div>
      ) : (
        <VideoUploadField
          videoName="videoUrl"
          posterName="imageUrl"
          label="Video (MP4 or WebM)"
          category="gallery"
          defaultVideoUrl={defaults?.videoUrl ?? ""}
          defaultPosterUrl={defaults?.imageUrl ?? ""}
        />
      )}

      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-altEn`}>Alt text (EN)</Label>
        <Input id={`${idPrefix}-altEn`} name="altEn" defaultValue={defaults?.altEn ?? ""} />
      </div>
      <div className="space-y-1.5" dir="rtl">
        <Label htmlFor={`${idPrefix}-altFa`}>متن جایگزین (فارسی)</Label>
        <Input
          id={`${idPrefix}-altFa`}
          name="altFa"
          dir="rtl"
          defaultValue={defaults?.altFa ?? ""}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-captionEn`}>Caption (EN)</Label>
        <Textarea
          id={`${idPrefix}-captionEn`}
          name="captionEn"
          rows={2}
          defaultValue={defaults?.captionEn ?? ""}
        />
      </div>
      <div className="space-y-1.5" dir="rtl">
        <Label htmlFor={`${idPrefix}-captionFa`}>توضیح (فارسی)</Label>
        <Textarea
          id={`${idPrefix}-captionFa`}
          name="captionFa"
          rows={2}
          dir="rtl"
          defaultValue={defaults?.captionFa ?? ""}
        />
      </div>

      <input type="hidden" name="sortOrder" value={defaults?.sortOrder ?? 0} />

      <div className="space-y-2 sm:col-span-2">
        <span className="text-sm font-medium">Tags (optional)</span>
        {tags.length === 0 ? (
          <p className="text-sm text-fg-muted">
            No tags yet — create some under Gallery tags to enable filters.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="tagIds"
                  value={tag.id}
                  defaultChecked={selectedTagIds.has(tag.id)}
                  className="size-4 accent-[var(--accent)]"
                />
                <span>
                  {tag.nameEn}
                  <span className="ms-1 text-xs text-fg-muted" dir="rtl">
                    ({tag.nameFa})
                  </span>
                  {!tag.isActive && (
                    <Badge variant="outline" className="ms-2">
                      Inactive
                    </Badge>
                  )}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function GalleryItemList({
  items: initialItems,
  tags,
}: {
  items: GalleryItemWithTags[];
  tags: GalleryTag[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<GalleryItemWithTags | null>(null);
  const { items, dragHandleProps, moveByOffset } = useDragReorder({
    items: initialItems,
    getId: (e) => e.id,
    onReorder: (orderedIds) => {
      startTransition(async () => {
        const result = await reorderGalleryItems(orderedIds);
        if (!result.ok) toast.error(result.error);
      });
    },
  });

  function onCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createGalleryItem(formData);
      if (result.ok) {
        toast.success("Gallery item added.");
        formRef.current?.reset();
      } else {
        toast.error(result.error);
      }
    });
  }

  function onUpdate(formData: FormData) {
    if (!editing) return;
    startTransition(async () => {
      const result = await updateGalleryItem(editing.id, formData);
      if (result.ok) {
        toast.success("Gallery item updated.");
        setEditing(null);
      } else {
        toast.error(result.error);
      }
    });
  }

  function onDelete(id: string) {
    startTransition(async () => {
      const result = await deleteGalleryItem(id);
      if (result.ok) toast.success("Removed.");
      else toast.error(result.error);
    });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs text-fg-muted">
          Drag to reorder — first items appear first in the home carousel and gallery page.
        </p>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="flex items-start justify-between gap-3 rounded-[var(--radius-sm)] border border-border px-3 py-3"
            >
              <div className="flex min-w-0 items-start gap-3">
                <DragHandle
                  dragProps={dragHandleProps(item.id)}
                  onMoveUp={() => moveByOffset(item.id, -1)}
                  onMoveDown={() => moveByOffset(item.id, 1)}
                  disableUp={index === 0}
                  disableDown={index === items.length - 1}
                />
                <div className="relative size-14 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-border bg-surface-raised">
                  {item.imageUrl ? (
                    <MediaImage
                      src={item.imageUrl}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : item.videoUrl ? (
                    <video
                      src={item.videoUrl}
                      muted
                      playsInline
                      preload="metadata"
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-[10px] text-fg-muted">
                      {item.mediaType === "VIDEO" ? "Video" : "—"}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{item.mediaType}</Badge>
                    {item.tags.length > 0 && (
                      <span className="text-xs text-fg-muted">
                        {item.tags.map((t) => t.tag.nameEn).join(", ")}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm">
                    {item.altEn || item.captionEn || item.imageUrl || item.videoUrl}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditing(item)}
                  disabled={pending}
                  aria-label="Edit gallery item"
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(item.id)}
                  disabled={pending}
                  aria-label="Delete gallery item"
                >
                  <Trash2 className="size-4 text-error" />
                </Button>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <p className="text-sm text-fg-muted">No gallery items yet.</p>
          )}
        </ul>
      </div>

      <form ref={formRef} action={onCreate} className="space-y-4 border-t border-border pt-6">
        <h2 className="font-display text-lg font-semibold">Add gallery item</h2>
        <GalleryItemFields tags={tags} idPrefix="new" />
        <Button type="submit" disabled={pending}>
          Add item
        </Button>
      </form>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit gallery item</DialogTitle>
            <DialogDescription>
              Update media, captions, and optional tags for the public gallery.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <form key={editing.id} action={onUpdate} className="space-y-4">
              <GalleryItemFields defaults={editing} tags={tags} idPrefix={`edit-${editing.id}`} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={pending}>
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
