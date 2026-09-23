"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteBlogPost } from "@/lib/actions/blog";

export function DeleteBlogPostButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();

  function onDelete() {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    startTransition(async () => {
      const result = await deleteBlogPost(id);
      if (result.ok) toast.success("Post deleted.");
      else toast.error(result.error);
    });
  }

  return (
    <Button size="sm" variant="ghost" onClick={onDelete} disabled={pending}>
      <Trash2 className="size-4 text-error" />
    </Button>
  );
}
