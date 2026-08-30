import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { ProjectModelManager } from "@/components/admin/project-model-manager";
import { db } from "@/lib/db";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [project, people] = await Promise.all([
    db.project.findUnique({
      where: { id },
      include: {
        contributors: true,
        models: { orderBy: { sortOrder: "asc" } },
      },
    }),
    db.person.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!project) notFound();

  return (
    <div className="space-y-6">
      <ProjectForm project={project} people={people} />
      <ProjectModelManager projectId={project.id} models={project.models} />
    </div>
  );
}
