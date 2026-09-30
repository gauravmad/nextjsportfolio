/**
 * Fixed-window, in-memory rate limiter.
 *
 * Limitation: state lives in one server instance. On serverless hosting each
 * instance counts separately and a cold start resets the count, so this blunts
 * casual spam but is not a hard guarantee. For that, swap the Map for a shared
 * store (e.g. Upstash Redis) behind the same `rateLimit()` signature.
 */
import "server-only";

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();
const MAX_TRACKED_KEYS = 10_000;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  let window = windows.get(key);

  if (!window || window.resetAt <= now) {
    if (windows.size >= MAX_TRACKED_KEYS) evictExpired(now);
    window = { count: 0, resetAt: now + windowMs };
    windows.set(key, window);
  }

  window.count += 1;

  return {
    allowed: window.count <= limit,
    remaining: Math.max(0, limit - window.count),
    retryAfterSeconds: Math.ceil((window.resetAt - now) / 1000),
  };
}

function evictExpired(now: number) {
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
  // Still full of live keys: drop the oldest rather than grow without bound.
  if (windows.size >= MAX_TRACKED_KEYS) {
    const oldest = windows.keys().next().value;
    if (oldest !== undefined) windows.delete(oldest);
  }
}
