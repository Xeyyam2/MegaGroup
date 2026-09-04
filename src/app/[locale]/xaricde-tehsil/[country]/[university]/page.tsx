import type { Metadata } from "next";
import Link from "next/link";
import { SmartImage } from "@/components/SmartImage";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CostCalculator } from "@/components/sections/CostCalculator";
import { FAQSection } from "@/components/sections/FAQSection";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { CTASection } from "@/components/sections/CTASection";
import { FadeInUp } from "@/components/motion/FadeInUp";
import { getCountryBySlug } from "@/lib/data/countries";
import { getUniversityBySlug, getUniversitiesByCountry } from "@/lib/data/universities";
import { getUniversityContentByLocale } from "@/data/university-content";
import { getArticleBySlugLocalized } from "@/data/articles";
import { getFAQsByUniversityWithCountry } from "@/lib/data/faqs";
import { getTestimonialsByUniversity } from "@/lib/data/testimonials";
import { routing, type Locale } from "@/i18n/routing";
import { universities as staticUniversities } from "@/data/universities";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;
export const dynamic = "force-static";

// Tədris dilləri bazada bir dildə saxlanılır (adətən AZ forması).
// Qısa faktlar blokunda hər lokal üçün doğru dil adı göstərilir.
const LANGUAGE_IDS: Record<Locale, Record<string, string>> = {
  az: {
    english: "İngilis dili",
    russian: "Rus dili",
    turkish: "Türk dili",
    german: "Alman dili",
    polish: "Polyak dili",
    ukrainian: "Ukrayna dili",
    kazakh: "Qazax dili",
    georgian: "Gürcü dili",
  },
  ru: {
    english: "Английский",
    russian: "Русский",
    turkish: "Турецкий",
    german: "Немецкий",
    polish: "Польский",
    ukrainian: "Украинский",
    kazakh: "Казахский",
    georgian: "Грузинский",
  },
  en: {
    english: "English",
    russian: "Russian",
    turkish: "Turkish",
    german: "German",
    polish: "Polish",
    ukrainian: "Ukrainian",
    kazakh: "Kazakh",
    georgian: "Georgian",
  },
};

function localizeLanguage(raw: string, locale: Locale): string {
  // Diakritik işarələri silirik: "İ".toLowerCase() JS-də "i" + birləşən nöqtə
  // (U+0307) verir və "ingilis"-i tapmır — normalize etmədən müqayisə səhvdir.
  const s = raw.toLowerCase().replace(/[\u0300-\u036f]/g, "");
  const pick = (keys: string[], id: string): string | null =>
    keys.some((k) => s.includes(k)) ? LANGUAGE_IDS[locale][id] ?? raw : null;
  return (
    pick(["ingilis", "english", "английск"], "english") ??
    pick(["rus", "russian", "русск"], "russian") ??
    pick(["türk", "turk", "türkiyə"], "turkish") ??
    pick(["alman", "german", "немецк"], "german") ??
    pick(["polyak", "polish", "польск"], "polish") ??
    pick(["ukrayn", "ukrain", "украинск"], "ukrainian") ??
    pick(["qazax", "kazakh", "казахск"], "kazakh") ??
    pick(["gürcü", "gurcu", "georgian", "грузинск"], "georgian") ??
    raw
  );
}

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
  const titleSuffix =
    locale === "az" ? "Attestatla Qəbul" : locale === "ru" ? "Поступление" : "Admission";  const descriptions = {
    az: `${u.name} (${u.city}) — attestatla, imtahansız qəbul. Fakültələr, təhsil haqqı, qəbul şərtləri və xərclər. MegaGroup — Xaricdə Təhsil Mərkəzi.`,
    ru: `${u.name} (${u.city}) — поступление по аттестату, без экзаменов. Факультеты, стоимость, условия поступления. MegaGroup.`,
    en: `${u.name} (${u.city}) — certificate-based admission, exam-free. Faculties, tuition, requirements. MegaGroup — Study Abroad Center.`,
  };
  const path = `xaricde-tehsil/${u.country_slug}/${u.slug}`;
  return {
    title: `${u.name} — ${titleSuffix} | MegaGroup`,
    description: descriptions[locale],
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
      title: `${u.name} | MegaGroup`,
      description: descriptions[locale],
      images: [{ url: u.hero_image_url, width: 1200, height: 630 }],
      type: "website",
      locale: locale === "az" ? "az_AZ" : locale === "ru" ? "ru_RU" : "en_US",
      siteName: "MegaGroup",
      url: `${siteUrl}/${locale}/${path}`,
    },
    twitter: { card: "summary_large_image", title: `${u.name} | MegaGroup`, description: descriptions[locale] },
  };
}

