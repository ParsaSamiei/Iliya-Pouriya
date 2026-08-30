import { ProjectForm } from "@/components/admin/project-form";
import { db } from "@/lib/db";

export default async function NewProjectPage() {
  const people = await db.person.findMany({ orderBy: { sortOrder: "asc" } });
  return <ProjectForm people={people} />;
}
