import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";

type ProjectCardData = {
  slug: string;
  titleEn: string;
  titleFa: string;
  summaryEn: string | null;
  summaryFa: string | null;
  coverImageUrl: string | null;
  /** Prisma Json column — narrowed to string[] at runtime below. */
  tags: unknown;
};

export function ProjectCard({ project }: { project: ProjectCardData }) {
  const locale = useLocale();
  const t = useTranslations("projects");
  const title = locale === "fa" ? project.titleFa : project.titleEn;
  const summary = locale === "fa" ? project.summaryFa : project.summaryEn;
  const tags = Array.isArray(project.tags) ? (project.tags as string[]) : [];

  return (
    <Link
      href={{ pathname: "/projects/[slug]", params: { slug: project.slug } }}
      className="group surface-card block h-full cursor-pointer overflow-hidden"
    >
      <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-surface-raised">
        {project.coverImageUrl ? (
          <Image
            src={project.coverImageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="card-media-zoom object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-raised px-4 text-center text-sm text-fg-muted">
            {title}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-fg transition-colors duration-200 group-hover:text-accent">
          {title}
        </h3>
        {summary && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg-muted">{summary}</p>
        )}
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="font-mono text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <span className="sr-only">{t("viewProject")}</span>
      </div>
    </Link>
  );
}
