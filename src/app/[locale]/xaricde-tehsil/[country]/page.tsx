import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { CountryTabs } from "@/components/sections/CountryTabs";
import { UniversityGrid } from "@/components/sections/UniversityGrid";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";
import { FadeInUp } from "@/components/motion/FadeInUp";
import { getCountries, getCountryBySlug } from "@/lib/data/countries";
import { getUniversitiesByCountry, getFeaturedUniversity } from "@/lib/data/universities";
import { getFAQsByCountry } from "@/lib/data/faqs";
import { routing, type Locale } from "@/i18n/routing";
import { countries as staticCountries } from "@/data/countries";
import { ARTICLES } from "@/data/articles";
import { getCountryContent } from "@/data/country-content";
import { siteUrl } from "@/lib/site";
import { getCountrySeo } from "@/lib/seo";

export const revalidate = 3600;
export const dynamic = "force-static";

interface PageProps {
  params: Promise<{ locale: string; country: string }>;
}

export function generateStaticParams() {
  const slugs = staticCountries.map((c) => c.slug);
  return routing.locales.flatMap((locale) => slugs.map((country) => ({ locale, country })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, country } = await params;
  const locale = rawLocale as Locale;
  const c = await getCountryBySlug(country, locale);
  if (!c) return { title: locale === "az" ? "Tapılmadı" : "Not found" };
  const seo = locale === "az" ? getCountrySeo(country) : undefined;

  // Title — açar söz BAŞDA olmalı (exact-match ranking üçün kritik).
  // AZ üçün qrammatik düzgün açar söz (seo.ts), RU/EN üçün əvvəlki dinamik forma.
  const title = locale === "az" && seo
    ? seo.title
    : `${c.name} ${locale === "ru" ? "— Учеба по аттестату" : "— Study & Admission"} | MegaGroup`;
  const description = locale === "az" && seo ? seo.metaDescription : c.description;
  const keywords = locale === "az" && seo
    ? seo.keywords
    : locale === "ru"
      ? [`учеба в ${c.name_ru.toLowerCase()}`, `${c.name_ru.toLowerCase()} университеты`, "поступление по аттестату", "учеба за рубежом"]
      : [`study in ${c.name_en.toLowerCase()}`, `${c.name_en.toLowerCase()} universities`, "study abroad", "certificate admission"];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${siteUrl}/${locale}/xaricde-tehsil/${c.slug}`,
      languages: {
        az: `${siteUrl}/az/xaricde-tehsil/${c.slug}`,
        ru: `${siteUrl}/ru/xaricde-tehsil/${c.slug}`,
        en: `${siteUrl}/en/xaricde-tehsil/${c.slug}`,
        // x-default — axtarış sistemləri üçün susmaya versiya
        "x-default": `${siteUrl}/az/xaricde-tehsil/${c.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      images: [{ url: c.hero_image_url, width: 1200, height: 630, alt: locale === "az" && seo ? seo.h1 : c.name }],
      type: "website",
      locale: locale === "az" ? "az_AZ" : locale === "ru" ? "ru_RU" : "en_US",
      siteName: "MegaGroup",
      url: `${siteUrl}/${locale}/xaricde-tehsil/${c.slug}`,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CountryPage({ params }: PageProps) {
  const { locale: rawLocale, country } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "country" });
  const c = await getCountryBySlug(country, locale);
  if (!c) notFound();

  // AZ üçün qrammatik düzgün açar söz H1-i (ranking üçün kritik),
  // RU/EN üçün əvvəlki dinamik forma saxlanılır.
  const seo = locale === "az" ? getCountrySeo(country) : undefined;
  const h1 = seo?.h1 ?? c.name;
  // Dərin AZ məzmunu (yalnız az dilində — hədəf açar sözlər AZ-dildir).
  const content = locale === "az" ? getCountryContent(country) : undefined;

  const allCountries = await getCountries(locale);
  const unis = await getUniversitiesByCountry(country, locale);
  const featured = await getFeaturedUniversity(country, locale);
  const faqs = await getFAQsByCountry(country, locale);
  const relatedArticle = locale === "az" ? ARTICLES.find((a) => a.relatedCountrySlug === c.slug) : undefined;

  const visaLabel =
    c.quick_stats.visa_difficulty === "easy"
      ? locale === "az"
        ? "Asan"
        : locale === "ru"
          ? "Легкая"
          : "Easy"
      : c.quick_stats.visa_difficulty === "medium"
        ? locale === "az"
          ? "Orta"
          : locale === "ru"
            ? "Средняя"
            : "Medium"
        : locale === "az"
          ? "Çətin"
          : locale === "ru"
            ? "Сложная"
            : "Hard";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Xaricdə Təhsil", item: `${siteUrl}/${locale}/xaricde-tehsil` },
      { "@type": "ListItem", position: 2, name: c.name, item: `${siteUrl}/${locale}/xaricde-tehsil/${c.slug}` },
    ],
  };

  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  // speakable — AI/səsli cavablar üçün ölkə səhifəsinin ən yaxşı qısa xülasəsi.
  const speakableJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${siteUrl}/${locale}/xaricde-tehsil/${c.slug}`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".country-hero-intro"],
    },
  };

  // ItemList — bu ölkənin universitet siyahısı (AI çıxarışı üçün).
  const itemListJsonLd = unis.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${h1} — Universitetlər`,
        numberOfItems: unis.length,
        itemListElement: unis.map((u, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: u.name,
          url: `${siteUrl}/${locale}/xaricde-tehsil/${c.slug}/${u.slug}`,
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }} />
      {itemListJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      )}

      <section className="country-hero-intro relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <Image src={c.hero_image_url} alt={locale === "az" && seo ? `${seo.h1} — ${c.name}` : c.name} fill priority sizes="100vw" className="object-cover opacity-30" />
        <div className="relative z-10 px-6 py-24 text-center">
          <h1 className="text-balance mt-4 font-heading text-4xl font-extrabold text-foreground sm:text-6xl">{h1}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-foreground/80">{c.description}</p>
        </div>
      </section>

      <CountryTabs countries={allCountries} activeSlug={c.slug} localePrefix={`/${locale}`} />

      {/* Giriş paraqrafları — ilk 100 sözdə açar söz (SEO üçün kritik). */}
      {content?.intro && (
        <section className="mx-auto max-w-3xl px-6 py-10">
          <div className="space-y-4 text-base leading-relaxed text-foreground/80">
            {content.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-16">
        {c.warning_banner && (
          <div className="mb-8 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-300">
            ⚠️ {c.warning_banner}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: locale === "az" ? "Universitet" : locale === "ru" ? "Вуз" : "Universities", value: String(c.quick_stats.universities) },
            { label: locale === "az" ? "Təhsil haqqı" : locale === "ru" ? "Плата" : "Tuition", value: c.quick_stats.avg_tuition_usd === 0 ? (locale === "az" ? "Pulsuz" : locale === "ru" ? "Бесплатно" : "Free") : `$${c.quick_stats.avg_tuition_usd}` },
            { label: locale === "az" ? "Dil" : locale === "ru" ? "Язык" : "Language", value: c.quick_stats.language },
            { label: locale === "az" ? "Viza" : locale === "ru" ? "Виза" : "Visa", value: visaLabel },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5 text-center">
              <div className="text-2xl font-bold text-brand-primary">{s.value}</div>
              <div className="mt-1 text-xs text-foreground/60">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="font-heading text-3xl font-bold text-foreground">
          {locale === "az" ? `Niyə ${h1.replace(/\s*2026$/, "")}?` : locale === "ru" ? `Почему ${c.name}?` : `Why ${c.name}?`}
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {c.advantages.map((a, i) => (
            <FadeInUp key={a} delay={i * 0.08}>
              <div className="glass h-full rounded-2xl p-6">
                <div className="text-2xl text-brand-accent">✦</div>
                <p className="mt-2 text-foreground/80">{a}</p>
              </div>
            </FadeInUp>
          ))}
        </div>
      </section>

      {/* Xərc cədvəli — real rəqəmlərlə (SEO + istifadəçi dəyəri). */}
      {content?.costRows && content.costRows.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-12">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            {locale === "az" ? `${h1.replace(/\s*2026$/, "")} — Xərclər` : locale === "ru" ? "Расходы" : "Costs"}
          </h2>
          <div className="glass mt-8 overflow-x-auto rounded-2xl">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-foreground/70">
                <tr>
                  <th className="px-5 py-3">{locale === "az" ? "Xərc kateqoriyası" : locale === "ru" ? "Категория" : "Category"}</th>
                  <th className="px-5 py-3">{locale === "az" ? "Minimum" : "Min"}</th>
                  <th className="px-5 py-3">{locale === "az" ? "Maksimum" : "Max"}</th>
                  <th className="px-5 py-3">{locale === "az" ? "Müddət" : "Period"}</th>
                </tr>
              </thead>
              <tbody>
                {content.costRows.map((row) => (
                  <tr key={row.label} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-3 font-medium text-foreground">
                      {row.label}
                      {row.note && <span className="block text-xs font-normal text-foreground/50">{row.note}</span>}
                    </td>
                    <td className="px-5 py-3 text-foreground/80">${row.min.toLocaleString("en-US")}</td>
                    <td className="px-5 py-3 text-foreground/80">${row.max.toLocaleString("en-US")}</td>
                    <td className="px-5 py-3 text-foreground/60">
                      {row.unit === "il" ? (locale === "az" ? "illik" : "yearly") : locale === "az" ? "aylıq" : "monthly"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {content.costNote && <p className="mt-4 text-sm text-foreground/60">{content.costNote}</p>}
        </section>
      )}

      {/* Ən populyar tələbə şəhərləri. */}
      {content?.cities && content.cities.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            {locale === "az" ? "Ən Populyar Tələbə Şəhərləri" : locale === "ru" ? "Города" : "Top Student Cities"}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {content.cities.map((city, i) => (
              <FadeInUp key={city.name} delay={i * 0.08}>
                <div className="glass h-full rounded-2xl p-6">
                  <h3 className="font-heading text-xl font-bold text-foreground">{city.name}</h3>
                  <p className="mt-2 text-sm text-foreground/70">{city.description}</p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </section>
      )}

      {/* Qəbul şərtləri haqqında detallı məzmun. */}
      {content?.admission && content.admission.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 py-12">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            {locale === "az" ? "Qəbul Şərtləri" : locale === "ru" ? "Условия поступления" : "Admission Requirements"}
          </h2>
          <div className="mt-8 space-y-8">
            {content.admission.map((sec) => (
              <div key={sec.heading}>
                <h3 className="font-heading text-xl font-bold text-foreground">{sec.heading}</h3>
                <div className="mt-2 space-y-3 text-foreground/80">
                  {sec.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {featured && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <h2 className="font-heading text-3xl font-bold text-foreground">{t("featuredUni")}</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="glass overflow-hidden rounded-2xl">
              <Image src={featured.hero_image_url} alt={featured.name} width={1200} height={630} className="h-64 w-full object-cover" loading="lazy" />
            </div>
            <div className="glass rounded-2xl p-8">
              <h3 className="font-heading text-2xl font-bold text-foreground">{featured.name}</h3>
              <p className="mt-1 text-foreground/60">{featured.city}</p>
              <div className="mt-4 space-y-2">
                {featured.highlights.map((h) => (
                  <div key={h} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="text-brand-primary">✓</span> {h}
                  </div>
                ))}
              </div>
              <a href={`/${locale}/xaricde-tehsil/${c.slug}/${featured.slug}`} className="mt-6 inline-block rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary">
                {locale === "az" ? "Ətraflı bax" : locale === "ru" ? "Подробнее" : "View details"} →
              </a>
            </div>
          </div>
        </section>
      )}

      {unis.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <h2 className="font-heading text-3xl font-bold text-foreground">{t("universities")}</h2>
          <div className="mt-8">
            <UniversityGrid universities={unis} localePrefix={`/${locale}`} />
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="font-heading text-3xl font-bold text-foreground">{t("process")}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {c.application_steps.map((step, i) => (
            <FadeInUp key={step.step} delay={i * 0.12}>
              <div className="glass h-full rounded-2xl p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary font-bold text-white">
                  {step.step}
                </div>
                <h3 className="mt-3 font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm text-foreground/70">{step.description}</p>
              </div>
            </FadeInUp>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="font-heading text-3xl font-bold text-foreground">{t("documents")}</h2>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {c.documents_required.map((doc) => (
            <label key={doc} className="glass flex items-center gap-3 rounded-xl p-4 text-sm text-foreground/80">
              <input type="checkbox" className="h-5 w-5 accent-brand-primary" readOnly /> {doc}
            </label>
          ))}
        </div>
      </section>

      {/* Viza prosesi — addım-addım dərin məzmun. */}
      {content?.visaSteps && content.visaSteps.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            {locale === "az" ? "Viza Prosesi" : locale === "ru" ? "Процесс визы" : "Visa Process"}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {content.visaSteps.map((step, i) => (
              <FadeInUp key={step.step} delay={i * 0.1}>
                <div className="glass h-full rounded-2xl p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-secondary font-bold text-white">
                    {step.step}
                  </div>
                  <h3 className="mt-3 font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-sm text-foreground/70">{step.description}</p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </section>
      )}

      {/* Tələbə həyatı haqqında dərin məzmun (E-E-A-T üçün faydalı). */}
      {content?.studentLife && content.studentLife.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 py-12">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            {locale === "az" ? "Tələbə Həyatı və Yaşayış" : locale === "ru" ? "Студенческая жизнь" : "Student Life"}
          </h2>
          <div className="mt-6 space-y-4 text-foreground/80">
            {content.studentLife.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="font-heading text-3xl font-bold text-foreground">
          {locale === "az" ? "Tez-tez Verilən Suallar" : locale === "ru" ? "Часто задаваемые вопросы" : "FAQ"}
        </h2>
        <div className="mt-8">
          <FAQSection faqs={faqs} />
        </div>
      </section>

      {relatedArticle && (
        <section className="mx-auto max-w-3xl px-6 pb-12">
          <FadeInUp>
            <Link
              href={`/az/bloq/${relatedArticle.slug}`}
              className="glass shadow-brand-hover block h-full rounded-2xl p-6 transition-colors hover:bg-white/10"
            >
              <span className="text-sm font-semibold text-brand-primary">
                {/* Açar sözlü anchor text — blog məqaləsinə kontekstual link */}
                {seo?.primaryKeyword ?? c.name} haqqında ətraflı bələdçini oxu →
              </span>
              <p className="mt-1 text-sm text-foreground/70">{relatedArticle.excerpt}</p>
            </Link>
          </FadeInUp>
        </section>
      )}

      <CTASection />
    </>
  );
}
