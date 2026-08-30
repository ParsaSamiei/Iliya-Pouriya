import type { ReactNode } from "react";

// Root layout is intentionally minimal — the real <html lang dir> and
// providers live in app/[locale]/layout.tsx (see docs/06_FRONTEND_ARCHITECTURE.md).
// This segment only exists because Next.js requires a root layout.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
