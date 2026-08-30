import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MarkdownContent } from "@/components/site/markdown-content";
import { db } from "@/lib/db";
import { formatPersonList } from "@/lib/person";
import { absoluteUrl, blogPostingJsonLd, buildLocaleAlternates, JsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  const posts = await db.blogPost
    .findMany({ where: { publishedAt: { not: null } }, select: { slug: true } })
    .catch(() => []);
  return posts.map((p) => ({ slug: p.slug }));
}

export const revalidate = 300;

async function getPost(slug: string) {
  return db.blogPost.findFirst({
    where: { slug, publishedAt: { not: null } },
    include: { authors: { include: { person: true } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPost(slug).catch(() => null);
  if (!post) return {};
  const title = locale === "fa" ? post.titleFa : post.titleEn;
  const description = (locale === "fa" ? post.excerptFa : post.excerptEn) ?? undefined;
  const ogImage = post.coverImageUrl ? [absoluteUrl(post.coverImageUrl)] : undefined;

  return {
    title,
    description,
    alternates: buildLocaleAlternates(`/blog/${slug}`),
    openGraph: {
      title,
      description,
      images: ogImage,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
    },
    twitter: { card: "summary_large_image", title, description, images: ogImage },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");

  const post = await getPost(slug).catch(() => null);
  if (!post) notFound();

  const title = locale === "fa" ? post.titleFa : post.titleEn;
  const content = locale === "fa" ? post.contentFa : post.contentEn;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <JsonLd data={blogPostingJsonLd(post)} />
      {post.coverImageUrl && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-[var(--radius-lg)] bg-surface-raised">
          <Image src={post.coverImageUrl} alt={title} fill className="object-cover" />
        </div>
      )}
      <p className="font-mono text-xs text-fg-muted">
        {post.publishedAt &&
          t("publishedOn", { date: new Date(post.publishedAt).toLocaleDateString(locale) })}
        {post.authors.length > 0 &&
          ` · ${formatPersonList(
            post.authors.map(({ person }) => person),
            locale,
          )}`}
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-fg sm:text-4xl">{title}</h1>

      {content && <MarkdownContent content={content} dir={locale === "fa" ? "rtl" : "ltr"} />}
    </article>
  );
}
