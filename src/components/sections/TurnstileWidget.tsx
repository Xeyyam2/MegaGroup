"use client";
import Script from "next/script";

// Cloudflare Turnstile widget. NEXT_PUBLIC_TURNSTILE_SITE_KEY yoxdursa heç nə render etmir.
// Aktiv olanda gizli "cf-turnstile-response" input-u form-a əlavə olur.
export function TurnstileWidget() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        strategy="afterInteractive"
      />
      <div className="cf-turnstile" data-sitekey={siteKey} data-theme="dark" />
    </>
  );
}
