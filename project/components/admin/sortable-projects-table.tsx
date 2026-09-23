"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";
import { DragHandle } from "@/components/admin/drag-handle";
import { useDragReorder } from "@/components/admin/use-drag-reorder";
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
import type { Person, Project } from "@/generated/prisma/client";
import { reorderProjects } from "@/lib/actions/projects";

type ProjectRow = Project & { contributors: { person: Person }[] };

export function SortableProjectsTable({ projects }: { projects: ProjectRow[] }) {
  const [, startTransition] = useTransition();
  const { items, dragHandleProps, moveByOffset } = useDragReorder({
    items: projects,
    getId: (p) => p.id,
    onReorder: (orderedIds) => {
      startTransition(async () => {
        const result = await reorderProjects(orderedIds);
        if (!result.ok) toast.error(result.error);
      });
    },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10" />
          <TableHead>Title</TableHead>
          <TableHead>Contributors</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-32" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((project, index) => (
          <TableRow key={project.id}>
            <TableCell>
              <DragHandle
                dragProps={dragHandleProps(project.id)}
                onMoveUp={() => moveByOffset(project.id, -1)}
                onMoveDown={() => moveByOffset(project.id, 1)}
                disableUp={index === 0}
                disableDown={index === items.length - 1}
              />
            </TableCell>
            <TableCell className="font-medium">{project.titleEn}</TableCell>
            <TableCell className="text-fg-muted">
              {project.contributors.map((c) => c.person.nameEn).join(", ")}
            </TableCell>
            <TableCell>
              {project.publishedAt ? (
                <Badge variant="secondary">Published</Badge>
              ) : (
                <Badge variant="outline">Draft</Badge>
              )}
              {project.isFeatured && <Badge className="ml-1">Featured</Badge>}
            </TableCell>
            <TableCell className="flex justify-end gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/admin/projects/${project.id}`}>Edit</Link>
              </Button>
              <DeleteProjectButton id={project.id} title={project.titleEn} />
            </TableCell>
          </TableRow>
        ))}
        {items.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-fg-muted">
              No projects yet.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
