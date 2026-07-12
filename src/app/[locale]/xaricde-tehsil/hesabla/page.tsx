import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CostCalculator } from "@/components/sections/CostCalculator";
import { CTASection } from "@/components/sections/CTASection";
import { getCountries } from "@/lib/data/countries";
import { getUniversitiesByCountry } from "@/lib/data/universities";
import { siteUrl } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return {
    title: locale === "az" ? "Xərc Kalkulatoru" : locale === "ru" ? "Калькулятор расходов" : "Cost Calculator",
    alternates: { canonical: `${siteUrl}/${locale}/xaricde-tehsil/hesabla` },
  };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const countries = await getCountries(locale);
  const groups = await Promise.all(countries.map((c) => getUniversitiesByCountry(c.slug, locale)));
  const universities = groups.flat();

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="font-heading text-4xl font-extrabold text-foreground sm:text-5xl">
          {locale === "az" ? "Xərc Kalkulatoru" : locale === "ru" ? "Калькулятор расходов" : "Cost Calculator"}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-foreground/70">
          {locale === "az"
            ? "Universitet seçin və müddəti təyin edin — aylıq və toplam xərcləri dərhal hesablayın."
            : locale === "ru"
              ? "Выберите университет и срок — рассчитайте ежемесячные и общие расходы."
              : "Select a university and duration — instantly calculate monthly and total costs."}
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <CostCalculator universities={universities} countries={countries} />
      </section>

      <CTASection />
    </>
  );
}
