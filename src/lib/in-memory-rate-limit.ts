// Process-local rate limiter. Works on a single server / local dev.
// On serverless (Vercel) each instance counts separately — weaker than Upstash,
// but better than nothing when no external limiter is configured.
const attempts = new Map<string, { count: number; reset: number }>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfter: number; // seconds until reset
}

export function checkRateLimit(
  key: string,
  max: number = 5,
  windowMs: number = 60_000,
): RateLimitResult {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.reset) {
    attempts.set(key, { count: 1, reset: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  entry.count++;
  if (entry.count > max) {
    return { allowed: false, retryAfter: Math.ceil((entry.reset - now) / 1000) };
  }
  return { allowed: true, retryAfter: 0 };
}

export function cleanupRateLimit(now: number = Date.now()): void {
  for (const [key, entry] of attempts) {
    if (now > entry.reset) attempts.delete(key);
  }
}
