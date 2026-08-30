import { getTranslations, setRequestLocale } from "next-intl/server";
import { PlaceholderNotice } from "@/components/site/placeholder-notice";
import { ProjectCard } from "@/components/site/project-card";
import { db } from "@/lib/db";

export const revalidate = 300;

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");

  const projects = await db.project
    .findMany({
      where: { publishedAt: { not: null } },
      orderBy: { sortOrder: "asc" },
      select: {
        slug: true,
        titleEn: true,
        titleFa: true,
        summaryEn: true,
        summaryFa: true,
        coverImageUrl: true,
        tags: true,
      },
    })
    .catch(() => []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="font-display text-3xl font-semibold text-fg">{t("title")}</h1>
      <p className="mt-2 text-fg-muted">{t("subtitle")}</p>

      <div className="mt-10">
        {projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <PlaceholderNotice />
        )}
      </div>
    </div>
  );
}
