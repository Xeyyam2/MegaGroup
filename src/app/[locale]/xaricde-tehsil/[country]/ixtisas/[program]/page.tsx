import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CountryProgramPage } from "@/components/country/CountryProgramPage";
import { PROGRAMS, getProgram } from "@/data/country-programs";
import { countries as staticCountries } from "@/data/countries";
import { routing, type Locale } from "@/i18n/routing";
import { getCountryBySlug } from "@/lib/data/countries";
import { siteUrl } from "@/lib/site";
import { azLocative, ruCountryForms } from "@/data/country-topics";
import { programMetaLoc, programTitleLoc } from "@/data/country-programs";

export const revalidate = 3600;
export const dynamic = "force-static";

interface PageProps {
  params: Promise<{ locale: string; country: string; program: string }>;
}

export function generateStaticParams() {
  const countries = staticCountries.map((c) => c.slug);
  const programs = PROGRAMS.map((p) => p.slug);
  return routing.locales.flatMap((locale) =>
    countries.flatMap((country) => programs.map((program) => ({ locale, country, program }))),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, country, program: programSlug } = await params;
  const locale = rawLocale as Locale;
  const p = getProgram(programSlug);
  const c = await getCountryBySlug(country, locale);
  if (!p || !c) return { title: locale === "az" ? "Tapılmadı" : "Not found" };

  const year = new Date().getFullYear();
  const az = azLocative(c.name_az, country);
  const ru = ruCountryForms(country, c.name_ru);
  const ctx = { azLoc: az, azName: c.name_az, enName: c.name_en, ruPrep: ru.prep, ruGen: ru.gen };
  const path = `xaricde-tehsil/${country}/ixtisas/${p.slug}`;

  return {
    title: programTitleLoc(p, locale, year, ctx),
    description: programMetaLoc(p, locale, year, ctx),
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
      title: programTitleLoc(p, locale, year, ctx),
      description: programMetaLoc(p, locale, year, ctx),
      images: [{ url: c.hero_image_url, width: 1200, height: 630, alt: c.name }],
      type: "website",
      locale: locale === "az" ? "az_AZ" : locale === "ru" ? "ru_RU" : "en_US",
      siteName: "MegaGroup",
      url: `${siteUrl}/${locale}/${path}`,
    },
    twitter: { card: "summary_large_image", title: programTitleLoc(p, locale, year, ctx), description: programMetaLoc(p, locale, year, ctx) },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale: rawLocale, country, program } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const p = getProgram(program);
  if (!p) notFound();
  return <CountryProgramPage locale={locale} country={country} program={p} />;
}
