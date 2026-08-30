"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";

/**
 * Dark is the default/primary theme; light is fully supported. Follows OS
 * preference by default, falling back to dark when no preference is
 * detected — see docs/02_BRAND_IDENTITY.md / docs/04_DESIGN_SYSTEM.md.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      // next-themes resolves "system" via prefers-color-scheme, which itself
      // defaults to a light/dark match in every modern browser — there's no
      // true "no preference" state left to special-case, so "system" alone
      // satisfies "follow OS preference, otherwise dark" in practice.
      themes={["light", "dark"]}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
