import type { Metadata } from "next";
import { countries as staticCountries } from "@/data/countries";
import { getCountryTopic, azLocative, countryNameByLocale, topicCopy } from "@/data/country-topics";
import { getCountryBySlug } from "@/lib/data/countries";
import { routing, type Locale } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";

/**
 * seo.md 9 (P1): 6 statik topic route-u üçün ortaq generateStaticParams +
 * generateMetadata fabriki. Static segmentlər (`[country]/universitetler/...`)
 * dinamik `[university]` route-u ilə konflikt etmir — Next.js statiki üstün tutur.
 */

export function countryTopicStaticParams() {
  const slugs = staticCountries.map((c) => c.slug);
  return routing.locales.flatMap((locale) => slugs.map((country) => ({ locale, country })));
}

export async function countryTopicMetadata(
  topicSlug: string,
  params: Promise<{ locale: string; country: string }>,
): Promise<Metadata> {
  const { locale: rawLocale, country } = await params;
  const locale = rawLocale as Locale;
  const topic = getCountryTopic(topicSlug);
  const c = await getCountryBySlug(country, locale);
  if (!topic || !c) return { title: locale === "az" ? "Tapılmadı" : "Not found" };

  const year = new Date().getFullYear();
  const name = countryNameByLocale(c, locale);
  const az = azLocative(c.name_az, country);
  const copy = topicCopy(topic, locale, { azLoc: az, azName: c.name_az, enName: c.name_en, slug: c.slug }, year);
  const path = `xaricde-tehsil/${c.slug}/${topic.slug}`;

  return {
    title: copy.title,
    description: copy.metaDescription,
    alternates: {
      canonical: `${siteUrl}/${locale}/${path}`,
      languages: {
        az: `${siteUrl}/az/${path}`,
        ru: `${siteUrl}/ru/${path}`,
        en: `${siteUrl}/en/${path}`,
        "x-default": `${siteUrl}/az/${path}`,
      },
    },
    openGraph: {
      title: copy.title,
      description: copy.metaDescription,
      images: [{ url: c.hero_image_url, width: 1200, height: 630, alt: name }],
      type: "website",
      locale: locale === "az" ? "az_AZ" : locale === "ru" ? "ru_RU" : "en_US",
      siteName: "MegaGroup",
      url: `${siteUrl}/${locale}/${path}`,
    },
    twitter: { card: "summary_large_image", title: copy.title, description: copy.metaDescription },
  };
}
