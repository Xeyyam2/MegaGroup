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

export default function robots(): MetadataRoute.Robots {
  const rules: MetadataRoute.Robots["rules"] = [
    { userAgent: "*", allow: "/" },
    ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/" })),
  ];
  return {
    rules,
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl.replace(/^https?:\/\//, ""),
  };
}
