import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { NotFoundView } from "@/components/site/not-found-view";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

export default function AdminNotFound() {
  return (
    <NotFoundView
      status="ERR.NOT_FOUND"
      title="This admin page does not exist"
      body="That route is not in the panel. Open the dashboard and continue from there."
    >
      <Button asChild size="lg" className="btn-motion">
        <Link href="/admin/dashboard">
          Dashboard
          <ArrowRight data-icon="inline-end" className="landing-arrow" aria-hidden />
        </Link>
      </Button>
    </NotFoundView>
  );
}
