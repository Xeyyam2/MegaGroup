import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { CTASection } from "@/components/sections/CTASection";
import { FadeInUp } from "@/components/motion/FadeInUp";
import { getCountries } from "@/lib/data/countries";
import { siteUrl } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const title =
    locale === "az"
      ? "Xaricdə Təhsil — Türkiyə, Rusiya, Gürcüstan, Ukrayna, Qazaxıstan"
      : locale === "ru"
        ? "Учеба за рубежом"
        : "Study Abroad";
  return {
    title,
    description:
      locale === "az"
        ? "MegaGroup — xaricdə təhsil mərkəzi: Türkiyədə təhsil, Rusiyada təhsil, Gürcüstanda təhsil, Ukraynada təhsil, Qazaxıstanda təhsil, Almaniya və Polşa. Attestatla, imtahansız qəbul."
        : locale === "ru"
          ? "MegaGroup — учеба за рубежом: Турция, Россия, Грузия, Украина, Казахстан, Германия и Польша. Поступление по аттестату, без экзаменов."
          : "MegaGroup — study abroad in Turkey, Russia, Georgia, Ukraine, Kazakhstan, Germany and Poland. Certificate-based, exam-free admission.",
    alternates: {
      canonical: `${siteUrl}/${locale}/xaricde-tehsil`,
      languages: {
        az: `${siteUrl}/az/xaricde-tehsil`,
        ru: `${siteUrl}/ru/xaricde-tehsil`,
        en: `${siteUrl}/en/xaricde-tehsil`,
        "x-default": `${siteUrl}/az/xaricde-tehsil`,
      },
    },
  };
}

export default async function StudyAbroadIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const tCta = await getTranslations({ locale, namespace: "cta" });
  const countries = await getCountries(locale);

  // ItemList schema — ölkə kolleksiyası səhifəsi üçün zəngin nəticə.
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: locale === "az" ? "Xaricdə Təhsil Ölkələri" : locale === "ru" ? "Страны для обучения" : "Study Abroad Countries",
    itemListElement: countries.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${siteUrl}/${locale}/xaricde-tehsil/${c.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="font-heading text-4xl font-extrabold text-foreground sm:text-5xl">
          {locale === "az" ? "Xaricdə Təhsil" : locale === "ru" ? "Учеба за рубежом" : "Study Abroad"}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-foreground/70">
          {locale === "az"
            ? "MegaGroup — Xaricdə Təhsil Mərkəzi. Attestatınızla, DIM imtahanı olmadan xarici universitetlərə qəbul olun."
            : locale === "ru"
              ? "MegaGroup — Центр обучения за рубежом. Поступление в зарубежные вузы по аттестату, без экзаменов."
              : "MegaGroup — Study Abroad Center. Get admitted to foreign universities with your certificate, exam-free."}
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((c, i) => (
            <FadeInUp key={c.slug} delay={i * 0.08}>
              <Link
                href={`/${locale}/xaricde-tehsil/${c.slug}`}
                className="glass block h-full rounded-2xl p-6 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                <h2 className="font-heading text-2xl font-bold text-foreground">{c.name}</h2>
                <p className="mt-2 text-sm text-foreground/70">{c.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-foreground/60">
                  <span>🎓 {c.quick_stats.universities}</span>
                  <span>·</span>
                  <span>
                    {c.quick_stats.avg_tuition_usd === 0
                      ? locale === "az"
                        ? "Pulsuz"
                        : locale === "ru"
                          ? "Бесплатно"
                          : "Free"
                      : `$${c.quick_stats.avg_tuition_usd}/il`}
                  </span>
                </div>
                <span className="mt-4 inline-block text-sm font-semibold text-brand-primary">
                  {tCta("more")} →
                </span>
              </Link>
            </FadeInUp>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
