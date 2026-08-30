import { getTranslations, setRequestLocale } from "next-intl/server";
import { PlaceholderNotice } from "@/components/site/placeholder-notice";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";

export const revalidate = 300;

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");

  const posts = await db.blogPost
    .findMany({
      where: { publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      select: {
        slug: true,
        titleEn: true,
        titleFa: true,
        excerptEn: true,
        excerptFa: true,
        publishedAt: true,
      },
    })
    .catch(() => []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl font-semibold text-fg">{t("title")}</h1>
      <p className="mt-2 text-fg-muted">{t("subtitle")}</p>

      <div className="mt-10 space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link key={post.slug} href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}>
              <Card className="transition-colors hover:border-accent">
                <CardHeader>
                  <p className="font-mono text-xs text-fg-muted">
                    {post.publishedAt &&
                      t("publishedOn", {
                        date: new Date(post.publishedAt).toLocaleDateString(locale),
                      })}
                  </p>
                  <CardTitle>{locale === "fa" ? post.titleFa : post.titleEn}</CardTitle>
                  {(locale === "fa" ? post.excerptFa : post.excerptEn) && (
                    <CardDescription>
                      {locale === "fa" ? post.excerptFa : post.excerptEn}
                    </CardDescription>
                  )}
                </CardHeader>
              </Card>
            </Link>
          ))
        ) : (
          <PlaceholderNotice />
        )}
      </div>
    </div>
  );
}
