import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MarkdownContent } from "@/components/site/markdown-content";
import { ProjectGallery } from "@/components/site/project-gallery";
import { StlViewerLazy } from "@/components/site/stl-viewer-lazy";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { formatPersonList } from "@/lib/person";
import { absoluteUrl, buildLocaleAlternates, JsonLd, projectJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const projects = await db.project
    .findMany({ where: { publishedAt: { not: null } }, select: { slug: true } })
    .catch(() => []);
  return projects.map((p) => ({ slug: p.slug }));
}

export const revalidate = 300;

async function getProject(slug: string) {
  return db.project.findFirst({
    where: { slug, publishedAt: { not: null } },
    include: {
      models: { orderBy: { sortOrder: "asc" } },
      contributors: { include: { person: true } },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(slug).catch(() => null);
  if (!project) return {};
  const title = locale === "fa" ? project.titleFa : project.titleEn;
  const description = (locale === "fa" ? project.summaryFa : project.summaryEn) ?? undefined;
  const ogImage = project.coverImageUrl ? [absoluteUrl(project.coverImageUrl)] : undefined;

  return {
    title,
    description,
    alternates: buildLocaleAlternates(`/projects/${slug}`),
    openGraph: { title, description, images: ogImage, type: "article" },
    twitter: { card: "summary_large_image", title, description, images: ogImage },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");

  const project = await getProject(slug).catch(() => null);
  if (!project) notFound();

  const title = locale === "fa" ? project.titleFa : project.titleEn;
  const content = locale === "fa" ? project.contentFa : project.contentEn;
  const tags = (project.tags as string[] | null) ?? [];
  const gallery = Array.isArray(project.gallery) ? (project.gallery as string[]) : [];

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <JsonLd data={projectJsonLd(project)} />
      {project.coverImageUrl && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-[var(--radius-lg)] bg-surface-raised">
          <Image src={project.coverImageUrl} alt={title} fill className="object-cover" />
        </div>
      )}

      <h1 className="font-display text-3xl font-semibold text-fg sm:text-4xl">{title}</h1>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-fg-muted">
        {project.contributors.length > 0 && (
          <span className={locale === "fa" ? "font-display" : "font-mono"}>
            {formatPersonList(
              project.contributors.map(({ person }) => person),
              locale,
            )}
          </span>
        )}
        {tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>

      {project.models.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 font-mono text-xs tracking-widest text-fg-muted uppercase">
            {t("viewModel")}
          </h2>
          <StlViewerLazy
            locale={locale}
            models={project.models.map((m) => ({
              id: m.id,
              nameEn: m.nameEn,
              nameFa: m.nameFa,
              fileUrl: m.fileUrl,
            }))}
          />
        </div>
      )}

      {gallery.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 font-mono text-xs tracking-widest text-fg-muted uppercase">
            {t("gallery")}
          </h2>
          <ProjectGallery images={gallery} alt={title} />
        </div>
      )}

      {content && <MarkdownContent content={content} dir={locale === "fa" ? "rtl" : "ltr"} />}
    </article>
  );
}
