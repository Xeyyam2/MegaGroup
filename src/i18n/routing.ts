import { defineRouting } from "next-intl/routing";

export const locales = ["az", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "az";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Hər URL-də lokali prefiks olsun (/az, /ru, /en).
  // Tek URL = tek kanonikal → kopya səhifə/canonical mismatch xətalarını aradan qaldırır.
  localePrefix: "always",
  // SEO üçün kritik: Accept-Language başlığına görə avtomatik yönləndirmə QAPATILIR.
  // Səbəb: Googlebot-un Accept-Language başlığı "en" olduğundan / → /en/ yönlənir,
  // amma kanonikal /az/ (x-default) idi → "kanonik variant seçilməyib" xətası yaranır.
  // URL tək başına lokali müəyyən edir — bu, x-default = /az/ qəti olaraq işləyir.
  localeDetection: false,
});
