import { getClientIp } from "@/lib/rate-limit";

// Cloudflare Turnstile konfiqurasiya olunmayıbsa doğrulama deaktivdir —
// honeypot + rate-limit qoruma kifayət edir. Env əlavə olunanda avtomatik aktivləşir.
//   NEXT_PUBLIC_TURNSTILE_SITE_KEY=...  (client widget)
//   TURNSTILE_SECRET_KEY=...             (server-side verify)

export function isTurnstileEnabled(): boolean {
  return !!process.env.TURNSTILE_SECRET_KEY;
}

// Token-i Cloudflare siteverify endpointində yoxlayır.
// Konfiqurasiya olunmayıbsa true qaytarır (deaktiv → icazə ver).
export async function verifyTurnstile(token: string | null | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const ip = await getClientIp();
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
        ...(ip && ip !== "unknown" ? { remoteip: ip } : {}),
      }),
    });
    const data = (await res.json()) as { success?: boolean };
    return !!data.success;
  } catch (err) {
    console.error("[verifyTurnstile]", err);
    return false;
  }
}
