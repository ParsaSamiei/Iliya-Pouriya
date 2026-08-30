import { PersonEditForm } from "@/components/admin/person-edit-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";

export default async function AdminPeoplePage() {
  const people = await db.person.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold">People</h1>
      <p className="text-sm text-fg-muted">
        There are exactly two profiles here — {"see docs/01_PRODUCT.md"}. Edit each person&apos;s
        own bio and social links independently.
      </p>

      {people.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-fg-muted">No people seeded yet</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-fg-muted">
            Run <code className="font-mono">npm run db:seed</code> to create the two placeholder
            profiles (Iliya, Pouriya).
          </CardContent>
        </Card>
      )}

      {people.map((person) => (
        <PersonEditForm key={person.id} person={person} />
      ))}
    </div>
  );
}
