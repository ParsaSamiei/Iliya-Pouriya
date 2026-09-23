import { cn } from "@/lib/utils";

type SkeletonProps = React.ComponentProps<"div"> & {
  /** Soft teal shimmer sweep */
  shiny?: boolean;
};

function Skeleton({ className, shiny = true, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-[var(--radius-sm)] bg-surface-raised",
        shiny ? "skeleton-shiny" : "animate-pulse",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
