import { ExperienceList } from "@/components/admin/experience-list";
import { db } from "@/lib/db";

export default async function AdminExperiencePage() {
  const people = await db.person.findMany({
    orderBy: { sortOrder: "asc" },
    include: { experience: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold">Experience</h1>
      {people.map((person) => (
        <ExperienceList key={person.id} person={person} entries={person.experience} />
      ))}
    </div>
  );
}
