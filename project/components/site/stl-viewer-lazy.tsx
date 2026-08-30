"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Client-only wrapper so three.js never ships to pages without a model.
// Server Components cannot use dynamic({ ssr: false }) — see docs/06_FRONTEND_ARCHITECTURE.md.
export const StlViewerLazy = dynamic(
  () => import("@/components/site/stl-viewer").then((m) => m.StlViewer),
  {
    ssr: false,
    loading: () => <Skeleton className="h-80 w-full sm:h-96" />,
  },
);
