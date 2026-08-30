import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogPostCard } from "@/components/site/blog-post-card";
import { CapabilityGrid } from "@/components/site/capability-grid";
import { HomeContactCta } from "@/components/site/home-contact-cta";
import { HomeHero } from "@/components/site/home-hero";
import { HomeSection, HomeSectionInner } from "@/components/site/home-section";
import { PlaceholderNotice } from "@/components/site/placeholder-notice";
import { ProjectCard } from "@/components/site/project-card";
import { SectionHeader } from "@/components/site/section-header";
import { TeamCard } from "@/components/site/team-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { JsonLd, websiteJsonLd } from "@/lib/seo";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tSite = await getTranslations("site");

  const [featuredProjects, people, latestPosts, projectCount] = await Promise.all([
    db.project
      .findMany({
        where: { publishedAt: { not: null }, isFeatured: true },
        orderBy: { sortOrder: "asc" },
        take: 3,
        select: {
          slug: true,
          titleEn: true,
          titleFa: true,
          summaryEn: true,
          summaryFa: true,
          coverImageUrl: true,
          tags: true,
        },
      })
      .catch(() => []),
    db.person
      .findMany({
        orderBy: { sortOrder: "asc" },
        select: {
          slug: true,
          nameEn: true,
          nameFa: true,
          title: true,
          photoUrl: true,
          bioEn: true,
          bioFa: true,
          socialLinks: true,
        },
      })
      .catch(() => []),
    db.blogPost
      .findMany({
        where: { publishedAt: { not: null } },
        orderBy: { publishedAt: "desc" },
        take: 3,
        select: {
          slug: true,
          titleEn: true,
          titleFa: true,
          excerptEn: true,
          excerptFa: true,
          publishedAt: true,
        },
      })
      .catch(() => []),
    db.project
      .count({ where: { publishedAt: { not: null } } })
      .catch(() => 0),
  ]);

  return (
    <div>
      <JsonLd data={websiteJsonLd(tSite("name"), people)} />

      <HomeHero projectCount={projectCount} engineerCount={people.length} />

      <CapabilityGrid />

      <HomeSection variant="projects" id="projects" index="03">
        <HomeSectionInner>
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow={t("projectsEyebrow")}
              title={t("featuredProjects")}
              subtitle={t("featuredProjectsSubtitle")}
              className="mb-0"
            />
            <Button asChild variant="outline" className="cursor-pointer shrink-0">
              <Link href="/projects">
                {t("viewAllProjects")}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>

          <div className="relative z-10 mt-10">
            {featuredProjects.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            ) : (
              <PlaceholderNotice />
            )}
          </div>
        </HomeSectionInner>
      </HomeSection>

      {people.length > 0 && (
        <HomeSection variant="team" id="team" index="04">
          <HomeSectionInner>
            <SectionHeader
              eyebrow={t("teamEyebrow")}
              title={t("meetTheTeam")}
              subtitle={t("meetTheTeamSubtitle")}
            />
            <div className="relative z-10 grid gap-6 sm:grid-cols-2">
              {people.map((person) => (
                <TeamCard key={person.slug} person={person} />
              ))}
            </div>
          </HomeSectionInner>
        </HomeSection>
      )}

      <HomeSection variant="blog" id="blog" index="05">
        <HomeSectionInner>
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow={t("blogEyebrow")}
              title={t("latestPosts")}
              subtitle={t("latestPostsSubtitle")}
              className="mb-0"
            />
            <Button asChild variant="outline" className="cursor-pointer shrink-0">
              <Link href="/blog">
                {t("viewAllPosts")}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>

          <div className="relative z-10 mt-10">
            {latestPosts.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {latestPosts.map((post) => (
                  <BlogPostCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <PlaceholderNotice />
            )}
          </div>
        </HomeSectionInner>
      </HomeSection>

      <HomeContactCta />
    </div>
  );
}
