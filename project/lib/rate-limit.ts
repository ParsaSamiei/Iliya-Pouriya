import "server-only";

type Bucket = { count: number; resetAt: number };

/**
 * In-memory, per-process rate limiter — correct for this app's deployment
 * as-is (docker-compose.yml runs exactly one `app` container). If you ever
 * horizontally scale the app service behind a load balancer, separate
 * processes won't share these counts and this stops being an effective
 * limit — swap it for a shared store (Redis + a library like
 * @upstash/ratelimit) at that point.
 */
const buckets = new Map<string, Bucket>();

// Periodic sweep so the Map doesn't grow forever on a long-running server.
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function ensureCleanupTimer() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }, CLEANUP_INTERVAL_MS);
  cleanupTimer.unref?.();
}

export type RateLimitResult =
  | { allowed: true; remaining: number }
  | { allowed: false; retryAfterSeconds: number };

/**
 * Fixed-window rate limit check. `key` should already be scoped (e.g.
 * `"contact:203.0.113.4"`) — this function doesn't namespace by itself, so
 * two call sites sharing a raw IP as the key would share a bucket.
 */
export function rateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number },
): RateLimitResult {
  ensureCleanupTimer();
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1 };
  }

  if (bucket.count >= max) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true, remaining: max - bucket.count };
}

/** Clear a key's counter early — e.g. on a successful login, so a genuine
 * owner who mistyped their password a couple of times isn't left partway
 * through the window next time. */
export function resetRateLimit(key: string) {
  buckets.delete(key);
}

export function formatRetryAfter(seconds: number): string {
  const minutes = Math.ceil(seconds / 60);
  return minutes <= 1 ? "a minute" : `${minutes} minutes`;
}
