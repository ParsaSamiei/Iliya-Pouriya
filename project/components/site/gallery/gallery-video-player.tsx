"use client";

import {
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface GalleryVideoPlayerProps {
  src: string;
  poster?: string | null;
  title: string;
  active: boolean;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function GalleryVideoPlayer({ src, poster, title, active }: GalleryVideoPlayerProps) {
  const t = useTranslations("gallery.player");
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const pauseAndReset = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    setPlaying(false);
    setStarted(false);
    setCurrent(0);
  }, []);

  useEffect(() => {
    if (!active) pauseAndReset();
  }, [active, pauseAndReset]);

  useEffect(() => {
    function onFsChange() {
      setFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  async function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      await video.play();
      setPlaying(true);
      setStarted(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  async function toggleFullscreen() {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await el.requestFullscreen();
    }
  }

  return (
    <div
      ref={containerRef}
      className="group/player relative flex h-full w-full items-center justify-center bg-bg"
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption -- gallery uploads have no subtitle tracks yet */}
      <video
        ref={videoRef}
        src={src}
        poster={poster ?? undefined}
        playsInline
        preload="metadata"
        className="h-full w-full object-contain"
        onClick={togglePlay}
        onTimeUpdate={() => setCurrent(videoRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
        onPlay={() => {
          setPlaying(true);
          setStarted(true);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />

      {!started && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label={t("play")}
          className="absolute top-1/2 left-1/2 z-10 flex size-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-accent text-accent-fg shadow-[0_0_32px_var(--glow-accent)] transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <Play className="size-6 fill-current" />
        </button>
      )}

      <div
        dir="ltr"
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 bg-gradient-to-t from-bg/90 via-bg/50 to-transparent px-3 pt-10 pb-3 transition-opacity",
          started ? "opacity-0 group-hover/player:opacity-100 focus-within:opacity-100" : "opacity-0",
        )}
      >
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={current}
          aria-label={t("seek")}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (videoRef.current) videoRef.current.currentTime = next;
            setCurrent(next);
          }}
          className="h-1 w-full cursor-pointer accent-[var(--accent)]"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? t("pause") : t("play")}
            className="cursor-pointer rounded-[var(--radius-sm)] p-1.5 text-fg hover:bg-surface-raised focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? t("unmute") : t("mute")}
            className="cursor-pointer rounded-[var(--radius-sm)] p-1.5 text-fg hover:bg-surface-raised focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          <span className="ml-1 font-mono text-xs text-fg-muted tabular-nums">
            {formatTime(current)} / {formatTime(duration)}
          </span>
          <span className="sr-only">{title}</span>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={fullscreen ? t("exitFullscreen") : t("fullscreen")}
            className="ml-auto cursor-pointer rounded-[var(--radius-sm)] p-1.5 text-fg hover:bg-surface-raised focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            {fullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
