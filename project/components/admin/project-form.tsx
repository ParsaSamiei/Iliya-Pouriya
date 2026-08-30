"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { GalleryUploadField } from "@/components/admin/gallery-upload-field";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Person, Project } from "@/generated/prisma/client";
import { createProject, updateProject } from "@/lib/actions/projects";

type ExternalLinks = { github?: string; demo?: string; publication?: string } | null;

export function ProjectForm({
  project,
  people,
}: {
  project?: Project & { contributors?: { personId: string }[] };
  people: Person[];
}) {
  const [tab, setTab] = useState<"en" | "fa">("en");
  const [pending, startTransition] = useTransition();
  const links = (project?.externalLinks as ExternalLinks) ?? {};
  const currentContributorIds = new Set(project?.contributors?.map((c) => c.personId) ?? []);

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = project
        ? await updateProject(project.id, formData)
        : await createProject(formData);
      // createProject redirects on success, so only failures return here.
      if (result && !result.ok) {
        toast.error(result.error);
      } else if (project) {
        toast.success("Project saved.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project ? `Edit: ${project.titleEn}` : "New project"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={project?.slug}
                placeholder="gripper-arm-v2"
                required
              />
            </div>
            <ImageUploadField
              name="coverImageUrl"
              label="Cover image"
              category="projects"
              defaultValue={project?.coverImageUrl ?? ""}
            />
          </div>

          <GalleryUploadField
            name="gallery"
            label="Gallery"
            defaultValue={Array.isArray(project?.gallery) ? (project.gallery as string[]) : []}
          />

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
                defaultValue={project?.titleEn}
                required={tab === "en"}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="summaryEn">Summary (English)</Label>
              <Textarea
                id="summaryEn"
                name="summaryEn"
                defaultValue={project?.summaryEn ?? ""}
                rows={2}
              />
            </div>
            <MarkdownEditor
              name="contentEn"
              label="Content (English)"
              defaultValue={project?.contentEn ?? ""}
            />
          </div>

          <div className="space-y-4" dir="rtl" hidden={tab !== "fa"}>
            <div className="space-y-1.5">
              <Label htmlFor="titleFa">عنوان (فارسی)</Label>
              <Input
                id="titleFa"
                name="titleFa"
                defaultValue={project?.titleFa}
                required={tab === "fa"}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="summaryFa">خلاصه (فارسی)</Label>
              <Textarea
                id="summaryFa"
                name="summaryFa"
                defaultValue={project?.summaryFa ?? ""}
                rows={2}
              />
            </div>
            <MarkdownEditor
              name="contentFa"
              label="محتوا (فارسی)"
              defaultValue={project?.contentFa ?? ""}
              dir="rtl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              name="tags"
              defaultValue={((project?.tags as string[] | null) ?? []).join(", ")}
              placeholder="ROS2, PCB design, 3D printing"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="linkGithub">GitHub link</Label>
              <Input id="linkGithub" name="linkGithub" defaultValue={links.github ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="linkDemo">Demo link</Label>
              <Input id="linkDemo" name="linkDemo" defaultValue={links.demo ?? ""} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="linkPublication">Publication link</Label>
              <Input
                id="linkPublication"
                name="linkPublication"
                defaultValue={links.publication ?? ""}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Contributors</Label>
            <div className="flex gap-4">
              {people.map((person) => (
                <label key={person.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="contributorIds"
                    value={person.id}
                    defaultChecked={currentContributorIds.has(person.id)}
                  />
                  {person.nameEn}
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isFeatured" defaultChecked={project?.isFeatured} />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked={!!project?.publishedAt} />
              Published
            </label>
          </div>

          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save project"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
