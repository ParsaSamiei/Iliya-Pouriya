import Link from "next/link";
import { SortableProjectsTable } from "@/components/admin/sortable-projects-table";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

export default async function AdminProjectsPage() {
  const projects = await db.project.findMany({
    orderBy: { sortOrder: "asc" },
    include: { contributors: { include: { person: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Projects</h1>
          <p className="text-xs text-fg-muted">
            Drag to reorder — this order is also the homepage/listing order.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/projects/new">New project</Link>
        </Button>
      </div>

      <SortableProjectsTable projects={projects} />
    </div>
  );
}
