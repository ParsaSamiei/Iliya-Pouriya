import { headers } from "next/headers";

/**
 * Best-effort client IP for rate limiting. Caddy (see Caddyfile /
 * docker-compose.yml) sits in front of the app and sets X-Forwarded-For on
 * every proxied request by default — this is what makes per-IP limiting
 * meaningful in production.
 *
 * In local dev (no reverse proxy in front of `next dev`), this header is
 * absent and every request falls back to the same "unknown" bucket, so
 * rate limiting effectively applies globally rather than per-visitor.
 * That's expected and harmless for local dev.
 */
export async function getClientIp(): Promise<string> {
  const headerList = await headers();

  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) {
    // Can be a comma-separated chain (client, proxy1, proxy2, ...) —
    // the original client is always first.
    const [first] = forwardedFor.split(",");
    if (first?.trim()) return first.trim();
  }

  const realIp = headerList.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}
