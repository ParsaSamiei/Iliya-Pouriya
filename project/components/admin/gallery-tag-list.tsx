"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { DragHandle } from "@/components/admin/drag-handle";
import { useDragReorder } from "@/components/admin/use-drag-reorder";
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
import type { GalleryTag } from "@/generated/prisma/client";
import {
  createGalleryTag,
  deleteGalleryTag,
  reorderGalleryTags,
  updateGalleryTag,
} from "@/lib/actions/gallery-tags";

function GalleryTagFields({
  defaults,
  idPrefix,
}: {
  defaults?: GalleryTag;
  idPrefix: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-slug`}>Slug</Label>
        <Input
          id={`${idPrefix}-slug`}
          name="slug"
          required
          pattern="[a-z0-9-]+"
          placeholder="lab-bench"
          defaultValue={defaults?.slug ?? ""}
        />
        <p className="text-xs text-fg-muted">Lowercase letters, numbers, hyphens. Used in ?tag=</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-nameEn`}>Name (EN)</Label>
        <Input
          id={`${idPrefix}-nameEn`}
          name="nameEn"
          required
          defaultValue={defaults?.nameEn ?? ""}
        />
      </div>
      <div className="space-y-1.5" dir="rtl">
        <Label htmlFor={`${idPrefix}-nameFa`}>نام (فارسی)</Label>
        <Input
          id={`${idPrefix}-nameFa`}
          name="nameFa"
          dir="rtl"
          required
          defaultValue={defaults?.nameFa ?? ""}
        />
      </div>
      <input type="hidden" name="sortOrder" value={defaults?.sortOrder ?? 0} />
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={defaults?.isActive ?? true}
          className="size-4 accent-[var(--accent)]"
        />
        Active on the public gallery filter bar
      </label>
    </div>
  );
}

export function GalleryTagList({ entries }: { entries: GalleryTag[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<GalleryTag | null>(null);
  const { items, dragHandleProps, moveByOffset } = useDragReorder({
    items: entries,
    getId: (e) => e.id,
    onReorder: (orderedIds) => {
      startTransition(async () => {
        const result = await reorderGalleryTags(orderedIds);
        if (!result.ok) toast.error(result.error);
      });
    },
  });

  function onCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createGalleryTag(formData);
      if (result.ok) {
        toast.success("Tag added.");
        formRef.current?.reset();
      } else {
        toast.error(result.error);
      }
    });
  }

  function onUpdate(formData: FormData) {
    if (!editing) return;
    startTransition(async () => {
      const result = await updateGalleryTag(editing.id, formData);
      if (result.ok) {
        toast.success("Tag updated.");
        setEditing(null);
      } else {
        toast.error(result.error);
      }
    });
  }

  function onDelete(id: string) {
    startTransition(async () => {
      const result = await deleteGalleryTag(id);
      if (result.ok) toast.success("Removed.");
      else toast.error(result.error);
    });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs text-fg-muted">Drag to reorder filter chips on the gallery page.</p>
        <ul className="space-y-2">
          {items.map((tag, index) => (
            <li
              key={tag.id}
              className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-border px-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-2">
                <DragHandle
                  dragProps={dragHandleProps(tag.id)}
                  onMoveUp={() => moveByOffset(tag.id, -1)}
                  onMoveDown={() => moveByOffset(tag.id, 1)}
                  disableUp={index === 0}
                  disableDown={index === items.length - 1}
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{tag.nameEn}</p>
                    <span className="font-mono text-xs text-fg-muted">{tag.slug}</span>
                    {tag.isActive ? (
                      <Badge variant="secondary">Active</Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-fg-muted" dir="rtl">
                    {tag.nameFa}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditing(tag)}
                  disabled={pending}
                  aria-label={`Edit ${tag.nameEn}`}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(tag.id)}
                  disabled={pending}
                  aria-label={`Delete ${tag.nameEn}`}
                >
                  <Trash2 className="size-4 text-error" />
                </Button>
              </div>
            </li>
          ))}
          {items.length === 0 && <p className="text-sm text-fg-muted">No tags yet.</p>}
        </ul>
      </div>

      <form ref={formRef} action={onCreate} className="space-y-4 border-t border-border pt-6">
        <h2 className="font-display text-lg font-semibold">Add tag</h2>
        <GalleryTagFields idPrefix="new" />
        <Button type="submit" disabled={pending}>
          Add tag
        </Button>
      </form>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit tag</DialogTitle>
            <DialogDescription>
              Tags are optional filters on the public gallery page.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <form key={editing.id} action={onUpdate} className="space-y-4">
              <GalleryTagFields defaults={editing} idPrefix={`edit-${editing.id}`} />
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
