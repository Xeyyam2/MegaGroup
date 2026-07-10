"use server";
import { checkRateLimit } from "@/lib/in-memory-rate-limit";
import { getClientIp } from "@/lib/rate-limit";

// Login brute-force qoruması: 5 cəhd / dəqiqə / IP.
export async function checkLoginRateLimit(): Promise<{ allowed: boolean; retryAfter: number }> {
  const ip = await getClientIp();
  return checkRateLimit(`login:${ip}`, 5, 60_000);
}
