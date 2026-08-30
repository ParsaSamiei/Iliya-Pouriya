import {
  Boxes,
  History,
  LayoutDashboard,
  Mail,
  Newspaper,
  Settings,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";
import "@/lib/fonts";
import "../globals.css";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/people", label: "People", icon: Users },
  { href: "/admin/projects", label: "Projects", icon: Boxes },
  { href: "/admin/experience", label: "Experience", icon: History },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  // The /admin/login page renders its own full-screen layout without this
  // shell — proxy.ts already excludes it from the auth check.
  if (!session?.user) {
    return (
      <html lang="en">
        <body className="bg-bg font-body text-fg">{children}</body>
      </html>
    );
  }

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="flex min-h-screen bg-bg font-body text-fg antialiased">
        <aside className="hidden w-56 shrink-0 border-r border-border p-4 sm:block">
          <p className="mb-6 px-2 font-display text-sm font-semibold">Admin</p>
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

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
            className="mt-6 px-2"
          >
            <Button type="submit" variant="ghost" size="sm" className="w-full justify-start">
              Sign out
            </Button>
          </form>
        </aside>

        <div className="flex-1 overflow-x-hidden">
          <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
