"use client";

import { X } from "lucide-react";
import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Person, Skill } from "@/generated/prisma/client";
import { createSkill, deleteSkill } from "@/lib/actions/skills";

const CATEGORIES = ["hardware", "software", "other"] as const;

export function SkillList({ person, skills }: { person: Person; skills: Skill[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  function onCreate(formData: FormData) {
    startTransition(async () => {
      const result = await createSkill(formData);
      if (result.ok) {
        toast.success("Skill added.");
        formRef.current?.reset();
      } else {
        toast.error(result.error);
      }
    });
  }

  function onDelete(id: string) {
    startTransition(async () => {
      const result = await deleteSkill(id);
      if (result.ok) toast.success("Removed.");
      else toast.error(result.error);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{person.nameEn}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {CATEGORIES.map((category) => {
          const items = skills.filter((s) => s.category === category);
          if (items.length === 0) return null;
          return (
            <div key={category}>
              <p className="font-mono text-xs tracking-widest text-fg-muted uppercase">
                {category}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {items.map((skill) => (
                  <Badge key={skill.id} variant="secondary" className="gap-1 pr-1">
                    {skill.name}
                    <button
                      type="button"
                      onClick={() => onDelete(skill.id)}
                      disabled={pending}
                      aria-label={`Remove ${skill.name}`}
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          );
        })}
        {skills.length === 0 && <p className="text-sm text-fg-muted">No skills yet.</p>}

        <form
          ref={formRef}
          action={onCreate}
          className="flex items-end gap-3 border-t border-border pt-4"
        >
          <input type="hidden" name="personId" value={person.id} />
          <div className="flex-1 space-y-1.5">
            <Label>Skill name</Label>
            <Input name="name" required placeholder="ROS2" />
          </div>
          <div className="w-40 space-y-1.5">
            <Label>Category</Label>
            <Select name="category" defaultValue="hardware">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Adding…" : "Add"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
