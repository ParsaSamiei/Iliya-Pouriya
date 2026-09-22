import { db } from "@/lib/db";

export type FooterSponsor = {
  id: string;
  name: string;
  logoUrl: string | null;
  url: string | null;
};

/** Published sponsors for the site footer logo strip. */
export async function getFooterSponsors(): Promise<FooterSponsor[]> {
  try {
    return await db.sponsor.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, logoUrl: true, url: true },
    });
  } catch {
    return [];
  }
}
