"use client";

import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
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
import type { Sponsor } from "@/generated/prisma/client";
import {
  createSponsor,
  deleteSponsor,
  reorderSponsors,
  updateSponsor,
} from "@/lib/actions/sponsors";

function SponsorFields({
  defaults,
  idPrefix,
}: {
  defaults?: Sponsor;
  idPrefix: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-name`}>Name</Label>
        <Input id={`${idPrefix}-name`} name="name" required defaultValue={defaults?.name} />
      </div>
      <div className="sm:col-span-2">
        <ImageUploadField
          name="logoUrl"
          label="Logo (optional)"
          category="sponsors"
          defaultValue={defaults?.logoUrl ?? ""}
        />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor={`${idPrefix}-url`}>Website (optional)</Label>
        <Input
          id={`${idPrefix}-url`}
          name="url"
          type="url"
          placeholder="https://example.com"
          defaultValue={defaults?.url ?? ""}
        />
      </div>
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={defaults?.isPublished ?? true}
          className="size-4 accent-[var(--accent)]"
        />
        Show in the site footer
      </label>
    </div>
  );
}

export function SponsorList({ entries }: { entries: Sponsor[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const { items, dragHandleProps, moveByOffset } = useDragReorder({
    items: entries,
    getId: (e) => e.id,
    onReorder: (orderedIds) => {
      startTransition(async () => {
        const result = await reorderSponsors(orderedIds);
        if (!result.ok) toast.error(result.error);
      });
    },
  });

  function onCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createSponsor(formData);
      if (result.ok) {
        toast.success("Sponsor added.");
        formRef.current?.reset();
      } else {
        toast.error(result.error);
      }
    });
  }

  function onUpdate(formData: FormData) {
    if (!editing) return;
    startTransition(async () => {
      const result = await updateSponsor(editing.id, formData);
      if (result.ok) {
        toast.success("Sponsor updated.");
        setEditing(null);
      } else {
        toast.error(result.error);
      }
    });
  }

  function onDelete(id: string) {
    startTransition(async () => {
      const result = await deleteSponsor(id);
      if (result.ok) toast.success("Removed.");
      else toast.error(result.error);
    });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs text-fg-muted">
          Drag to reorder — first entry shows first in the footer.
        </p>
        <ul className="space-y-2">
          {items.map((sponsor, index) => (
            <li
              key={sponsor.id}
              className="flex items-start justify-between gap-3 rounded-[var(--radius-sm)] border border-border px-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <DragHandle
                  dragProps={dragHandleProps(sponsor.id)}
                  onMoveUp={() => moveByOffset(sponsor.id, -1)}
                  onMoveDown={() => moveByOffset(sponsor.id, 1)}
                  disableUp={index === 0}
                  disableDown={index === items.length - 1}
                />
                {sponsor.logoUrl ? (
                  <Image
                    src={sponsor.logoUrl}
                    alt=""
                    width={72}
                    height={36}
                    className="h-9 w-auto object-contain"
                  />
                ) : (
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border text-sm font-medium text-fg-muted">
                    {sponsor.name.slice(0, 1)}
                  </span>
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{sponsor.name}</p>
                    {sponsor.isPublished ? (
                      <Badge variant="secondary">Published</Badge>
                    ) : (
                      <Badge variant="outline">Hidden</Badge>
                    )}
                  </div>
                  {sponsor.url ? (
                    <p className="mt-0.5 truncate text-xs text-fg-muted" dir="ltr">
                      {sponsor.url}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditing(sponsor)}
                  disabled={pending}
                  aria-label={`Edit ${sponsor.name}`}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(sponsor.id)}
                  disabled={pending}
                  aria-label={`Delete ${sponsor.name}`}
                >
                  <Trash2 className="size-4 text-error" />
                </Button>
              </div>
            </li>
          ))}
          {items.length === 0 && <p className="text-sm text-fg-muted">No sponsors yet.</p>}
        </ul>
      </div>

      <form ref={formRef} action={onCreate} className="space-y-4 border-t border-border pt-6">
        <h2 className="font-display text-lg font-semibold">Add sponsor</h2>
        <SponsorFields idPrefix="new" />
        <Button type="submit" disabled={pending}>
          Add sponsor
        </Button>
      </form>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit sponsor</DialogTitle>
            <DialogDescription>
              Update the name, logo, and link shown in the site footer.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <form key={editing.id} action={onUpdate} className="space-y-4">
              <SponsorFields defaults={editing} idPrefix={`edit-${editing.id}`} />
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
