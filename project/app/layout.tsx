import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

// Root layout is intentionally minimal — the real <html lang dir> and
// providers live in app/[locale]/layout.tsx (see docs/06_FRONTEND_ARCHITECTURE.md).
// This segment only exists because Next.js requires a root layout.
// Favicon / PWA metadata lives here so it applies to locale + admin routes.

export const metadata: Metadata = {
  applicationName: "Iliya & Pouriya",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "Iliya & Pouriya",
    statusBarStyle: "black-translucent",
  },
  other: {
    "msapplication-TileColor": "#14161a",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e6e8ea" },
    { media: "(prefers-color-scheme: dark)", color: "#14161a" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
