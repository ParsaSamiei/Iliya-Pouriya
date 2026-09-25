import { cn } from "@/lib/utils";

export function CrmEmptyState({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-40 flex-col items-center justify-center rounded-[var(--radius-md)] border border-dashed border-border bg-surface/40 px-6 py-10 text-center",
        className,
      )}
    >
      <p className="text-sm font-medium text-fg">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-xs text-fg-muted">{description}</p> : null}
    </div>
  );
}
