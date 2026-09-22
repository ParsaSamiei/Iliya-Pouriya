import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HomeSection, HomeSectionInner } from "@/components/site/home-section";
import {
  MotionHover,
  MotionItem,
  MotionReveal,
  MotionStaggerInView,
} from "@/components/site/motion";
import { SectionHeader } from "@/components/site/section-header";
import type { LandingCopyView } from "@/lib/landing-copy";

export type RecommendationView = {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string | null;
  authorPhotoUrl: string | null;
  authorUrl: string | null;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function RecommendationsSection({
  copy,
  recommendations,
}: {
  copy: LandingCopyView;
  recommendations: RecommendationView[];
}) {
  if (recommendations.length === 0) return null;

  return (
    <HomeSection variant="recommendations" id="recommendations">
      <HomeSectionInner>
        <MotionReveal>
          <SectionHeader
            eyebrow={copy.recommendationsEyebrow}
            title={copy.recommendationsTitle}
            subtitle={copy.recommendationsSubtitle}
          />
        </MotionReveal>

        <MotionStaggerInView
          className="relative z-10 grid gap-6 sm:grid-cols-2"
          stagger={0.08}
        >
          {recommendations.map((rec) => {
            const body = (
              <>
                <blockquote className="font-display text-base leading-relaxed text-fg sm:text-lg">
                  <span className="text-accent" aria-hidden>
                    “
                  </span>
                  {rec.quote}
                  <span className="text-accent" aria-hidden>
                    ”
                  </span>
                </blockquote>
                <footer className="mt-6 flex items-center gap-3">
                  <Avatar className="size-11 overflow-hidden rounded-sm border border-border">
                    <AvatarImage
                      src={rec.authorPhotoUrl ?? undefined}
                      alt={rec.authorName}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-sm text-xs">
                      {initials(rec.authorName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <cite className="not-italic font-medium text-fg">{rec.authorName}</cite>
                    {rec.authorRole && (
                      <p className="mt-0.5 text-sm text-fg-muted">{rec.authorRole}</p>
                    )}
                  </div>
                </footer>
              </>
            );

            return (
              <MotionItem key={rec.id} className="h-full">
                <MotionHover lift={2}>
                  {rec.authorUrl ? (
                    <a
                      href={rec.authorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group surface-card flex h-full flex-col p-6 outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {body}
                    </a>
                  ) : (
                    <article className="surface-card flex h-full flex-col p-6">{body}</article>
                  )}
                </MotionHover>
              </MotionItem>
            );
          })}
        </MotionStaggerInView>
      </HomeSectionInner>
    </HomeSection>
  );
}
