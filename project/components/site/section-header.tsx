import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "start" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className,
  align = "start",
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        "mb-10",
        align === "center" ? "text-center" : "text-start",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2.5",
          align === "center" && "justify-center",
        )}
      >
        <span className="led led--dim" aria-hidden />
        <p className="font-mono text-[11px] tracking-wide text-accent uppercase">{eyebrow}</p>
      </div>
      <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-3 max-w-2xl text-fg-muted",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
