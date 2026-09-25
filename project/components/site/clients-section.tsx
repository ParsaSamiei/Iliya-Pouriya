import { ClientsCarousel } from "@/components/site/clients-carousel";
import { HomeSection, HomeSectionInner } from "@/components/site/home-section";
import { MotionReveal } from "@/components/site/motion";
import { SectionHeader } from "@/components/site/section-header";
import type { LandingCopyView } from "@/lib/landing-copy";

export type ClientView = {
  id: string;
  name: string;
  note: string | null;
  logoUrl: string | null;
  url: string | null;
};

export function ClientsSection({
  copy,
  clients,
}: {
  copy: LandingCopyView;
  clients: ClientView[];
}) {
  if (clients.length === 0) return null;

  return (
    <HomeSection variant="clients" id="clients">
      <HomeSectionInner>
        <MotionReveal>
          <SectionHeader
            title={copy.clientsTitle}
            subtitle={copy.clientsSubtitle}
          />
        </MotionReveal>

        <MotionReveal className="relative z-10 mt-10">
          <ClientsCarousel items={clients} />
        </MotionReveal>
      </HomeSectionInner>
    </HomeSection>
  );
}
