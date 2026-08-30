"use client";

import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ContactMessage } from "@/generated/prisma/client";
import { markMessageRead } from "@/lib/actions/messages";

export function MessageRow({ message }: { message: ContactMessage }) {
  const [pending, startTransition] = useTransition();

  return (
    <Card className={message.readAt ? "opacity-70" : undefined}>
      <CardContent className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{message.name}</p>
            <p className="text-xs text-fg-muted">{message.email}</p>
          </div>
          <div className="flex items-center gap-2">
            {message.recipient && <Badge variant="outline">{message.recipient}</Badge>}
            {!message.readAt && (
              <Button
                size="sm"
                variant="ghost"
                disabled={pending}
                onClick={() => startTransition(() => markMessageRead(message.id))}
              >
                Mark read
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-fg-muted">{message.message}</p>
        <p className="font-mono text-xs text-fg-muted">
          {new Date(message.createdAt).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
