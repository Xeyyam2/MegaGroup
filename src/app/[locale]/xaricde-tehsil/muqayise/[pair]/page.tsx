import type { Metadata } from "next";
import { CountryComparePage } from "@/components/country/CountryComparePage";
import { siteUrl } from "@/lib/site";
import { locales } from "@/i18n/routing";
import { allComparePairs, getPairIntro, COMPARE_COUNTRY_NAMES } from "@/data/country-compare";
import { ruCountryForms } from "@/data/country-topics";
import type { Locale } from "@/types";

export const revalidate = 3600;
export const dynamic = "force-static";

export function generateStaticParams() {
  const pairs = allComparePairs();
  return locales.flatMap((locale) =>
    pairs.map((p) => ({ locale, pair: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pair: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, pair } = await params;
  const locale = rawLocale as Locale;
  const m = pair.match(/^([a-z]+)-vs-([a-z]+)$/);
  if (!m || !COMPARE_COUNTRY_NAMES[m[1]] || !COMPARE_COUNTRY_NAMES[m[2]]) {
    return { title: "Not found" };
  }
  const nameA = COMPARE_COUNTRY_NAMES[m[1]][locale];
  const nameB = COMPARE_COUNTRY_NAMES[m[2]][locale];
  const genA = locale === "ru" ? ruCountryForms(m[1], nameA).gen : nameA;
  const genB = locale === "ru" ? ruCountryForms(m[2], nameB).gen : nameB;
  const copy = getPairIntro(pair, locale);
  const year = new Date().getFullYear();
  const path = `xaricde-tehsil/muqayise/${pair}`;

  return {
    title: copy.title(nameA, nameB, year),
    description: copy.metaDescription(nameA, nameB, year, genA, genB),
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
      title: copy.title(nameA, nameB, year),
      description: copy.metaDescription(nameA, nameB, year),
      type: "website",
      locale: locale === "az" ? "az_AZ" : locale === "ru" ? "ru_RU" : "en_US",
      siteName: "MegaGroup",
      url: `${siteUrl}/${locale}/${path}`,
    },
    twitter: { card: "summary_large_image", title: copy.title(nameA, nameB, year), description: copy.metaDescription(nameA, nameB, year, genA, genB) },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; pair: string }>;
}) {
  const { locale, pair } = await params;
  return <CountryComparePage locale={locale as Locale} pairSlug={pair} />;
}
