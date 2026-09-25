"use client";

import { ImagePlus, Loader2, Play, X } from "lucide-react";
import { MediaImage } from "@/components/media-image";
import { useId, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  isVideoUrl,
  normalizeProjectGallery,
  type ProjectGalleryMedia,
} from "@/lib/project-gallery";
import { uploadAdminFile, type ClientUploadCategory } from "@/lib/upload-client";
import { extractVideoThumbnail } from "@/lib/video-thumbnail";

/**
 * Multi-file gallery field for projects — images and videos.
 * Videos get an auto-generated poster frame uploaded alongside them.
 */
export function GalleryUploadField({
  name,
  label,
  category = "projects",
  defaultValue = [],
}: {
  name: string;
  label: string;
  category?: ClientUploadCategory;
  defaultValue?: unknown;
}) {
  const id = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<ProjectGalleryMedia[]>(() =>
    normalizeProjectGallery(defaultValue),
  );
  const [pending, startTransition] = useTransition();

  function onFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    startTransition(async () => {
      const uploaded: ProjectGalleryMedia[] = [];
      let failed = 0;

      for (const file of files) {
        const isVideo = file.type.startsWith("video/") || isVideoUrl(file.name);
        const result = await uploadAdminFile(category, file);
        if (!result.ok) {
          failed += 1;
          continue;
        }

        if (!isVideo) {
          uploaded.push({
            mediaType: "IMAGE",
            imageUrl: result.url,
            videoUrl: null,
          });
          continue;
        }

        let posterUrl: string | null = null;
        const thumb = await extractVideoThumbnail(file);
        if (thumb) {
          const poster = await uploadAdminFile(category, thumb);
          if (poster.ok) posterUrl = poster.url;
        }

        uploaded.push({
          mediaType: "VIDEO",
          imageUrl: posterUrl,
          videoUrl: result.url,
        });
      }

      if (uploaded.length > 0) {
        setItems((prev) => [...prev, ...uploaded]);
      }
      if (failed > 0) {
        toast.error(`${failed} file${failed > 1 ? "s" : ""} failed to upload.`);
      } else if (uploaded.length > 0) {
        toast.success(`${uploaded.length} file${uploaded.length > 1 ? "s" : ""} added.`);
      }

      event.target.value = "";
    });
  }

  function removeAt(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <p className="text-xs text-fg-muted">
        Images (JPEG/PNG/WebP) or videos (MP4/WebM), up to 100 MB. Video posters are
        generated automatically.
      </p>
      <input type="hidden" name={name} value={JSON.stringify(items)} />

      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => {
          const previewUrl = item.imageUrl ?? item.videoUrl;
          const key = `${item.mediaType}-${previewUrl}-${index}`;
          return (
            <div
              key={key}
              className="group relative size-20 overflow-hidden rounded-[var(--radius-sm)] border border-border bg-surface-raised"
            >
              {item.imageUrl ? (
                <>
                  <MediaImage
                    src={item.imageUrl}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized
                  />
                  {item.mediaType === "VIDEO" && (
                    <span className="absolute inset-0 flex items-center justify-center bg-bg/25">
                      <Play className="size-5 fill-current text-accent" />
                    </span>
                  )}
                </>
              ) : item.mediaType === "VIDEO" && item.videoUrl ? (
                <video
                  src={item.videoUrl}
                  muted
                  playsInline
                  preload="metadata"
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-1 bg-bg text-fg-muted">
                  <Play className="size-5 fill-current text-accent" />
                  <span className="text-[9px] font-medium uppercase">Video</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label="Remove media"
                className="ctrl-hover absolute top-0.5 right-0.5 cursor-pointer rounded-full bg-bg/80 p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-bg hover:text-accent"
              >
                <X className="size-3.5 text-fg" />
              </button>
            </div>
          );
        })}

        <button
          type="button"
          id={id}
          onClick={() => fileInputRef.current?.click()}
          disabled={pending}
          className="ctrl-hover flex size-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-[var(--radius-sm)] border border-dashed border-border text-fg-muted hover:border-accent hover:text-accent hover:shadow-[0_4px_14px_var(--glow-soft)] disabled:opacity-50"
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
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          multiple
          className="hidden"
          onChange={onFilesChange}
        />
      </div>
    </div>
  );
}
