import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      className="cursor-pointer"
    >
      <Card className="group h-full overflow-hidden transition-colors duration-200 hover:border-accent/60 hover:bg-surface-raised">
        <div className="relative aspect-video w-full overflow-hidden bg-surface-raised">
          {project.coverImageUrl ? (
            <Image
              src={project.coverImageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="bp-grid flex h-full w-full items-center justify-center text-xs font-mono text-fg-muted">
              {t("empty") ? title : title}
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {summary && <CardDescription className="line-clamp-2">{summary}</CardDescription>}
        </CardHeader>
        {tags.length > 0 && (
          <CardContent className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
