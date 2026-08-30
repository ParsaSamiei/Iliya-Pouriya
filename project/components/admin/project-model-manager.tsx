"use client";

import { Box, Trash2 } from "lucide-react";
import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { DragHandle } from "@/components/admin/drag-handle";
import { useDragReorder } from "@/components/admin/use-drag-reorder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProjectModel } from "@/generated/prisma/client";
import {
  deleteProjectModel,
  reorderProjectModels,
  uploadProjectModel,
} from "@/lib/actions/projects";

export function ProjectModelManager({
  projectId,
  models,
}: {
  projectId: string;
  models: ProjectModel[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const { items, dragHandleProps, moveByOffset } = useDragReorder({
    items: models,
    getId: (m) => m.id,
    onReorder: (orderedIds) => {
      startTransition(async () => {
        const result = await reorderProjectModels(projectId, orderedIds);
        if (!result.ok) toast.error(result.error);
      });
    },
  });

  function onUpload(formData: FormData) {
    startTransition(async () => {
      const result = await uploadProjectModel(projectId, formData);
      if (result.ok) {
        toast.success("Model uploaded.");
        formRef.current?.reset();
      } else {
        toast.error(result.error);
      }
    });
  }

  function onDelete(modelId: string) {
    startTransition(async () => {
      const result = await deleteProjectModel(modelId, projectId);
      if (result.ok) toast.success("Model removed.");
      else toast.error(result.error);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>3D models</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-fg-muted">
          .stl only, up to 30 MB — export at print resolution rather than full CAD tolerance
          (docs/07_ADMIN_PANEL.md). Drag to reorder — first model is the one shown by default.
        </p>

        <ul className="space-y-2">
          {items.map((model, index) => (
            <li
              key={model.id}
              className="flex items-center justify-between rounded-[var(--radius-sm)] border border-border px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <DragHandle
                  dragProps={dragHandleProps(model.id)}
                  onMoveUp={() => moveByOffset(model.id, -1)}
                  onMoveDown={() => moveByOffset(model.id, 1)}
                  disableUp={index === 0}
                  disableDown={index === items.length - 1}
                />
                <Box className="size-4 text-fg-muted" />
                <span className="text-sm">
                  {model.nameEn} / {model.nameFa}
                </span>
                <span className="font-mono text-xs text-fg-muted">
                  {(model.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(model.id)}
                disabled={pending}
              >
                <Trash2 className="size-4 text-error" />
              </Button>
            </li>
          ))}
          {items.length === 0 && <p className="text-sm text-fg-muted">No models yet.</p>}
        </ul>

        <form
          ref={formRef}
          action={onUpload}
          className="grid gap-3 border-t border-border pt-4 sm:grid-cols-3"
        >
          <div className="space-y-1.5">
            <Label htmlFor="nameEn">Label (EN)</Label>
            <Input id="nameEn" name="nameEn" placeholder="Full assembly" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nameFa">Label (FA)</Label>
            <Input id="nameFa" name="nameFa" dir="rtl" placeholder="مونتاژ کامل" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="file">.stl file</Label>
            <Input id="file" name="file" type="file" accept=".stl" required />
          </div>
          <Button type="submit" disabled={pending} className="sm:col-span-3">
            {pending ? "Uploading…" : "Upload model"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
