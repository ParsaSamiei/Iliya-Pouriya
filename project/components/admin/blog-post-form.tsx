"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { BlogPost, Person } from "@/generated/prisma/client";
import { createBlogPost, updateBlogPost } from "@/lib/actions/blog";

export function BlogPostForm({
  post,
  people,
}: {
  post?: BlogPost & { authors?: { personId: string }[] };
  people: Person[];
}) {
  const [tab, setTab] = useState<"en" | "fa">("en");
  const [pending, startTransition] = useTransition();
  const currentAuthorIds = new Set(post?.authors?.map((a) => a.personId) ?? []);

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = post
        ? await updateBlogPost(post.id, formData)
        : await createBlogPost(formData);
      if (result && !result.ok) {
        toast.error(result.error);
      } else if (post) {
        toast.success("Post saved.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post ? `Edit: ${post.titleEn}` : "New post"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" defaultValue={post?.slug} required />
            </div>
            <ImageUploadField
              name="coverImageUrl"
              label="Cover image"
              category="blog"
              defaultValue={post?.coverImageUrl ?? ""}
            />
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as "en" | "fa")}>
            <TabsList>
              <TabsTrigger value="en">EN</TabsTrigger>
              <TabsTrigger value="fa">FA</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4" hidden={tab !== "en"}>
            <div className="space-y-1.5">
              <Label htmlFor="titleEn">Title (English)</Label>
              <Input
                id="titleEn"
                name="titleEn"
                defaultValue={post?.titleEn}
                required={tab === "en"}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="excerptEn">Excerpt (English)</Label>
              <Textarea
                id="excerptEn"
                name="excerptEn"
                defaultValue={post?.excerptEn ?? ""}
                rows={2}
              />
            </div>
            <MarkdownEditor
              name="contentEn"
              label="Content (English)"
              defaultValue={post?.contentEn ?? ""}
            />
          </div>

          <div className="space-y-4" dir="rtl" hidden={tab !== "fa"}>
            <div className="space-y-1.5">
              <Label htmlFor="titleFa">عنوان (فارسی)</Label>
              <Input
                id="titleFa"
                name="titleFa"
                defaultValue={post?.titleFa}
                required={tab === "fa"}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="excerptFa">چکیده (فارسی)</Label>
              <Textarea
                id="excerptFa"
                name="excerptFa"
                defaultValue={post?.excerptFa ?? ""}
                rows={2}
              />
            </div>
            <MarkdownEditor
              name="contentFa"
              label="محتوا (فارسی)"
              defaultValue={post?.contentFa ?? ""}
              dir="rtl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              name="tags"
              defaultValue={((post?.tags as string[] | null) ?? []).join(", ")}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Authors</Label>
            <div className="flex gap-4">
              {people.map((person) => (
                <label key={person.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="authorIds"
                    value={person.id}
                    defaultChecked={currentAuthorIds.has(person.id)}
                  />
                  {person.nameEn}
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={!!post?.publishedAt} />
            Published
          </label>

          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
