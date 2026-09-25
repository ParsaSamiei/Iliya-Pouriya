import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "start" | "center";
};

export function SectionHeader({
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
      <h2 className="font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
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
