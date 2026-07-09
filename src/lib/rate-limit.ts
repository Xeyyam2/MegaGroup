import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

// Upstash konfiqurasiya olunmayıbsa limiter yaranmır — o zaman rate-limit
// deaktivdir və honeypot + RLS qoruma kifayət edir. Env əlavə olunanda avtomatik aktivləşir.
//   UPSTASH_REDIS_REST_URL=...
//   UPSTASH_REDIS_REST_TOKEN=...
let limiter: Ratelimit | null | undefined;

function getLimiter(): Ratelimit | null {
  if (limiter !== undefined) return limiter;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    limiter = null;
    return null;
  }
  limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(10, "1 h"), // 10 müraciət / saat / IP
    prefix: "mg:apply",
    analytics: true,
  });
  return limiter;
}

// Server action içində klient IP-sini oxuyur (Vercel/standart proxy header-ləri).
export async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

// true = limit aşılıb (blokla), false = icazə ver (konfiqurasiya olunmayıbsa da icazə verir).
export async function isRateLimited(prefix = "mg:apply"): Promise<boolean> {
  const l = getLimiter();
  if (!l) return false;
  const ip = await getClientIp();
  const { success } = await l.limit(`${prefix}:${ip}`);
  return !success;
}
