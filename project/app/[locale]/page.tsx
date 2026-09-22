import { ArrowRight } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { BlogPostCard } from "@/components/site/blog-post-card";
import { CapabilityGrid } from "@/components/site/capability-grid";
import { ClientsSection } from "@/components/site/clients-section";
import { GalleryTeaserSection } from "@/components/site/gallery-teaser-section";
import { HomeContactCta } from "@/components/site/home-contact-cta";
import { HomeHero } from "@/components/site/home-hero";
import { HomeSection, HomeSectionInner } from "@/components/site/home-section";
import {
  MotionHover,
  MotionItem,
  MotionReveal,
  MotionStaggerInView,
} from "@/components/site/motion";
import { PlaceholderNotice } from "@/components/site/placeholder-notice";
import { ProjectCard } from "@/components/site/project-card";
import { RecommendationsSection } from "@/components/site/recommendations-section";
import { SectionHeader } from "@/components/site/section-header";
import { TeamCard } from "@/components/site/team-card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getHomepageClients } from "@/lib/clients";
import { db } from "@/lib/db";
import { getLandingCopy } from "@/lib/get-landing-copy";
import { getSiteMetadata } from "@/lib/get-site-metadata";
import { JsonLd, websiteJsonLd } from "@/lib/seo";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomePageContent locale={locale} />;
}

async function HomePageContent({ locale }: { locale: string }) {
  const [copy, site] = await Promise.all([
    getLandingCopy(locale),
    getSiteMetadata(locale),
  ]);

  const isFa = locale === "fa";

  const [featuredProjects, people, latestPosts, recommendations, clients] =
    await Promise.all([
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
    db.recommendation
      .findMany({
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          quoteEn: true,
          quoteFa: true,
          authorNameEn: true,
          authorNameFa: true,
          authorRoleEn: true,
          authorRoleFa: true,
          authorPhotoUrl: true,
          authorUrl: true,
        },
      })
      .catch(() => []),
    getHomepageClients(),
  ]);

  const recommendationViews = recommendations.map((rec) => ({
    id: rec.id,
    quote: isFa ? rec.quoteFa : rec.quoteEn,
    authorName: isFa ? rec.authorNameFa : rec.authorNameEn,
    authorRole: isFa ? rec.authorRoleFa : rec.authorRoleEn,
    authorPhotoUrl: rec.authorPhotoUrl,
    authorUrl: rec.authorUrl,
  }));

  const clientViews = clients.map((client) => ({
    id: client.id,
    name: isFa ? client.nameFa : client.nameEn,
    note: isFa ? client.noteFa : client.noteEn,
    logoUrl: client.logoUrl,
    url: client.url,
  }));

  return (
    <div>
      <JsonLd data={websiteJsonLd(site.name, people)} />

      <HomeHero copy={copy} siteName={site.name} />

      <HomeSection variant="projects" id="projects">
        <HomeSectionInner>
          <MotionReveal className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow={copy.projectsEyebrow}
              title={copy.featuredProjects}
              subtitle={copy.featuredProjectsSubtitle}
              className="mb-0"
            />
            <Button asChild variant="outline" className="btn-motion shrink-0">
              <Link href="/projects">
                {copy.viewAllProjects}
                <ArrowRight data-icon="inline-end" className="landing-arrow" />
              </Link>
            </Button>
          </MotionReveal>

          <div className="relative z-10 mt-10">
            {featuredProjects.length > 0 ? (
              <MotionStaggerInView className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.map((project) => (
                  <MotionItem key={project.slug} className="h-full">
                    <MotionHover>
                      <ProjectCard project={project} />
                    </MotionHover>
                  </MotionItem>
                ))}
              </MotionStaggerInView>
            ) : (
              <MotionReveal>
                <PlaceholderNotice />
              </MotionReveal>
            )}
          </div>
        </HomeSectionInner>
      </HomeSection>

      <GalleryTeaserSection locale={locale} />

      {people.length > 0 && (
        <HomeSection variant="team" id="team">
          <HomeSectionInner>
            <MotionReveal>
              <SectionHeader
                eyebrow={copy.teamEyebrow}
                title={copy.meetTheTeam}
                subtitle={copy.meetTheTeamSubtitle}
              />
            </MotionReveal>
            <MotionStaggerInView className="relative z-10 grid gap-6 sm:grid-cols-2">
              {people.map((person) => (
                <MotionItem key={person.slug} className="h-full">
                  <MotionHover>
                    <TeamCard person={person} />
                  </MotionHover>
                </MotionItem>
              ))}
            </MotionStaggerInView>
          </HomeSectionInner>
        </HomeSection>
      )}

      <CapabilityGrid copy={copy} />

      <ClientsSection copy={copy} clients={clientViews} />

      <RecommendationsSection copy={copy} recommendations={recommendationViews} />

      <HomeSection variant="blog" id="blog">
        <HomeSectionInner>
          <MotionReveal className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow={copy.blogEyebrow}
              title={copy.latestPosts}
              subtitle={copy.latestPostsSubtitle}
              className="mb-0"
            />
            <Button asChild variant="outline" className="btn-motion shrink-0">
              <Link href="/blog">
                {copy.viewAllPosts}
                <ArrowRight data-icon="inline-end" className="landing-arrow" />
              </Link>
            </Button>
          </MotionReveal>

          <div className="relative z-10 mt-10">
            {latestPosts.length > 0 ? (
              <MotionStaggerInView className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
                {latestPosts.map((post) => (
                  <MotionItem key={post.slug} className="h-full">
                    <MotionHover lift={2}>
                      <BlogPostCard post={post} />
                    </MotionHover>
                  </MotionItem>
                ))}
              </MotionStaggerInView>
            ) : (
              <MotionReveal>
                <PlaceholderNotice />
              </MotionReveal>
            )}
          </div>
        </HomeSectionInner>
      </HomeSection>

      <HomeContactCta
        eyebrow={copy.contactEyebrow}
        title={copy.contactTitle}
        subtitle={copy.contactSubtitle}
        cta={copy.ctaContact}
      />
    </div>
  );
}
