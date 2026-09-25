import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export async function notFoundMetadata(): Promise<Metadata> {
  const t = await getTranslations("notFound");
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}

function OpenCircuitMark() {
  return (
    <svg className="nf-mark" viewBox="0 0 240 240" fill="none" aria-hidden>
      <defs>
        <linearGradient id="nf-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--signal)" />
        </linearGradient>
        <radialGradient id="nf-node" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Closed edges of the logo hex — the far-right facet is the open circuit. */}
      <path
        d="M120 28 L196 72 L196 118"
        stroke="url(#nf-stroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M196 158 L196 168 L120 212 L44 168 L44 72 L120 28"
        stroke="url(#nf-stroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M196 126 L210 148"
        stroke="url(#nf-stroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="5 7"
        opacity="0.55"
      />
      <circle cx="196" cy="118" r="22" fill="url(#nf-node)" />
      <circle cx="196" cy="158" r="16" fill="url(#nf-node)" opacity="0.7" />
      <circle cx="196" cy="118" r="3.5" fill="var(--accent)" />
      <circle cx="196" cy="158" r="3.5" fill="var(--signal)" />
    </svg>
  );
}

export function NotFoundView({
  status,
  title,
  body,
  children,
}: {
  status: string;
  title: string;
  body: string;
  children: ReactNode;
}) {
  return (
    <section className="relative isolate px-4 py-16 sm:py-24">
      <p
        className="pointer-events-none absolute end-4 top-8 select-none font-display text-[clamp(4.5rem,18vw,9rem)] font-semibold leading-none text-fg/[0.07] sm:end-8"
        aria-hidden
      >
        404
      </p>

      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-10 sm:gap-12 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] lg:gap-16">
        <div className="mx-auto w-36 sm:w-44 lg:w-full">
          <OpenCircuitMark />
        </div>

        <div>
          <p className="status-board-live">{status}</p>
          <h1 className="mt-5 max-w-xl font-display text-3xl font-semibold tracking-tight text-pretty text-fg sm:text-4xl lg:text-[2.6rem]">
            {title}
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-pretty text-fg-muted sm:text-lg">
            {body}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{children}</div>
        </div>
      </div>
    </section>
  );
}

export async function SiteNotFound() {
  const t = await getTranslations("notFound");

  return (
    <NotFoundView status={t("status")} title={t("title")} body={t("body")}>
      <Button asChild size="lg" className="btn-motion">
        <Link href="/">
          {t("home")}
          <ArrowRight data-icon="inline-end" className="landing-arrow" aria-hidden />
        </Link>
      </Button>
      <Button asChild size="lg" variant="outline" className="btn-motion">
        <Link href="/projects">{t("projects")}</Link>
      </Button>
      <Button asChild size="lg" variant="outline" className="btn-motion">
        <Link href="/contact">{t("contact")}</Link>
      </Button>
    </NotFoundView>
  );
}
