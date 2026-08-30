import { SkillList } from "@/components/admin/skill-list";
import { db } from "@/lib/db";

export default async function AdminSkillsPage() {
  const people = await db.person.findMany({
    orderBy: { sortOrder: "asc" },
    include: { skills: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold">Skills</h1>
      {people.map((person) => (
        <SkillList key={person.id} person={person} skills={person.skills} />
      ))}
    </div>
  );
}
