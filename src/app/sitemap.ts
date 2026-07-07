import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { getCountries } from "@/lib/data/countries";
import { getAllUniversitySlugs } from "@/lib/data/universities";
import { ARTICLES } from "@/data/articles";
import { siteUrl } from "@/lib/site";

const baseUrl = siteUrl;

// Sitemap-də real lastModified istifadə olunur — `new Date()` deyil.
// Statik səhifələrin son yenilənmə tarixi.
const STATIC_LASTMOD = new Date("2026-07-01");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const countries = await getCountries("az");
  const universities = await getAllUniversitySlugs();
  const staticPaths = ["", "/xaricde-tehsil", "/haqqimizda", "/xaricde-tehsil/hesabla", "/xaricde-tehsil/muraciet"];
  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    entries.push({
      url: `${baseUrl}/az${path}`,
      lastModified: STATIC_LASTMOD,
      changeFrequency: path === "" ? "daily" : "weekly",
      priority: path === "" ? 1.0 : 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}${path}`])),
      },
    });
  }
  for (const c of countries) {
    const path = `/xaricde-tehsil/${c.slug}`;
    entries.push({
      url: `${baseUrl}/az${path}`,
      lastModified: STATIC_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}${path}`])),
      },
    });
  }
  for (const u of universities) {
    const path = `/xaricde-tehsil/${u.country_slug}/${u.slug}`;
    entries.push({
      url: `${baseUrl}/az${path}`,
      lastModified: STATIC_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}${path}`])),
      },
    });
  }

  // Cornerstone SEO articles (blog) — az-only, high priority since these
  // directly target the primary keywords the business wants to rank for.
  entries.push({
    url: `${baseUrl}/az/bloq`,
    lastModified: STATIC_LASTMOD,
    changeFrequency: "weekly",
    priority: 0.9,
  });
  for (const a of ARTICLES) {
    entries.push({
      url: `${baseUrl}/az/bloq/${a.slug}`,
      // Hər məqalənin real yenilənmə tarixi — crawl ə_priority üçün vacib.
      lastModified: new Date(a.updatedAt),
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  return entries;
}
