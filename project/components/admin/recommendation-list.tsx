"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { DragHandle } from "@/components/admin/drag-handle";
import { ImageUploadField } from "@/components/admin/image-upload-field";
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
import { Textarea } from "@/components/ui/textarea";
import type { Recommendation } from "@/generated/prisma/client";
import {
  createRecommendation,
  deleteRecommendation,
  reorderRecommendations,
  updateRecommendation,
} from "@/lib/actions/recommendations";

function RecommendationFields({
  defaults,
  idPrefix,
}: {
  defaults?: Recommendation;
  idPrefix: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-quoteEn`}>Quote (EN)</Label>
        <Textarea
          id={`${idPrefix}-quoteEn`}
          name="quoteEn"
          rows={3}
          required
          defaultValue={defaults?.quoteEn}
        />
      </div>
      <div className="space-y-1.5 sm:col-span-2" dir="rtl">
        <Label htmlFor={`${idPrefix}-quoteFa`}>نقل‌قول (فارسی)</Label>
        <Textarea
          id={`${idPrefix}-quoteFa`}
          name="quoteFa"
          rows={3}
          dir="rtl"
          required
          defaultValue={defaults?.quoteFa}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-authorNameEn`}>Author name (EN)</Label>
        <Input
          id={`${idPrefix}-authorNameEn`}
          name="authorNameEn"
          required
          defaultValue={defaults?.authorNameEn}
        />
      </div>
      <div className="space-y-1.5" dir="rtl">
        <Label htmlFor={`${idPrefix}-authorNameFa`}>نام نویسنده (فارسی)</Label>
        <Input
          id={`${idPrefix}-authorNameFa`}
          name="authorNameFa"
          dir="rtl"
          required
          defaultValue={defaults?.authorNameFa}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-authorRoleEn`}>Role / affiliation (EN)</Label>
        <Input
          id={`${idPrefix}-authorRoleEn`}
          name="authorRoleEn"
          defaultValue={defaults?.authorRoleEn ?? ""}
        />
      </div>
      <div className="space-y-1.5" dir="rtl">
        <Label htmlFor={`${idPrefix}-authorRoleFa`}>نقش / وابستگی (فارسی)</Label>
        <Input
          id={`${idPrefix}-authorRoleFa`}
          name="authorRoleFa"
          dir="rtl"
          defaultValue={defaults?.authorRoleFa ?? ""}
        />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-authorUrl`}>Author link (optional)</Label>
        <Input
          id={`${idPrefix}-authorUrl`}
          name="authorUrl"
          type="url"
          placeholder="https://linkedin.com/in/…"
          defaultValue={defaults?.authorUrl ?? ""}
        />
      </div>
      <div className="sm:col-span-2">
        <ImageUploadField
          name="authorPhotoUrl"
          label="Author photo (optional)"
          category="profiles"
          defaultValue={defaults?.authorPhotoUrl ?? ""}
        />
      </div>
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={defaults?.isPublished ?? true}
          className="size-4 accent-[var(--accent)]"
        />
        Published on the homepage
      </label>
    </div>
  );
}

export function RecommendationList({ entries }: { entries: Recommendation[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Recommendation | null>(null);
  const { items, dragHandleProps, moveByOffset } = useDragReorder({
    items: entries,
    getId: (e) => e.id,
    onReorder: (orderedIds) => {
      startTransition(async () => {
        const result = await reorderRecommendations(orderedIds);
        if (!result.ok) toast.error(result.error);
      });
    },
  });

  function onCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createRecommendation(formData);
      if (result.ok) {
        toast.success("Recommendation added.");
        formRef.current?.reset();
      } else {
        toast.error(result.error);
      }
    });
  }

  function onUpdate(formData: FormData) {
    if (!editing) return;
    startTransition(async () => {
      const result = await updateRecommendation(editing.id, formData);
      if (result.ok) {
        toast.success("Recommendation updated.");
        setEditing(null);
      } else {
        toast.error(result.error);
      }
    });
  }

  function onDelete(id: string) {
    startTransition(async () => {
      const result = await deleteRecommendation(id);
      if (result.ok) toast.success("Removed.");
      else toast.error(result.error);
    });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs text-fg-muted">
          Drag to reorder — first entry shows first on the homepage.
        </p>
        <ul className="space-y-2">
          {items.map((rec, index) => (
            <li
              key={rec.id}
              className="flex items-start justify-between gap-3 rounded-[var(--radius-sm)] border border-border px-3 py-3"
            >
              <div className="flex min-w-0 items-start gap-2">
                <DragHandle
                  dragProps={dragHandleProps(rec.id)}
                  onMoveUp={() => moveByOffset(rec.id, -1)}
                  onMoveDown={() => moveByOffset(rec.id, 1)}
                  disableUp={index === 0}
                  disableDown={index === items.length - 1}
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{rec.authorNameEn}</p>
                    {rec.isPublished ? (
                      <Badge variant="secondary">Published</Badge>
                    ) : (
                      <Badge variant="outline">Draft</Badge>
                    )}
                  </div>
                  {rec.authorRoleEn && (
                    <p className="mt-0.5 text-xs text-fg-muted">{rec.authorRoleEn}</p>
                  )}
                  <p className="mt-2 line-clamp-2 text-sm text-fg-muted">&ldquo;{rec.quoteEn}&rdquo;</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditing(rec)}
                  disabled={pending}
                  aria-label={`Edit ${rec.authorNameEn}`}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(rec.id)}
                  disabled={pending}
                  aria-label={`Delete ${rec.authorNameEn}`}
                >
                  <Trash2 className="size-4 text-error" />
                </Button>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <p className="text-sm text-fg-muted">No recommendations yet.</p>
          )}
        </ul>
      </div>

      <form
        ref={formRef}
        action={onCreate}
        className="space-y-4 border-t border-border pt-6"
      >
        <h2 className="font-display text-lg font-semibold">Add recommendation</h2>
        <RecommendationFields idPrefix="new" />
        <Button type="submit" disabled={pending}>
          Add recommendation
        </Button>
      </form>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit recommendation</DialogTitle>
            <DialogDescription>
              Update the quote and author details shown on the homepage.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <form key={editing.id} action={onUpdate} className="space-y-4">
              <RecommendationFields defaults={editing} idPrefix={`edit-${editing.id}`} />
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
