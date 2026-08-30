import { ArrowRight, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { HomeSection, HomeSectionInner } from "@/components/site/home-section";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export async function HomeContactCta() {
  const t = await getTranslations("home");

  return (
    <HomeSection variant="contact" id="contact" index="06">
      <HomeSectionInner tight>
        <div className="relative z-10 overflow-hidden border border-border bg-bg p-8 sm:p-12">
          <div aria-hidden className="pointer-events-none absolute inset-0 bp-grid-intense opacity-50" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-br from-bg/30 via-bg/85 to-bg"
          />
          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-xs tracking-widest text-accent uppercase">
                {t("contactEyebrow")}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-fg sm:text-3xl">
                {t("contactTitle")}
              </h2>
              <p className="mt-3 text-fg-muted">{t("contactSubtitle")}</p>
            </div>
            <Button asChild size="lg" className="cursor-pointer shrink-0">
              <Link href="/contact">
                <Mail className="size-4" aria-hidden />
                {t("ctaContact")}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </HomeSectionInner>
    </HomeSection>
  );
}
