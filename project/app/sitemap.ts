import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { db } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

const STATIC_PATHS = ["", "/projects", "/blog", "/about", "/contact"];

function localizedPath(locale: string, path: string) {
  return locale === routing.defaultLocale ? path || "/" : `/${locale}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts, people] = await Promise.all([
    db.project.findMany({
      where: { publishedAt: { not: null } },
      select: { slug: true, publishedAt: true },
    }),
    db.blogPost.findMany({
      where: { publishedAt: { not: null } },
      select: { slug: true, publishedAt: true },
    }),
    db.person.findMany({ select: { slug: true } }),
  ]).catch(() => [[], [], []] as const);

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) {
      entries.push({ url: `${SITE_URL}${localizedPath(locale, path)}` });
    }
    for (const project of projects) {
      entries.push({
        url: `${SITE_URL}${localizedPath(locale, `/projects/${project.slug}`)}`,
        lastModified: project.publishedAt ?? undefined,
      });
    }
    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}${localizedPath(locale, `/blog/${post.slug}`)}`,
        lastModified: post.publishedAt ?? undefined,
      });
    }
    for (const person of people) {
      entries.push({ url: `${SITE_URL}${localizedPath(locale, `/team/${person.slug}`)}` });
    }
  }

  return entries;
}
