"use client";

import { Upload } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadFile } from "@/lib/actions/uploads";

type UploadCategory = "projects" | "blog" | "profiles" | "resumes";

export function ImageUploadField({
  name,
  label,
  category,
  defaultValue = "",
  accept = "image/*",
  showPreview = true,
}: {
  name: string;
  label: string;
  category: UploadCategory;
  defaultValue?: string;
  accept?: string;
  showPreview?: boolean;
}) {
  const id = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [pending, startTransition] = useTransition();

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadFile(category, formData);
      if (result.ok) {
        setValue(result.url);
        toast.success("Uploaded.");
      } else {
        toast.error(result.error);
      }
      // Allow re-selecting the same filename later.
      event.target.value = "";
    });
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <Input
          id={id}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="/uploads/… (or paste a URL)"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onFileChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pending}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="size-4" />
          {pending ? "Uploading…" : "Upload"}
        </Button>
      </div>
      {showPreview && value && accept.startsWith("image") && (
        <div className="relative h-20 w-32 overflow-hidden rounded-[var(--radius-sm)] border border-border">
          {/* unoptimized: avoids requiring the `sharp` package for Next's
              image optimizer in the self-hosted standalone build — this is
              just an admin-panel preview thumbnail, not public-facing. */}
          <Image src={value} alt="" fill className="object-cover" unoptimized />
        </div>
      )}
    </div>
  );
}
