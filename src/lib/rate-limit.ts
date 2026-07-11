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
// Vercel-də x-vercel-forwarded-for etibarlıdır; digər deploy-larda x-forwarded-for
// istifade olunur və Trusted proxy hop sayına göre doğru IP seçilir.
export async function getClientIp(): Promise<string> {
  const h = await headers();

  // Vercel-specific trusted header (always correct on Vercel)
  const vercelFwd = h.get("x-vercel-forwarded-for");
  if (vercelFwd) {
    return vercelFwd.split(",")[0].trim() || "unknown";
  }

  // Standard X-Forwarded-For: comma-separated client IPs, leftmost = original client.
  // With trusted proxies, the real client is at index -(trustedHops).
  // Default: 1 hop (single proxy). Set TRUSTED_PROXY_HOPS=2 for double-proxy setups.
  const fwd = h.get("x-forwarded-for");
  if (fwd) {
    const hops = fwd.split(",").map((ip) => ip.trim());
    const trustedHops = Number(process.env.TRUSTED_PROXY_HOPS ?? 1);
    const idx = Math.max(0, hops.length - trustedHops);
    return hops[idx] || "unknown";
  }

  // Fallback: x-real-ip (set by some proxies / Nginx)
  return h.get("x-real-ip") || "unknown";
}

// true = limit aşılıb (blokla), false = icazə ver (konfiqurasiya olunmayıbsa da icazə verir).
export async function isRateLimited(prefix = "mg:apply"): Promise<boolean> {
  const l = getLimiter();
  if (!l) return false;
  const ip = await getClientIp();
  const { success } = await l.limit(`${prefix}:${ip}`);
  return !success;
}
