import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { getCountries } from "@/lib/data/countries";
import { getAllUniversitySlugs } from "@/lib/data/universities";
import { ARTICLES } from "@/data/articles";
import { siteUrl } from "@/lib/site";

const baseUrl = siteUrl;

// Sitemap-də real lastModified istifadə olunur — `new Date()` deyil.
// Statik səhifələrin son yenilənmə tarixi (2026-07 sonunda ana səhifə,
// ölkə və universitet profilləri böyük məzmun yeniləməsindən keçib).
const STATIC_LASTMOD = new Date("2026-08-01");

// Hər LOKAL ayrıca <loc> bloku kimi daxil olunur (yalnız az deyil).
// Google hreflang cluster-inə daxil olan URL-lərin hər birini sitemap-də
// tapmağı üstün tutur — RU/EN səhifələri yalnız alternates-də olsaydı,
// onların aşkarlanması yalnız annotation-a qalırdı. Hər blok bütün
// lokal variantlarını (özü də daxil) xhtml:link kimi daşıyır.
function pushAllLocales(
  entries: MetadataRoute.Sitemap,
  path: string,
  opts: { lastModified: Date; changeFrequency: "daily" | "weekly" | "monthly"; priority: number },
) {
  for (const l of locales) {
    entries.push({
      url: `${baseUrl}/${l}${path}`,
      lastModified: opts.lastModified,
      changeFrequency: opts.changeFrequency,
      priority: opts.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((x) => [x, `${baseUrl}/${x}${path}`]),
        ),
      },
    });
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const countries = await getCountries("az");
  const universities = await getAllUniversitySlugs();
  const staticPaths = ["", "/xaricde-tehsil", "/haqqimizda", "/xaricde-tehsil/hesabla", "/xaricde-tehsil/muraciet"];
  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    pushAllLocales(entries, path, {
      lastModified: STATIC_LASTMOD,
      changeFrequency: path === "" ? "daily" : "weekly",
      priority: path === "" ? 1.0 : 0.8,
    });
  }
  for (const c of countries) {
    pushAllLocales(entries, `/xaricde-tehsil/${c.slug}`, {
      lastModified: STATIC_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }
  for (const u of universities) {
    pushAllLocales(entries, `/xaricde-tehsil/${u.country_slug}/${u.slug}`, {
      lastModified: STATIC_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Bloq indeksi — hər lokaldə (AZ/RU/EN).
  pushAllLocales(entries, "/bloq", {
    lastModified: STATIC_LASTMOD,
    changeFrequency: "weekly",
    priority: 0.9,
  });

  // Cornerstone SEO articles (blog) — hər lokaldə ayrıca <loc>, real
  // yenilənmə tarixi ilə. RU/EN tərcümələri mövcuddur.
  for (const a of ARTICLES) {
    pushAllLocales(entries, `/bloq/${a.slug}`, {
      lastModified: new Date(a.updatedAt),
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  return entries;
}
