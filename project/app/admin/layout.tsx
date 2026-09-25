import {
  Boxes,
  BriefcaseBusiness,
  Database,
  ExternalLink,
  HandHeart,
  History,
  Images,
  KeyRound,
  LayoutDashboard,
  Mail,
  MessageSquareQuote,
  Newspaper,
  Settings,
  Tags,
  Users,
  Wrench,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { auth, signOut } from "@/lib/auth";
import "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s — Admin",
  },
  description: "Iliya & Pouriya admin panel",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin/dashboard", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/crm", label: "داده CRM", icon: Database },
  { href: "/admin/people", label: "People", icon: Users },
  { href: "/admin/projects", label: "Projects", icon: Boxes },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/gallery-tags", label: "Gallery tags", icon: Tags },
  { href: "/admin/experience", label: "Experience", icon: History },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/recommendations", label: "Recommendations", icon: MessageSquareQuote },
  { href: "/admin/clients", label: "Clients", icon: BriefcaseBusiness },
  { href: "/admin/sponsors", label: "Sponsors", icon: HandHeart },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/account", label: "Account", icon: KeyRound },
] as const;

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  // The /admin/login page renders its own full-screen layout without this
  // shell — proxy.ts already excludes it from the auth check.
  if (!session?.user) {
    return (
      <html lang="en" data-scroll-behavior="smooth">
        <body className="bg-bg font-body text-fg">
          {children}
          <Toaster theme="dark" />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="flex min-h-screen bg-bg font-body text-fg antialiased">
        <aside className="hidden w-56 shrink-0 border-r border-border p-4 sm:block">
          <Link
            href="/admin/dashboard"
            className="mb-6 block px-2 font-display text-sm font-semibold text-fg hover:text-accent"
          >
            Admin
          </Link>
          <nav className="space-y-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-2 text-sm text-fg-muted hover:bg-surface-raised hover:text-fg"
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 space-y-1 px-2">
            <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
              <Link href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
                View site
              </Link>
            </Button>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <Button type="submit" variant="ghost" size="sm" className="w-full justify-start">
                Sign out
              </Button>
            </form>
          </div>
        </aside>

        <div className="flex-1 overflow-x-hidden">
          <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
        </div>
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
