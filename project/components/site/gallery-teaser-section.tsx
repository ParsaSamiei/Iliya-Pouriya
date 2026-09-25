import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { GalleryCarousel } from "@/components/site/gallery/gallery-carousel";
import { HomeSection, HomeSectionInner } from "@/components/site/home-section";
import { MotionReveal } from "@/components/site/motion";
import { SectionHeader } from "@/components/site/section-header";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { db } from "@/lib/db";
import { pickLocaleText, toGalleryLightboxItem } from "@/lib/gallery";

export async function GalleryTeaserSection({ locale }: { locale: string }) {
  const tHome = await getTranslations("home");

  const items = await db.galleryItem
    .findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      take: 8,
    })
    .catch(() => []);

  if (items.length === 0) return null;

  const slides = items.map((item) =>
    toGalleryLightboxItem(item, {
      alt:
        pickLocaleText(item.altFa, item.altEn, locale) ??
        (locale === "fa" ? "رسانه گالری" : "Gallery media"),
      caption: pickLocaleText(item.captionFa, item.captionEn, locale),
    }),
  );

  return (
    <HomeSection variant="gallery" id="gallery">
      <HomeSectionInner>
        <MotionReveal className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            title={tHome("galleryTitle")}
            subtitle={tHome("gallerySubtitle")}
            className="mb-0"
          />
          <Button asChild variant="outline" className="btn-motion shrink-0">
            <Link href="/gallery">
              {tHome("viewAllGallery")}
              <ArrowRight data-icon="inline-end" className="landing-arrow" />
            </Link>
          </Button>
        </MotionReveal>

        <MotionReveal className="relative z-10 mt-10" delay={0.1}>
          <GalleryCarousel items={slides} />
        </MotionReveal>
      </HomeSectionInner>
    </HomeSection>
  );
}
