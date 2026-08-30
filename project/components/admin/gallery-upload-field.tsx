"use client";

import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useId, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { uploadFile } from "@/lib/actions/uploads";

/**
 * Multiple-image companion to ImageUploadField (single URL + preview) — this
 * one manages an array, submitted as a JSON-encoded hidden field and parsed
 * server-side by lib/actions/projects.ts::parseGalleryField.
 */
export function GalleryUploadField({
  name,
  label,
  defaultValue = [],
}: {
  name: string;
  label: string;
  defaultValue?: string[];
}) {
  const id = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [pending, startTransition] = useTransition();

  function onFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    startTransition(async () => {
      const results = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.set("file", file);
          return uploadFile("projects", formData);
        }),
      );

      const uploaded = results.filter((r): r is { ok: true; url: string } => r.ok);
      const failed = results.length - uploaded.length;

      if (uploaded.length > 0) {
        setUrls((prev) => [...prev, ...uploaded.map((r) => r.url)]);
      }
      if (failed > 0) {
        toast.error(`${failed} image${failed > 1 ? "s" : ""} failed to upload.`);
      } else if (uploaded.length > 0) {
        toast.success(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} added.`);
      }

      event.target.value = "";
    });
  }

  function removeAt(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <input type="hidden" name={name} value={JSON.stringify(urls)} />

      <div className="flex flex-wrap gap-2">
        {urls.map((url, index) => (
          <div
            key={url}
            className="group relative size-20 overflow-hidden rounded-[var(--radius-sm)] border border-border"
          >
            <Image src={url} alt="" fill className="object-cover" unoptimized />
            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label="Remove image"
              className="absolute top-0.5 right-0.5 rounded-full bg-bg/80 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="size-3.5 text-fg" />
            </button>
          </div>
        ))}

        <button
          type="button"
          id={id}
          onClick={() => fileInputRef.current?.click()}
          disabled={pending}
          className="flex size-20 flex-col items-center justify-center gap-1 rounded-[var(--radius-sm)] border border-dashed border-border text-fg-muted hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {pending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              <ImagePlus className="size-5" />
              <span className="text-[10px]">Add</span>
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onFilesChange}
        />
      </div>
    </div>
  );
}
