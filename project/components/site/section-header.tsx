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
      <p className="font-mono text-xs tracking-widest text-accent uppercase">{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
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
