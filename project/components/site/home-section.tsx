import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const VARIANT_CLASS = {
  hero: "landing-section-hero",
  capabilities: "landing-section-capabilities",
  projects: "landing-section-projects",
  team: "landing-section-team",
  blog: "landing-section-blog",
  contact: "landing-section-contact",
} as const;

export type HomeSectionVariant = keyof typeof VARIANT_CLASS;

type HomeSectionProps = {
  variant: HomeSectionVariant;
  children: ReactNode;
  className?: string;
  id?: string;
  /** Monospace section index shown in the corner, e.g. "01" */
  index?: string;
};

export function HomeSection({ variant, children, className, id, index }: HomeSectionProps) {
  return (
    <section id={id} className={cn("landing-section", VARIANT_CLASS[variant], className)}>
      {index && (
        <span
          aria-hidden
          className="landing-section-index pointer-events-none absolute top-6 end-6 max-w-[40%] truncate font-mono text-xs tracking-widest text-fg-muted/40 uppercase rtl:normal-case rtl:tracking-normal"
        >
          {index}
        </span>
      )}
      {children}
    </section>
  );
}

type HomeSectionInnerProps = {
  children: ReactNode;
  className?: string;
  tight?: boolean;
  /** Full-viewport hero: flex centering with header offset, no default section padding */
  hero?: boolean;
};

export function HomeSectionInner({ children, className, tight, hero }: HomeSectionInnerProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-6xl px-4",
        hero
          ? "flex min-h-0 flex-1 flex-col justify-center py-6 sm:py-8"
          : tight
            ? "py-16 sm:py-20"
            : "py-24",
        className,
      )}
    >
      {children}
    </div>
  );
}
