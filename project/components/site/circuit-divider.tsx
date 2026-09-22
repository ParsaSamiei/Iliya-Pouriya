import { cn } from "@/lib/utils";

/** Full-bleed section rule — teal → violet, edge to edge. */
export function CircuitDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative w-full", className)}>
      <div
        className="h-0.5 w-full"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, color-mix(in srgb, var(--accent) 85%, transparent) 12%, color-mix(in srgb, var(--fg) 40%, transparent) 50%, color-mix(in srgb, var(--signal) 80%, transparent) 88%, transparent 100%)",
        }}
      />
    </div>
  );
}
