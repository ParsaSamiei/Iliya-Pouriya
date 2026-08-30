import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [projectCount, postCount, unreadMessages, recentMessages] = await Promise.all([
    db.project.count(),
    db.blogPost.count(),
    db.contactMessage.count({ where: { readAt: null } }),
    db.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-semibold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-fg-muted">Projects</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-display font-semibold">{projectCount}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-fg-muted">Blog posts</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-display font-semibold">{postCount}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-fg-muted">Unread messages</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-display font-semibold text-accent">
            {unreadMessages}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent messages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentMessages.length === 0 && <p className="text-sm text-fg-muted">No messages yet.</p>}
          {recentMessages.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between border-b border-border pb-2 last:border-0"
            >
              <div>
                <p className="text-sm font-medium">{m.name}</p>
                <p className="text-xs text-fg-muted">{m.email}</p>
              </div>
              {!m.readAt && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-mono text-accent-fg">
                  new
                </span>
              )}
            </div>
          ))}
          <Link href="/admin/messages" className="inline-block text-sm text-link hover:underline">
            View all messages →
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
