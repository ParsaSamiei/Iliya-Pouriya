import { db } from "@/lib/db";

export type HomepageClient = {
  id: string;
  nameEn: string;
  nameFa: string;
  noteEn: string | null;
  noteFa: string | null;
  logoUrl: string | null;
  url: string | null;
};

/** Published clients for the homepage “worked with” carousel. */
export async function getHomepageClients(): Promise<HomepageClient[]> {
  try {
    return await db.client.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        nameEn: true,
        nameFa: true,
        noteEn: true,
        noteFa: true,
        logoUrl: true,
        url: true,
      },
    });
  } catch {
    return [];
  }
}
