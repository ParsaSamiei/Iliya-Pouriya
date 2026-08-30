import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type BlogPostCardProps = {
  post: {
    slug: string;
    titleEn: string;
    titleFa: string;
    excerptEn: string | null;
    excerptFa: string | null;
    publishedAt: Date | null;
  };
};

export async function BlogPostCard({ post }: BlogPostCardProps) {
  const locale = await getLocale();
  const t = await getTranslations("blog");
  const title = locale === "fa" ? post.titleFa : post.titleEn;
  const excerpt = locale === "fa" ? post.excerptFa : post.excerptEn;

  return (
    <Link
      href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
      className="group flex h-full cursor-pointer flex-col border border-border bg-bg p-5 transition-colors duration-200 hover:border-accent/60 hover:bg-surface"
    >
      {post.publishedAt && (
        <time
          dateTime={post.publishedAt.toISOString()}
          className="font-mono text-xs text-fg-muted"
        >
          {t("publishedOn", {
            date: new Date(post.publishedAt).toLocaleDateString(locale),
          })}
        </time>
      )}
      <h3 className="mt-2 font-display text-lg font-semibold text-fg transition-colors duration-200 group-hover:text-accent">
        {title}
      </h3>
      {excerpt && (
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-fg-muted">
          {excerpt}
        </p>
      )}
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-link transition-colors duration-200 group-hover:text-accent">
        {t("readMore")}
        <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden />
      </span>
    </Link>
  );
}
