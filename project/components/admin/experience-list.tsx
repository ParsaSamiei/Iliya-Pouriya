"use client";

import { Trash2 } from "lucide-react";
import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { DragHandle } from "@/components/admin/drag-handle";
import { useDragReorder } from "@/components/admin/use-drag-reorder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Experience, Person } from "@/generated/prisma/client";
import { createExperience, deleteExperience, reorderExperience } from "@/lib/actions/experience";

export function ExperienceList({ person, entries }: { person: Person; entries: Experience[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const { items, dragHandleProps, moveByOffset } = useDragReorder({
    items: entries,
    getId: (e) => e.id,
    onReorder: (orderedIds) => {
      startTransition(async () => {
        const result = await reorderExperience(orderedIds);
        if (!result.ok) toast.error(result.error);
      });
    },
  });

  function onCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createExperience(formData);
      if (result.ok) {
        toast.success("Experience added.");
        formRef.current?.reset();
      } else {
        toast.error(result.error);
      }
    });
  }

  function onDelete(id: string) {
    startTransition(async () => {
      const result = await deleteExperience(id);
      if (result.ok) toast.success("Removed.");
      else toast.error(result.error);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{person.nameEn}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-fg-muted">Drag to reorder — first entry shows at the top.</p>
        <ul className="space-y-2">
          {items.map((exp, index) => (
            <li
              key={exp.id}
              className="flex items-center justify-between rounded-[var(--radius-sm)] border border-border px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <DragHandle
                  dragProps={dragHandleProps(exp.id)}
                  onMoveUp={() => moveByOffset(exp.id, -1)}
                  onMoveDown={() => moveByOffset(exp.id, 1)}
                  disableUp={index === 0}
                  disableDown={index === items.length - 1}
                />
                <div>
                  <p className="text-sm font-medium">
                    {exp.roleEn} — {exp.organization}
                  </p>
                  <p className="font-mono text-xs text-fg-muted">
                    {new Date(exp.startDate).getFullYear()}
                    {" – "}
                    {exp.endDate ? new Date(exp.endDate).getFullYear() : "present"}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => onDelete(exp.id)} disabled={pending}>
                <Trash2 className="size-4 text-error" />
              </Button>
            </li>
          ))}
          {items.length === 0 && <p className="text-sm text-fg-muted">No entries yet.</p>}
        </ul>

        <form
          ref={formRef}
          action={onCreate}
          className="grid gap-3 border-t border-border pt-4 sm:grid-cols-2"
        >
          <input type="hidden" name="personId" value={person.id} />
          <div className="space-y-1.5">
            <Label>Role (EN)</Label>
            <Input name="roleEn" required />
          </div>
          <div className="space-y-1.5">
            <Label dir="rtl">نقش (فارسی)</Label>
            <Input name="roleFa" dir="rtl" required />
          </div>
          <div className="space-y-1.5">
            <Label>Organization</Label>
            <Input name="organization" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Start date</Label>
              <Input name="startDate" type="date" required />
            </div>
            <div className="space-y-1.5">
              <Label>End date (blank = present)</Label>
              <Input name="endDate" type="date" />
            </div>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description (EN)</Label>
            <Textarea name="descriptionEn" rows={2} />
          </div>
          <div className="space-y-1.5 sm:col-span-2" dir="rtl">
            <Label>توضیحات (فارسی)</Label>
            <Textarea name="descriptionFa" rows={2} dir="rtl" />
          </div>
          <Button type="submit" disabled={pending} className="sm:col-span-2">
            {pending ? "Adding…" : "Add entry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
