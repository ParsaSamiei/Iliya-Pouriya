import type { Metadata } from "next";
import { ClientList } from "@/components/admin/client-list";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Clients",
};

export default async function AdminClientsPage() {
  const entries = await db.client.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Clients</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Who you&apos;ve worked with — bilingual names and notes for the homepage
          carousel. Separate from footer Sponsors.
        </p>
      </div>
      <ClientList entries={entries} />
    </div>
  );
}
