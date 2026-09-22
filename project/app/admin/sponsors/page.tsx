import type { Metadata } from "next";
import { SponsorList } from "@/components/admin/sponsor-list";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Sponsors",
};

export default async function AdminSponsorsPage() {
  const entries = await db.sponsor.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Sponsors</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Partners and sponsors shown as logos in the site footer.
        </p>
      </div>
      <SponsorList entries={entries} />
    </div>
  );
}
