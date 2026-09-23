import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GalleryGrid } from "@/components/site/gallery/gallery-grid";
import { MotionReveal } from "@/components/site/motion";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { pickLocaleText, toGalleryLightboxItem } from "@/lib/gallery";
import { buildLocaleAlternates } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: buildLocaleAlternates("/gallery"),
  };
}

export default async function GalleryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gallery");
  const { tag: tagParam } = await searchParams;

  const [tags, images] = await Promise.all([
    db.galleryTag
      .findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      })
      .catch(() => []),
    db.galleryItem
      .findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        include: {
          tags: {
            where: { tag: { isActive: true } },
            orderBy: { tag: { sortOrder: "asc" } },
            include: { tag: true },
          },
        },
      })
      .catch(() => []),
  ]);

  const activeSlug =
    tagParam && tags.some((tag) => tag.slug === tagParam) ? tagParam : undefined;

  const filtered = activeSlug
    ? images.filter((image) =>
        image.tags.some((assignment) => assignment.tag.slug === activeSlug),
      )
    : images;

  const items = filtered.map((item) =>
    toGalleryLightboxItem(item, {
      alt:
        pickLocaleText(item.altFa, item.altEn, locale) ??
        (locale === "fa" ? "رسانه گالری" : "Gallery media"),
      caption: pickLocaleText(item.captionFa, item.captionEn, locale),
    }),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <MotionReveal>
        <h1 className="font-display text-3xl font-semibold text-fg">{t("title")}</h1>
        <p className="mt-2 max-w-2xl text-fg-muted">{t("subtitle")}</p>
      </MotionReveal>

      {tags.length > 0 ? (
        <MotionReveal delay={0.08} className="mt-8">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label={t("filterLabel")}
          >
            <Link
              href="/gallery"
              className={cn(
                "cursor-pointer rounded-[var(--radius-sm)] border px-3.5 py-1.5 text-sm font-medium transition-colors",
                !activeSlug
                  ? "border-accent bg-accent text-accent-fg"
                  : "border-border text-fg-muted hover:border-accent hover:text-fg",
              )}
            >
              {t("filterAll")}
            </Link>
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={{ pathname: "/gallery", query: { tag: tag.slug } }}
                className={cn(
                  "cursor-pointer rounded-[var(--radius-sm)] border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  activeSlug === tag.slug
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-border text-fg-muted hover:border-accent hover:text-fg",
                )}
              >
                {locale === "fa" ? tag.nameFa : tag.nameEn}
              </Link>
            ))}
          </div>
        </MotionReveal>
      ) : null}

      {items.length === 0 ? (
        <MotionReveal className={cn("text-center text-fg-muted", "mt-10")}>
          <p>{activeSlug ? t("emptyFiltered") : t("empty")}</p>
        </MotionReveal>
      ) : (
        <div className={cn(tags.length > 0 ? "mt-8" : "mt-10")}>
          <GalleryGrid items={items} openLabel={t("openItem")} />
        </div>
      )}
    </div>
  );
}
