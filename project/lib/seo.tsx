export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

/**
 * hreflang alternates for a given unprefixed path — see docs/08_SEO.md.
 * `fa` is unprefixed per the routing config in i18n/routing.ts.
 */
export function buildLocaleAlternates(path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const normalized = clean === "/" ? "" : clean;
  return {
    languages: {
      fa: absoluteUrl(normalized || "/"),
      en: absoluteUrl(`/en${normalized}`),
      "x-default": absoluteUrl(normalized || "/"),
    },
  };
}

type PersonLike = { slug: string; nameEn: string; nameFa: string; title: string; socialLinks: unknown };

export function personJsonLd(person: PersonLike) {
  const social = (person.socialLinks as { github?: string; linkedin?: string } | null) ?? {};
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.nameEn,
    jobTitle: person.title,
    url: absoluteUrl(`/team/${person.slug}`),
    sameAs: [social.github, social.linkedin].filter(Boolean),
  };
}

export function projectJsonLd(project: {
  slug: string;
  titleEn: string;
  summaryEn: string | null;
  coverImageUrl: string | null;
  contributors: { person: PersonLike }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.titleEn,
    description: project.summaryEn ?? undefined,
    url: absoluteUrl(`/projects/${project.slug}`),
    image: project.coverImageUrl ? absoluteUrl(project.coverImageUrl) : undefined,
    creator: project.contributors.map(({ person }) => ({
      "@type": "Person",
      name: person.nameEn,
    })),
  };
}

export function blogPostingJsonLd(post: {
  slug: string;
  titleEn: string;
  excerptEn: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  authors: { person: PersonLike }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.titleEn,
    description: post.excerptEn ?? undefined,
    url: absoluteUrl(`/blog/${post.slug}`),
    image: post.coverImageUrl ? absoluteUrl(post.coverImageUrl) : undefined,
    datePublished: post.publishedAt?.toISOString(),
    author: post.authors.map(({ person }) => ({ "@type": "Person", name: person.nameEn })),
  };
}

export function websiteJsonLd(siteName: string, people: PersonLike[]) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: SITE_URL,
    // Modeled as an informal Organization with both people as members —
    // see docs/08_SEO.md ("pick one and be consistent").
    publisher: {
      "@type": "Organization",
      name: siteName,
      member: people.map((p) => ({ "@type": "Person", name: p.nameEn })),
    },
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: server-generated JSON from our own DB, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