export default async function UniversityPage({ params }: PageProps) {
  const { locale: rawLocale, country, university } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const u = await getUniversityBySlug(university, locale);
  const c = await getCountryBySlug(country, locale);
  if (!u || !c) notFound();

  const faqs = await getFAQsByUniversityWithCountry(university, country, locale);
  const stories = await getTestimonialsByUniversity(university, locale);
  // seo.md 4 (P0-1): "Əlaqəli universitetlər" — hər universitet səhifəsindən
  // 8-12 internal link ilə PageRank-i ölkənin digər universitet profillərinə
  // yayırıq (qebulol.az modeli). Qəbul sistemi ilə paylaşmayan köhnə
  // universitetlər linklənir, səhifə özü də daxil olmamaqla.
  const siblingUniversities = (await getUniversitiesByCountry(country, locale))
    .filter((x) => x.slug !== u.slug)
    .slice(0, 12);
  // Universitet haqqında bloq bələdçisi varsa, onu tap — səhifələrarası
  // kontekstual link (internal linking) üçün. Məqalə slug-ı universitet slug-ı ilə eynidir.
  const guide = getArticleBySlugLocalized(university, locale);
  // Dərin AZ məzmunu (qəbul, sənədlər, şəhər, karyera) — hər universitet üçün.
  // Bloq məqaləsindən fərqli, səhifə profili kimi qurulub (duplicate yoxdur).
  const content = getUniversityContentByLocale(university, locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: u.name,
    url: u.website_url,
    address: { "@type": "PostalAddress", addressCountry: c.name_en, addressLocality: u.city },
    // Qiymət məlumatı — zəngin nəticələr üçün Offer schema
    makesOffer: {
      "@type": "Offer",
      name: `${locale === "az" ? "Xarici tələbə qəbulu" : locale === "ru" ? "Поступление иностранных студентов" : "International student admission"}`,
      priceCurrency: "USD",
      price: u.fees?.tuition_min_usd ?? undefined,
      description: locale === "az" ? "Attestat əsaslı qəbul — imtahansız" : "Certificate-based admission",
    },
  };

  const crumbRoot =
    locale === "az" ? "Xaricdə Təhsil" : locale === "ru" ? "Учёба за рубежом" : "Study Abroad";
  const crumbLabel =
    locale === "az" ? "Keçid yolu" : locale === "ru" ? "Хлебные крошки" : "Breadcrumb";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: crumbRoot, item: `${siteUrl}/${locale}/xaricde-tehsil` },
      { "@type": "ListItem", position: 2, name: c.name, item: `${siteUrl}/${locale}/xaricde-tehsil/${c.slug}` },
      { "@type": "ListItem", position: 3, name: u.name, item: `${siteUrl}/${locale}/xaricde-tehsil/${c.slug}/${u.slug}` },
    ],
  };

  // FAQPage JSON-LD — sual-cavab məzmununu AI/axtarış sistemlərinə açıq şəkildə təqdim edir.
  const faqJsonLd = faqs.length
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

  const guideStr = {
    az: "Universitet haqqında ətraflı bələdçi",
    ru: "Подробное руководство об университете",
    en: "Detailed university guide",
  };

  // AEO: qısa faktlar bloku — AI/axtarış sistemləri üçün asan çıxarış olunan
  // konkret məlumat (şəhər, qiymət, dil, müddət). Yalnız mövcud datadan
  // götürülür — yeni/uydurulmuş rəqəm yoxdur.
  const LBL: Record<Locale, { title: string; city: string; tuition: string; language: string; duration: string; programs: string; year: string }> = {
    az: {
      title: "Qısa Faktlar",
      city: "Şəhər",
      tuition: "Təhsil haqqı (USD/il)",
      language: "Tədris dili",
      duration: "Proqram müddəti",
      programs: "Fakültə / proqram",
      year: "il",
    },
    ru: {
      title: "Основные факты",
      city: "Город",
      tuition: "Стоимость обучения (USD/год)",
      language: "Язык обучения",
      duration: "Длительность программы",
      programs: "Факультетов / программ",
      year: "лет",
    },
    en: {
      title: "Quick Facts",
      city: "City",
      tuition: "Tuition (USD/year)",
      language: "Language of instruction",
      duration: "Program duration",
      programs: "Faculties / programs",
      year: "years",
    },
  };
  const lbl = LBL[locale] ?? LBL.az;

  const factRows: { label: string; value: string }[] = [];
  if (u.city) factRows.push({ label: lbl.city, value: `${u.city}, ${c.name}` });
  if (u.fees) {
    const min = u.fees.tuition_min_usd ?? 0;
    const max = u.fees.tuition_max_usd ?? 0;
    if (min > 0 || max > 0) {
      const range = max > min ? `$${min}–$${max}` : `$${Math.max(min, max)}`;
      factRows.push({ label: lbl.tuition, value: `${range} / ${locale === "az" ? "il" : locale === "ru" ? "год" : "yr"}` });
    }
  }
  const languages = [
    ...new Set(u.faculties.map((f) => localizeLanguage(f.language, locale)).filter(Boolean)),
  ];
  if (languages.length) {
    factRows.push({ label: lbl.language, value: languages.join(", ") });
  }
  const durations = u.faculties.map((f) => f.duration_years).filter((n) => n > 0);
  if (durations.length) {
    const minDur = Math.min(...durations);
    const maxDur = Math.max(...durations);
    factRows.push({
      label: lbl.duration,
      value: `${minDur === maxDur ? minDur : `${minDur}–${maxDur}`} ${lbl.year}`,
    });
  }
  if (u.faculties.length) {
    factRows.push({ label: lbl.programs, value: String(u.faculties.length) });
  }

  // AEO: speakable — səhifənin ən yaxşı qısa cavab hissəsi (AI/səsli
  // assistantlar üçün), giriş paraqrafları blokuna işarə edir.
  const speakableJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${siteUrl}/${locale}/xaricde-tehsil/${c.slug}/${u.slug}`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".uni-quick-answer"],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }} />

      <nav aria-label={crumbLabel} className="mx-auto max-w-7xl px-6 pt-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-foreground/50">
          <li>
            <Link href={`/${locale}/xaricde-tehsil`} className="hover:text-brand-primary">
              {crumbRoot}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href={`/${locale}/xaricde-tehsil/${c.slug}`}
              className="hover:text-brand-primary"
            >
              {c.name}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground/70">{u.name}</li>
        </ol>
      </nav>

      <section className="relative flex min-h-[55vh] items-center justify-center overflow-hidden">
        <SmartImage src={u.hero_image_url} alt={u.name} fill priority sizes="100vw" className="object-cover opacity-30" />
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

      {/* AEO: Qısa faktlar — strukturlaşdırılmış, çıxarışı asan məlumat. */}
      {factRows.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pt-10">
          <h2 className="font-heading text-xl font-bold text-foreground">{lbl.title}</h2>
          <dl className="glass mt-4 grid grid-cols-1 gap-x-8 gap-y-4 rounded-2xl p-6 sm:grid-cols-2 lg:grid-cols-3">
            {factRows.map((row) => (
              <div key={row.label}>
                <dt className="text-xs uppercase tracking-wide text-foreground/50">{row.label}</dt>
                <dd className="mt-1 font-medium text-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Giriş paraqrafları — ilk 100 sözdə açar söz (SEO üçün kritik).
          uni-quick-answer: speakable/AEO çıxarışı üçün hədəf blok. */}
      {content?.intro && content.intro.length > 0 && (
        <section className="uni-quick-answer mx-auto max-w-3xl px-6 py-10">
          <div className="space-y-4 text-base leading-relaxed text-foreground/80">
            {content.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}

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
        {content?.costNote && (
          <p className="mx-auto mt-6 max-w-3xl text-sm text-foreground/60">{content.costNote}</p>
        )}
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

      {guide && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <Link
            href={`/${locale}/bloq/${guide.slug}`}
            className="glass shadow-brand-hover block rounded-2xl p-6 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            <span className="text-sm font-semibold text-brand-primary">
              {guideStr[locale] ?? guideStr.az} →
            </span>
            <p className="mt-1 text-sm text-foreground/70">{guide.excerpt}</p>
          </Link>
        </section>
      )}

      {/* Dərin AZ məzmunu — qəbul şərtləri, sənədlər, şəhər, karyera (SEO üçün). */}
      {content && (
        <>
          {content.admission.length > 0 && (
            <section className="mx-auto max-w-3xl px-6 py-12">
              <h2 className="font-heading text-3xl font-bold text-foreground">
                {locale === "az"
                  ? "Qəbul Şərtləri və Proses"
                  : locale === "ru"
                    ? "Условия поступления и процесс"
                    : "Admission Requirements & Process"}
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

          {content.documents.length > 0 && (
            <section className="mx-auto max-w-3xl px-6 py-12">
              <h2 className="font-heading text-3xl font-bold text-foreground">
                {locale === "az"
                  ? "Tələb Olunan Sənədlər"
                  : locale === "ru"
                    ? "Требуемые документы"
                    : "Required Documents"}
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-3">
                {content.documents.map((doc) => (
                  <div
                    key={doc}
                    className="glass flex items-center gap-3 rounded-xl p-4 text-sm text-foreground/80"
                  >
                    <span className="text-brand-primary">✓</span> {doc}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mx-auto max-w-3xl px-6 py-12">
            <h2 className="font-heading text-3xl font-bold text-foreground">{content.city.heading}</h2>
            <div className="mt-6 space-y-4 text-foreground/80">
              {content.city.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-3xl px-6 py-12">
            <h2 className="font-heading text-3xl font-bold text-foreground">{content.career.heading}</h2>
            <div className="mt-6 space-y-4 text-foreground/80">
              {content.career.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        </>
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

      {/* seo.md 4 (P0-1): Əlaqəli universitetlər — internal linking şəbəkəsi. */}
      {siblingUniversities.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <h2 className="font-heading text-3xl font-bold text-foreground">
            {locale === "az"
              ? `Digər ${c.name} Universitetləri`
              : locale === "ru"
                ? `Другие вузы — ${c.name_en}`
                : `Other Universities in ${c.name_en}`}
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-foreground/60">
            {locale === "az"
              ? "Attestatla və imtahansız qəbul imkanları olan digər universitetlər — qəbul şərtləri, təhsil haqqı və fakültələr üçün keçid edin."
              : locale === "ru"
                ? "Другие вузы с поступлением по аттестату и без экзаменов — условия, стоимость и факультеты."
                : "Other universities with certificate-based, exam-free admission — requirements, tuition and faculties."}
          </p>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {siblingUniversities.map((x) => (
              <li key={x.slug}>
                <Link
                  href={`/${locale}/xaricde-tehsil/${c.slug}/${x.slug}`}
                  className="glass shadow-brand-hover block h-full rounded-2xl p-5 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                >
                  <h3 className="font-heading text-base font-bold text-foreground">{x.name}</h3>
                  <p className="mt-1 text-sm text-foreground/70">{x.city}</p>
                  <span className="mt-3 inline-block text-sm font-semibold text-brand-primary">
                    {locale === "az" ? "Profile bax →" : locale === "ru" ? "Смотреть →" : "View profile →"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <CTASection />
    </>
  );
}
