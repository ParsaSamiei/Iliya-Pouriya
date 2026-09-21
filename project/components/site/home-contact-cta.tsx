import { ArrowRight, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { HomeSection, HomeSectionInner } from "@/components/site/home-section";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export async function HomeContactCta() {
  const t = await getTranslations("home");

  return (
    <HomeSection variant="contact" id="contact">
      <HomeSectionInner tight>
        <div className="relative z-10 flex flex-col items-start gap-6 border-s-2 border-transparent ps-6 [border-image:linear-gradient(to_bottom,var(--color-accent),var(--color-signal))_1] sm:flex-row sm:items-center sm:justify-between sm:ps-8">
          <div className="max-w-xl">
            <p className="text-xs font-medium tracking-[0.14em] text-accent uppercase">
              {t("contactEyebrow")}
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl lg:text-[2rem]">
              {t("contactTitle")}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-fg-muted">{t("contactSubtitle")}</p>
          </div>
          <Button asChild size="lg" className="btn-motion shrink-0">
            <Link href="/contact">
              <Mail data-icon="inline-start" aria-hidden />
              {t("ctaContact")}
              <ArrowRight data-icon="inline-end" className="landing-arrow" aria-hidden />
            </Link>
          </Button>
        </div>
      </HomeSectionInner>
    </HomeSection>
  );
}
