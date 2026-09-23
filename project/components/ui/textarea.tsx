import type * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-sm text-fg shadow-xs outline-none placeholder:text-fg-muted disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-accent",
        "aria-invalid:border-error aria-invalid:ring-error/40",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
