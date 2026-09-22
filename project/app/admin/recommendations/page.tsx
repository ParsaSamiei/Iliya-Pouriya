import type { Metadata } from "next";
import { RecommendationList } from "@/components/admin/recommendation-list";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Recommendations",
};

export default async function AdminRecommendationsPage() {
  const entries = await db.recommendation.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Recommendations</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Quotes from collaborators, mentors, and clients — shown on the homepage.
        </p>
      </div>
      <RecommendationList entries={entries} />
    </div>
  );
}
