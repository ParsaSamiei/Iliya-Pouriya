import type { Metadata } from "next";
import { ProjectForm } from "@/components/admin/project-form";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "New project",
};

export default async function NewProjectPage() {
  const people = await db.person.findMany({ orderBy: { sortOrder: "asc" } });
  return <ProjectForm people={people} />;
}
