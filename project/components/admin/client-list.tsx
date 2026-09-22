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
import { Textarea } from "@/components/ui/textarea";
import type { Client } from "@/generated/prisma/client";
import {
  createClient,
  deleteClient,
  reorderClients,
  updateClient,
} from "@/lib/actions/clients";

function ClientFields({
  defaults,
  idPrefix,
}: {
  defaults?: Client;
  idPrefix: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-nameEn`}>Name (EN)</Label>
        <Input
          id={`${idPrefix}-nameEn`}
          name="nameEn"
          required
          defaultValue={defaults?.nameEn}
        />
      </div>
      <div className="space-y-1.5" dir="rtl">
        <Label htmlFor={`${idPrefix}-nameFa`}>نام (فارسی)</Label>
        <Input
          id={`${idPrefix}-nameFa`}
          name="nameFa"
          dir="rtl"
          required
          defaultValue={defaults?.nameFa}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-noteEn`}>Note (EN, optional)</Label>
        <Textarea
          id={`${idPrefix}-noteEn`}
          name="noteEn"
          rows={2}
          placeholder="What you worked on together"
          defaultValue={defaults?.noteEn ?? ""}
        />
      </div>
      <div className="space-y-1.5" dir="rtl">
        <Label htmlFor={`${idPrefix}-noteFa`}>یادداشت (فارسی، اختیاری)</Label>
        <Textarea
          id={`${idPrefix}-noteFa`}
          name="noteFa"
          rows={2}
          dir="rtl"
          placeholder="خلاصه همکاری"
          defaultValue={defaults?.noteFa ?? ""}
        />
      </div>
      <div className="sm:col-span-2">
        <ImageUploadField
          name="logoUrl"
          label="Logo (optional)"
          category="clients"
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
        Show on the homepage carousel
      </label>
    </div>
  );
}

export function ClientList({ entries }: { entries: Client[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<Client | null>(null);
  const { items, dragHandleProps, moveByOffset } = useDragReorder({
    items: entries,
    getId: (e) => e.id,
    onReorder: (orderedIds) => {
      startTransition(async () => {
        const result = await reorderClients(orderedIds);
        if (!result.ok) toast.error(result.error);
      });
    },
  });

  function onCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createClient(formData);
      if (result.ok) {
        toast.success("Client added.");
        formRef.current?.reset();
      } else {
        toast.error(result.error);
      }
    });
  }

  function onUpdate(formData: FormData) {
    if (!editing) return;
    startTransition(async () => {
      const result = await updateClient(editing.id, formData);
      if (result.ok) {
        toast.success("Client updated.");
        setEditing(null);
      } else {
        toast.error(result.error);
      }
    });
  }

  function onDelete(id: string) {
    startTransition(async () => {
      const result = await deleteClient(id);
      if (result.ok) toast.success("Removed.");
      else toast.error(result.error);
    });
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs text-fg-muted">
          Drag to reorder — first entry leads the homepage carousel.
        </p>
        <ul className="space-y-2">
          {items.map((client, index) => (
            <li
              key={client.id}
              className="flex items-start justify-between gap-3 rounded-[var(--radius-sm)] border border-border px-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <DragHandle
                  dragProps={dragHandleProps(client.id)}
                  onMoveUp={() => moveByOffset(client.id, -1)}
                  onMoveDown={() => moveByOffset(client.id, 1)}
                  disableUp={index === 0}
                  disableDown={index === items.length - 1}
                />
                {client.logoUrl ? (
                  <Image
                    src={client.logoUrl}
                    alt=""
                    width={72}
                    height={36}
                    className="h-9 w-auto object-contain"
                  />
                ) : (
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border text-sm font-medium text-fg-muted">
                    {client.nameEn.slice(0, 1)}
                  </span>
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{client.nameEn}</p>
                    {client.isPublished ? (
                      <Badge variant="secondary">Published</Badge>
                    ) : (
                      <Badge variant="outline">Hidden</Badge>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-fg-muted" dir="rtl">
                    {client.nameFa}
                  </p>
                  {client.url ? (
                    <p className="mt-0.5 truncate text-xs text-fg-muted" dir="ltr">
                      {client.url}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditing(client)}
                  disabled={pending}
                  aria-label={`Edit ${client.nameEn}`}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(client.id)}
                  disabled={pending}
                  aria-label={`Delete ${client.nameEn}`}
                >
                  <Trash2 className="size-4 text-error" />
                </Button>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <p className="text-sm text-fg-muted">No clients yet.</p>
          )}
        </ul>
      </div>

      <form ref={formRef} action={onCreate} className="space-y-4 border-t border-border pt-6">
        <h2 className="font-display text-lg font-semibold">Add client</h2>
        <ClientFields idPrefix="new" />
        <Button type="submit" disabled={pending}>
          Add client
        </Button>
      </form>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit client</DialogTitle>
            <DialogDescription>
              Update the bilingual name, note, logo, and link shown in the homepage
              carousel.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <form key={editing.id} action={onUpdate} className="space-y-4">
              <ClientFields defaults={editing} idPrefix={`edit-${editing.id}`} />
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
