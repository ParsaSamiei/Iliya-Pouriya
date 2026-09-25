import Image, { type ImageProps } from "next/image";

function skipOptimizer(src: ImageProps["src"]): boolean {
  return typeof src === "string" && (src.startsWith("/uploads/") || /^https?:\/\//i.test(src));
}

/**
 * Drop-in `next/image` that skips `/_next/image` for uploaded files.
 * Those live on disk (and on the VPS volume), not under `public/` in
 * production — the optimizer 400s them. Static assets like `/logo.png`
 * still go through the default optimizer.
 */
export function MediaImage({ src, unoptimized, ...props }: ImageProps) {
  return <Image src={src} unoptimized={unoptimized || skipOptimizer(src)} {...props} />;
}
