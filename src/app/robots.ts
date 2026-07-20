import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// AI crawler və generativ model botlarına açıq siqnal.
// `*` artıq hamısına icazə versə də, açıq `allow` qaydaları GEO siqnalı kimi
// işləyir — bəzi botlar (xüsusilə OAI/Anthropic) spesifik user-agent qaydası
// axtarır. Boş siyahı = bloklamaq demək olduğundan hamısı üçün allow yazırıq.
const AI_BOTS = [
  "GPTBot", // OpenAI / ChatGPT
  "OAI-SearchBot", // ChatGPT veb axtarış
  "ChatGPT-User",
  "ClaudeBot", // Anthropic / Claude
  "anthropic-ai",
  "Claude-Web",
  "PerplexityBot", // Perplexity
  "Perplexity-User",
  "Google-Extended", // Google Gemini / AI Overviews təlim data sindi
  "Googlebot",
  "Bingbot", // Microsoft Copilot
  "CCBot", // Common Crawl (açık təlim datası)
  "Bytespider", // ByteDance
  "Applebot",
  "Amazonbot",
  "cohere-ai",
];

// İndekslənməməli olan yollar — SEO baxımından "zibil" URL-lardır:
// - WordPress qalıqları (sayt WP-dən miqrasiya edilib)
// - Admin panel və API (internal istifadə)
// - Next.js avtomatik twəkil etdiyi sistem faylları (opengraph-image, favicon variantları)
// - Axtarış/süzgəc query parametrləri (faceted nav dupe content)
const DISALLOWED_PATHS = [
  "/admin",
  "/admin/",
  "/api",
  "/api/",
  // WordPress qalıqları (həmçinin middleware-də 410 Gone qaytarır)
  "/wp-content/",
  "/wp-admin/",
  "/wp-includes/",
  "/wp-json/",
  "/wp-login.php",
  "/cgi-sys/",
  "/xmlrpc.php",
  // Next.js metadata faylları — hər səhifə üçün avtomatik generasiya olunur,
  // indekslənməsi websayt üçün dəyər yaratmır, "crawled but not indexed" siqnalı yaradır.
  "/opengraph-image",
  "/twitter-image",
  "/apple-icon",
  "/manifest.webmanifest",
  // SW və system faylları
  "/sw.js",
  "/workbox-",
];

export default function robots(): MetadataRoute.Robots {
  const rules: MetadataRoute.Robots["rules"] = [
    {
      userAgent: "*",
      allow: "/",
      disallow: DISALLOWED_PATHS,
    },
    // AI botlar üçün də eyni qaydalar (allow + disallow)
    ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: DISALLOWED_PATHS })),
  ];
  return {
    rules,
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl.replace(/^https?:\/\//, ""),
  };
}
