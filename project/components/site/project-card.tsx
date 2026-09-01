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
      className="group panel-module block h-full cursor-pointer overflow-hidden transition-colors duration-200 hover:border-accent/40"
    >
      <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-bg">
        {project.coverImageUrl ? (
          <Image
            src={project.coverImageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="instrument-grid flex h-full w-full items-center justify-center font-mono text-xs text-fg-muted">
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
      </div>
    </Link>
  );
}
