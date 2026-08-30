import { MessageRow } from "@/components/admin/message-row";
import { db } from "@/lib/db";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ recipient?: string }>;
}) {
  const { recipient } = await searchParams;

  const messages = await db.contactMessage.findMany({
    where: recipient ? { recipient } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold">Messages</h1>

      <div className="flex gap-2 text-sm">
        <a href="/admin/messages" className={!recipient ? "text-accent" : "text-fg-muted"}>
          All
        </a>
        <a
          href="/admin/messages?recipient=iliya"
          className={recipient === "iliya" ? "text-accent" : "text-fg-muted"}
        >
          Iliya
        </a>
        <a
          href="/admin/messages?recipient=pouriya"
          className={recipient === "pouriya" ? "text-accent" : "text-fg-muted"}
        >
          Pouriya
        </a>
      </div>

      <div className="space-y-3">
        {messages.map((message) => (
          <MessageRow key={message.id} message={message} />
        ))}
        {messages.length === 0 && <p className="text-sm text-fg-muted">No messages.</p>}
      </div>
    </div>
  );
}
