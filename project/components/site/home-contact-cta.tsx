import { ArrowRight, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { HomeSection, HomeSectionInner } from "@/components/site/home-section";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export async function HomeContactCta() {
  const t = await getTranslations("home");

  return (
    <HomeSection variant="contact" id="contact" channel="COM">
      <HomeSectionInner tight>
        <div className="panel-module relative z-10 p-8 sm:p-12">
          <div className="panel-module__bezel" aria-hidden />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden instrument-grid opacity-30"
          />

          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-2.5">
                <span className="led" aria-hidden />
                <p className="font-mono text-[11px] tracking-wide text-accent uppercase">
                  {t("contactEyebrow")}
                </p>
              </div>
              <h2 className="mt-3 font-display text-2xl font-semibold text-fg sm:text-3xl">
                {t("contactTitle")}
              </h2>
              <p className="mt-3 text-fg-muted">{t("contactSubtitle")}</p>
            </div>
            <Button asChild size="lg" className="btn-motion shrink-0">
              <Link href="/contact">
                <Mail data-icon="inline-start" aria-hidden />
                {t("ctaContact")}
                <ArrowRight data-icon="inline-end" className="landing-arrow" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </HomeSectionInner>
    </HomeSection>
  );
}
