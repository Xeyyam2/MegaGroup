import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CostCalculator } from "@/components/sections/CostCalculator";
import { FAQSection } from "@/components/sections/FAQSection";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { CTASection } from "@/components/sections/CTASection";
import { FadeInUp } from "@/components/motion/FadeInUp";
import { getCountryBySlug } from "@/lib/data/countries";
import { getUniversityBySlug } from "@/lib/data/universities";
import { getFAQsByUniversity } from "@/lib/data/faqs";
import { getTestimonialsByUniversity } from "@/lib/data/testimonials";
import { routing, type Locale } from "@/i18n/routing";
import { universities as staticUniversities } from "@/data/universities";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ locale: string; country: string; university: string }>;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    staticUniversities.map((u) => ({ locale, country: u.country_slug, university: u.slug })),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, university } = await params;
  const locale = rawLocale as Locale;
  const u = await getUniversityBySlug(university, locale);
  if (!u) return { title: locale === "az" ? "Tapılmadı" : "Not found" };
  return {
    title: `${u.name} — ${locale === "az" ? "Attestatla Qəbul" : locale === "ru" ? "Поступление" : "Admission"}`,
    description: `${u.name} (${u.city}) — MegaGroup — Xaricdə Təhsil Mərkəzi.`,
    alternates: { canonical: `${siteUrl}/${locale}/xaricde-tehsil/${u.country_slug}/${u.slug}` },
    openGraph: {
      title: `${u.name} | MegaGroup`,
      description: `${u.city}`,
      images: [{ url: u.hero_image_url, width: 1200, height: 630 }],
    },
  };
}

export default async function UniversityPage({ params }: PageProps) {
  const { locale: rawLocale, country, university } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const u = await getUniversityBySlug(university, locale);
  const c = await getCountryBySlug(country, locale);
  if (!u || !c) notFound();

  const faqs = await getFAQsByUniversity(university, locale);
  const stories = await getTestimonialsByUniversity(university, locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: u.name,
    url: u.website_url,
    address: { "@type": "PostalAddress", addressCountry: c.name_en, addressLocality: u.city },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden">
        <Image src={u.hero_image_url} alt={u.name} fill priority sizes="100vw" className="object-cover opacity-30" />
        <div className="relative z-10 px-6 py-24 text-center">
          <h1 className="text-balance mt-3 font-heading text-4xl font-extrabold text-foreground sm:text-5xl">{u.name}</h1>
          <p className="mt-2 text-foreground/80">
            {u.city}, {c.name}
          </p>
          <a
            href={u.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-xl glass px-5 py-2 text-sm text-foreground hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            {locale === "az" ? "Rəsmi sayt" : locale === "ru" ? "Офиц. сайт" : "Official site"} →
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="font-heading text-3xl font-bold text-foreground">
          {locale === "az" ? "Niyə" : locale === "ru" ? "Почему" : "Why"} {u.name}?
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {u.highlights.map((h, i) => (
            <FadeInUp key={h} delay={i * 0.08}>
              <div className="glass h-full rounded-2xl p-6">
                <div className="text-2xl text-brand-accent">✦</div>
                <p className="mt-2 text-foreground/80">{h}</p>
              </div>
            </FadeInUp>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="font-heading text-3xl font-bold text-foreground">
          {locale === "az" ? "Fakültə və İxtisaslar" : locale === "ru" ? "Факультеты" : "Faculties"}
        </h2>
        <div className="glass mt-8 overflow-x-auto rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-foreground/70">
              <tr>
                <th className="px-5 py-3">{locale === "az" ? "Fakültə" : locale === "ru" ? "Факультет" : "Faculty"}</th>
                <th className="px-5 py-3">{locale === "az" ? "Rəqabət" : locale === "ru" ? "Конкурс" : "Competitive"}</th>
                <th className="px-5 py-3">{locale === "az" ? "Müddət" : locale === "ru" ? "Срок" : "Duration"}</th>
                <th className="px-5 py-3">{locale === "az" ? "Dil" : locale === "ru" ? "Язык" : "Language"}</th>
              </tr>
            </thead>
            <tbody>
              {u.faculties.map((f) => (
                <tr key={f.id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3 font-medium text-foreground">{f.name}</td>
                  <td className="px-5 py-3">
                    {f.is_competitive ? (
                      <span className="rounded-full bg-brand-primary/20 px-2 py-0.5 text-xs text-brand-primary">
                        {locale === "az" ? "Rəqabətli" : locale === "ru" ? "Конкурс" : "Competitive"}
                      </span>
                    ) : (
                      <span className="rounded-full bg-success/20 px-2 py-0.5 text-xs text-success">
                        {locale === "az" ? "Açıq" : locale === "ru" ? "Открыто" : "Open"}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-foreground/70">
                    {f.duration_years} {locale === "az" ? "il" : locale === "ru" ? "лет" : "yrs"}
                  </td>
                  <td className="px-5 py-3 text-foreground/70">{f.language}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="font-heading text-3xl font-bold text-foreground">
          {locale === "az" ? "Xərc Hesablaması" : locale === "ru" ? "Расходы" : "Cost Estimate"}
        </h2>
        <div className="mt-8">
          <CostCalculator universities={[u]} />
        </div>
      </section>

      {u.campus_info && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            {locale === "az" ? "Kampus & Şəhər" : locale === "ru" ? "Кампус" : "Campus & City"}
          </h2>
          <div className="glass mt-6 rounded-2xl p-8 text-foreground/80">{u.campus_info}</div>
        </section>
      )}

      {u.notes && (
        <section className="mx-auto max-w-7xl px-6 py-6">
          <div className="rounded-2xl border border-brand-secondary/30 bg-brand-secondary/10 p-4 text-brand-secondary/90">
            ℹ️ {u.notes}
          </div>
        </section>
      )}

      {stories.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            {locale === "az" ? "Uğur Hekayələri" : locale === "ru" ? "Истории успеха" : "Success Stories"}
          </h2>
          <div className="mt-8">
            <SuccessStories testimonials={stories} />
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 py-12">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            {locale === "az" ? "Tez-tez Verilən Suallar" : locale === "ru" ? "Вопросы" : "FAQ"}
          </h2>
          <div className="mt-8">
            <FAQSection faqs={faqs} />
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}
