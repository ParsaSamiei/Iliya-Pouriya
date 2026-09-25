"use client";

import { Upload } from "lucide-react";
import { MediaImage } from "@/components/media-image";
import { useId, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type ClientUploadCategory,
  uploadAdminFile,
} from "@/lib/upload-client";
import { extractVideoThumbnail } from "@/lib/video-thumbnail";

/**
 * Video upload that auto-captures a poster frame and lets the admin replace it.
 */
export function VideoUploadField({
  videoName,
  posterName,
  label,
  category,
  defaultVideoUrl = "",
  defaultPosterUrl = "",
}: {
  videoName: string;
  posterName: string;
  label: string;
  category: ClientUploadCategory;
  defaultVideoUrl?: string;
  defaultPosterUrl?: string;
}) {
  const videoId = useId();
  const posterId = useId();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const [videoUrl, setVideoUrl] = useState(defaultVideoUrl);
  const [posterUrl, setPosterUrl] = useState(defaultPosterUrl);
  const [pending, startTransition] = useTransition();

  function onVideoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    startTransition(async () => {
      const videoResult = await uploadAdminFile(category, file);
      if (!videoResult.ok) {
        toast.error(videoResult.error);
        event.target.value = "";
        return;
      }

      setVideoUrl(videoResult.url);

      const thumb = await extractVideoThumbnail(file);
      if (thumb) {
        const posterResult = await uploadAdminFile(category, thumb);
        if (posterResult.ok) {
          setPosterUrl(posterResult.url);
          toast.success("Video and thumbnail uploaded.");
        } else {
          toast.success("Video uploaded (thumbnail could not be generated).");
        }
      } else {
        toast.success("Video uploaded (thumbnail could not be generated).");
      }

      event.target.value = "";
    });
  }

  function onPosterChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    startTransition(async () => {
      const result = await uploadAdminFile(category, file);
      if (result.ok) {
        setPosterUrl(result.url);
        toast.success("Poster updated.");
      } else {
        toast.error(result.error);
      }
      event.target.value = "";
    });
  }

  return (
    <div className="space-y-4 sm:col-span-2">
      <div className="space-y-1.5">
        <Label htmlFor={videoId}>{label}</Label>
        <p className="text-xs text-fg-muted">
          MP4 or WebM. A poster frame is captured automatically from the video.
        </p>
        <div className="flex gap-2">
          <Input
            id={videoId}
            name={videoName}
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="/uploads/… video"
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm"
            className="hidden"
            onChange={onVideoChange}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() => videoInputRef.current?.click()}
          >
            <Upload className="size-4" />
            {pending ? "Uploading…" : "Upload"}
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={posterId}>Poster / thumbnail</Label>
        <div className="flex gap-2">
          <Input
            id={posterId}
            name={posterName}
            value={posterUrl}
            onChange={(e) => setPosterUrl(e.target.value)}
            placeholder="/uploads/… poster image"
          />
          <input
            ref={posterInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onPosterChange}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() => posterInputRef.current?.click()}
          >
            <Upload className="size-4" />
            Replace
          </Button>
        </div>
        {posterUrl && (
          <div className="relative h-24 w-40 overflow-hidden rounded-[var(--radius-sm)] border border-border">
            <MediaImage
              src={posterUrl}
              alt=""
              fill
              sizes="160px"
              className="object-cover"
              unoptimized
            />
          </div>
        )}
      </div>
    </div>
  );
}
