"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Person } from "@/generated/prisma/client";
import { updatePerson } from "@/lib/actions/people";

export function PersonEditForm({ person }: { person: Person }) {
  const [tab, setTab] = useState<"en" | "fa">("en");
  const [pending, startTransition] = useTransition();
  const social =
    (person.socialLinks as { github?: string; linkedin?: string; email?: string } | null) ?? {};

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await updatePerson(person.id, formData);
      if (result.ok) {
        toast.success(`${person.nameEn} saved.`);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{person.nameEn}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor={`nameEn-${person.id}`}>Name (English)</Label>
              <Input id={`nameEn-${person.id}`} name="nameEn" defaultValue={person.nameEn} />
            </div>
            <div className="space-y-1.5" dir="rtl">
              <Label htmlFor={`nameFa-${person.id}`}>Name (Persian)</Label>
              <Input id={`nameFa-${person.id}`} name="nameFa" defaultValue={person.nameFa} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`title-${person.id}`}>Title</Label>
            <Input id={`title-${person.id}`} name="title" defaultValue={person.title} />
          </div>

          <input type="hidden" name="slug" defaultValue={person.slug} />

          <ImageUploadField
            name="photoUrl"
            label="Photo"
            category="profiles"
            defaultValue={person.photoUrl ?? ""}
          />

          <Tabs value={tab} onValueChange={(v) => setTab(v as "en" | "fa")}>
            <TabsList>
              <TabsTrigger value="en">EN</TabsTrigger>
              <TabsTrigger value="fa">FA</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-1.5" hidden={tab !== "en"}>
            <Label htmlFor={`bioEn-${person.id}`}>Bio (English)</Label>
            <Textarea
              id={`bioEn-${person.id}`}
              name="bioEn"
              defaultValue={person.bioEn ?? ""}
              rows={4}
            />
          </div>
          <div className="space-y-1.5" dir="rtl" hidden={tab !== "fa"}>
            <Label htmlFor={`bioFa-${person.id}`}>Bio (Persian)</Label>
            <Textarea
              id={`bioFa-${person.id}`}
              name="bioFa"
              defaultValue={person.bioFa ?? ""}
              rows={4}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor={`github-${person.id}`}>GitHub URL</Label>
              <Input id={`github-${person.id}`} name="github" defaultValue={social.github ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`linkedin-${person.id}`}>LinkedIn URL</Label>
              <Input
                id={`linkedin-${person.id}`}
                name="linkedin"
                defaultValue={social.linkedin ?? ""}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`socialEmail-${person.id}`}>Public email</Label>
              <Input
                id={`socialEmail-${person.id}`}
                name="socialEmail"
                defaultValue={social.email ?? ""}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ImageUploadField
              name="resumeUrlEn"
              label="Resume (English, PDF)"
              category="resumes"
              accept="application/pdf"
              showPreview={false}
              defaultValue={person.resumeUrlEn ?? ""}
            />
            <ImageUploadField
              name="resumeUrlFa"
              label="Resume (Persian, PDF)"
              category="resumes"
              accept="application/pdf"
              showPreview={false}
              defaultValue={person.resumeUrlFa ?? ""}
            />
          </div>

          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
