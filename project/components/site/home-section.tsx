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

/** Channel corner LEDs — alternate amber / cyan by section role */
const CHANNEL_LED_CLASS: Record<string, string> = {
  SYS: "led",
  CAP: "led led--signal",
  PRJ: "led",
  CREW: "led led--signal",
  LOG: "led",
  COM: "led",
};

type HomeSectionProps = {
  variant: HomeSectionVariant;
  children: ReactNode;
  className?: string;
  id?: string;
  /** Instrument channel label shown in the section corner, e.g. "SYS" */
  channel?: string;
};

export function HomeSection({ variant, children, className, id, channel }: HomeSectionProps) {
  return (
    <section id={id} className={cn("landing-section", VARIANT_CLASS[variant], className)}>
      {channel && (
        <span
          aria-hidden
          className="landing-section-channel pointer-events-none absolute top-6 end-6 flex items-center gap-2 font-mono text-[10px] tracking-wide uppercase"
        >
          <span className={CHANNEL_LED_CLASS[channel] ?? "led"} />
          {channel}
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
  hero?: boolean;
};

export function HomeSectionInner({ children, className, tight, hero }: HomeSectionInnerProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-6xl px-4",
        hero
          ? "flex min-h-0 flex-1 flex-col justify-center py-8 sm:py-10"
          : tight
            ? "py-16 sm:py-20"
            : "py-20 sm:py-24",
        className,
      )}
    >
      {children}
    </div>
  );
}
