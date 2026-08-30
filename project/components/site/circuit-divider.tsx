import { cn } from "@/lib/utils";

/** PCB-style section divider — uses currentColor / theme border tokens. */
export function CircuitDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("mx-auto flex max-w-6xl items-center gap-3 px-4 py-2", className)}
    >
      <span className="size-1.5 shrink-0 rounded-full border border-accent bg-surface" />
      <svg
        className="h-px min-w-0 flex-1 text-border"
        viewBox="0 0 400 2"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 1 H120 M140 1 H260 M280 1 H400"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="size-1.5 shrink-0 rounded-full border border-accent bg-accent/20" />
    </div>
  );
}
