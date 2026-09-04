import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ARTICLES, getArticleBySlugLocalized } from "@/data/articles";
import { COUNTRY_TOPICS } from "@/data/country-topics";
import { PROGRAMS, programName } from "@/data/country-programs";
import { getCountryBySlug } from "@/lib/data/countries";
import { FadeInUp } from "@/components/motion/FadeInUp";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { CTASection } from "@/components/sections/CTASection";
import { BlogFAQ } from "@/components/sections/BlogFAQ";
import { AuthorBio } from "@/components/sections/AuthorBio";
import { CommentSection } from "@/components/sections/CommentSection";
import { siteUrl } from "@/lib/site";
import { authorPersonJsonLd, editorialAuthor } from "@/data/site-authors";
import { countryOfficialSources, officialUniversitySite } from "@/data/article-sources";
import { locales } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";

export const revalidate = 3600;
export const dynamic = "force-static";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const STR: Record<Locale, {
  notFound: string;
  minRead: string;
  updated: string;
  home: string;
  blogCrumb: string;
  faqTitle: string;
  otherGuides: string;
  relatedCta: string;
  relatedDesc: string;
  faqCitation: string;
  dateLocale: string;
  sourcesTitle: string;
  officialSite: string;
  sourcesNote: string;
}> = {
  az: {
    notFound: "Tapılmadı",
    minRead: "dəqiqəlik oxu",
    updated: "Yenilənib",
    home: "Ana Səhifə",
    blogCrumb: "Bloq",
    faqTitle: "Tez-tez Verilən Suallar",
    otherGuides: "Digər Bələdçilər",
    relatedCta: "üzrə universitetlərə bax →",
    relatedDesc: "dakı universitetlər, qəbul şərtləri və xərclər haqqında ətraflı məlumat.",
    faqCitation: "Tez-tez verilən suallar",
    dateLocale: "az-AZ",
    sourcesTitle: "Rəsmi Mənbələr",
    officialSite: "Universitetin rəsmi saytı",
    sourcesNote:
      "Qəbul, viza və diplom tanınması qaydaları dəyişə bilər — müraciət etməzdən əvvəl rəsmi mənbələrdən son vəziyyəti yoxlayın.",
  },
  ru: {
    notFound: "Не найдено",
    minRead: "минут чтения",
    updated: "Обновлено",
    home: "Главная",
    blogCrumb: "Блог",
    faqTitle: "Часто задаваемые вопросы",
    otherGuides: "Другие руководства",
    relatedCta: "— смотреть вузы →",
    relatedDesc: "Подробная информация о вузах, условиях поступления и расходах.",
    faqCitation: "Часто задаваемые вопросы",
    dateLocale: "ru-RU",
    sourcesTitle: "Официальные источники",
    officialSite: "Официальный сайт университета",
    sourcesNote:
      "Правила приёма, визы и признания дипломов могут меняться — перед подачей документов проверяйте актуальные требования на официальных сайтах.",
  },
  en: {
    notFound: "Not Found",
    minRead: "minute read",
    updated: "Updated",
    home: "Home",
    blogCrumb: "Blog",
    faqTitle: "Frequently Asked Questions",
    otherGuides: "Other Guides",
    relatedCta: "— view universities →",
    relatedDesc: "Detailed information about universities, admission requirements and costs.",
    faqCitation: "Frequently asked questions",
    dateLocale: "en-US",
    sourcesTitle: "Official sources",
    officialSite: "University official website",
    sourcesNote:
      "Admission, visa and diploma-recognition rules can change — always verify current requirements on the official sources before applying.",
  },
};

export function generateStaticParams() {
  return locales.flatMap((locale) => ARTICLES.map((a) => ({ locale, slug: a.slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const s = STR[locale] ?? STR.az;
  const article = getArticleBySlugLocalized(slug, locale);
  if (!article) return { title: s.notFound };
  const alternates: Record<string, string> = {};
  for (const l of locales) alternates[l] = `${siteUrl}/${l}/bloq/${article.slug}`;
  alternates["x-default"] = `${siteUrl}/az/bloq/${article.slug}`;
  return {
    title: `${article.title} | MegaGroup`,
    description: article.metaDescription,
    keywords: article.keywords,
    alternates: { canonical: `${siteUrl}/${locale}/bloq/${article.slug}`, languages: alternates },
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      type: "article",
      url: `${siteUrl}/${locale}/bloq/${article.slug}`,
      modifiedTime: article.updatedAt,
      locale: locale === "az" ? "az_AZ" : locale === "ru" ? "ru_RU" : "en_US",
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const s = STR[locale] ?? STR.az;

  const article = getArticleBySlugLocalized(slug, locale);
  if (!article) notFound();

  const relatedCountry = article.relatedCountrySlug
    ? await getCountryBySlug(article.relatedCountrySlug, locale)
    : null;

  // Əlaqəli bələdçilər: əvvəlcə EYNİ ölkənin digər bələdçiləri (topik
  // klaster + internal linking gücü), sonra qalanlar. Əvvəlki versiya
  // sadəcə ilk 4 məqaləni götürürdü — çox vaxt əlaqəsiz idi.
  const otherPool = ARTICLES.filter((a) => a.slug !== article.slug);
  const sameCountry =
    article.relatedCountrySlug
      ? otherPool.filter((a) => a.relatedCountrySlug === article.relatedCountrySlug)
      : [];
  const otherArticles = [...sameCountry, ...otherPool.filter((a) => !sameCountry.includes(a))].slice(0, 4);

  // Rəsmi mənbələr: universitetin öz saytı + ölkənin dövlət qurumları.
  const sources: { name: string; url: string }[] = [];
  const uniSite = officialUniversitySite(article.slug);
  if (uniSite) sources.push({ name: s.officialSite, url: uniSite.url });
  sources.push(...countryOfficialSources(article.relatedCountrySlug));

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: s.home, item: `${siteUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name: s.blogCrumb, item: `${siteUrl}/${locale}/bloq` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${siteUrl}/${locale}/bloq/${article.slug}` },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: article.title,
    description: article.metaDescription,
    provider: { "@type": "Organization", name: "MegaGroup", url: siteUrl },
  };

  const authorPerson = authorPersonJsonLd(locale);

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.metaDescription,
    keywords: article.keywords.join(", "),
    dateModified: article.updatedAt,
    datePublished: article.publishedAt,
    inLanguage: locale,
    author: authorPerson,
    publisher: {
      "@type": "Organization",
      name: "MegaGroup",
      url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/icons/icon-512.png` },
    },
    mainEntityOfPage: `${siteUrl}/${locale}/bloq/${article.slug}`,
    citation: article.faqs.length
      ? { "@type": "CreativeWork", name: `${article.title} — ${s.faqCitation}` }
      : undefined,
  };

  const personJsonLd = { "@context": "https://schema.org", ...authorPerson };

  const speakableJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${siteUrl}/${locale}/bloq/${article.slug}`,
    speakable: { "@type": "SpeakableSpecification", cssSelector: [".article-intro-summary", ".article-answer"] },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }} />

      <article className="mx-auto max-w-3xl px-6 py-20">
        <nav className="mb-8 flex items-center gap-2 text-xs text-foreground/50" aria-label="Breadcrumb">
          <Link href={`/${locale}`} className="hover:text-brand-primary">
            {s.home}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/bloq`} className="hover:text-brand-primary">
            {s.blogCrumb}
          </Link>
          <span>/</span>
          <span className="text-foreground/70">{article.title}</span>
        </nav>

        <div className="text-4xl">{article.heroEmoji}</div>
        <h1 className="text-balance mt-4 font-heading text-3xl font-extrabold text-foreground sm:text-5xl">
          {article.title}
        </h1>
        <div className="mt-4 flex items-center gap-3 text-sm text-foreground/50">
          <span>{article.readingMinutes} {s.minRead}</span>
          <span>·</span>
          <span>{s.updated}: {new Date(article.updatedAt).toLocaleDateString(s.dateLocale)}</span>
          <span>·</span>
          <span itemProp="author">{editorialAuthor.name}</span>
        </div>

        <div className="article-intro-summary mt-8 space-y-4 text-lg leading-relaxed text-foreground/85">
          {article.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-10 space-y-10">
          {article.sections.map((section, i) => (
            <ScrollReveal key={section.heading} delay={i * 0.05}>
              <h2 className="font-heading text-2xl font-bold text-foreground">{section.heading}</h2>
              {section.summary && (
                <p className="article-answer mt-3 border-l-2 border-brand-primary/60 pl-4 text-base font-medium leading-relaxed text-foreground">
                  {section.summary}
                </p>
              )}
              <div className="mt-3 space-y-3 text-foreground/80">
                {section.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
                {section.list && (
                  <ul className="mt-2 space-y-2">
                    {section.list.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 text-brand-primary">✦</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.table && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-white/15">
                          {section.table.headers.map((h) => (
                            <th key={h} className="px-4 py-2 text-left font-semibold text-foreground">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row, ri) => (
                          <tr key={ri} className="border-b border-white/5">
                            {row.map((cell, ci) => (
                              <td key={ci} className="px-4 py-2 text-foreground/80">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>

        {relatedCountry && (
          <FadeInUp>
            <Link
              href={`/${locale}/xaricde-tehsil/${relatedCountry.slug}`}
              className="glass shadow-brand-hover mt-12 block rounded-2xl p-6 transition-colors hover:bg-white/10"
            >
              <span className="text-sm font-semibold text-brand-primary">
                {relatedCountry.name} {s.relatedCta}
              </span>
              <p className="mt-1 text-sm text-foreground/70">
                {relatedCountry.name}
                {s.relatedDesc}
              </p>
            </Link>
          </FadeInUp>
        )}

        <div className="mt-14">
          <h2 className="font-heading text-2xl font-bold text-foreground">{s.faqTitle}</h2>
          <div className="mt-6">
            <BlogFAQ faqs={article.faqs} />
          </div>
        </div>

        {/* seo.md 5.5 (P2): UGC sual-cavab — moderasiyalı şərh bölməsi. */}
        <div className="mt-6">
          <CommentSection articleSlug={article.slug} locale={locale} />
        </div>

        {sources.length > 0 && (
          <section className="mt-14">
            <h2 className="font-heading text-2xl font-bold text-foreground">{s.sourcesTitle}</h2>
            <p className="mt-2 text-sm text-foreground/60">{s.sourcesNote}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {sources.map((src) => (
                <li key={src.url} className="flex items-start gap-2 text-foreground/80">
                  <span aria-hidden>🔗</span>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-brand-primary hover:underline"
                  >
                    {src.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <AuthorBio locale={locale} />

        {/* seo.md 4 (P2): Əlaqəli səhifələr — məqalənin ölkəsinin silo topic-ləri
            + ixtisas səhifələri. Bloqdan saytın struktur səhifələrinə kross-link
            (PageRank yayma + crawler-in dərin səhifələri kəşf etməsi). */}
        {relatedCountry && (
          <div className="mt-12">
            <h2 className="font-heading text-2xl font-bold text-foreground">
              {locale === "az" ? "Əlaqəli səhifələr" : locale === "ru" ? "Связанные страницы" : "Related pages"}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {COUNTRY_TOPICS.map((t) => (
                <Link
                  key={t.slug}
                  href={`/${locale}/xaricde-tehsil/${relatedCountry.slug}/${t.slug}`}
                  className="glass rounded-full px-4 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-white/10 hover:text-foreground"
                >
                  {t.slug === "universitetler"
                    ? locale === "az" ? `${relatedCountry.name} universitetləri` : locale === "ru" ? `Университеты ${relatedCountry.name_ru}` : `${relatedCountry.name_en} universities`
                    : t.slug === "tibb"
                      ? locale === "az" ? "Tibb təhsili" : locale === "ru" ? "Медицина" : "Medical education"
                      : t.slug === "attestatla-qebul"
                        ? locale === "az" ? "Attestatla qəbul" : locale === "ru" ? "По аттестату" : "Certificate admission"
                        : t.slug === "tehsil-haqqi"
                          ? locale === "az" ? "Təhsil haqqı" : locale === "ru" ? "Стоимость" : "Tuition fees"
                          : t.slug === "teqaud"
                            ? locale === "az" ? "Təqaüdlər" : locale === "ru" ? "Стипендии" : "Scholarships"
                            : locale === "az" ? "Yaşayış xərcləri" : locale === "ru" ? "Расходы на проживание" : "Living costs"}
                </Link>
              ))}
              {PROGRAMS.map((p) => (
                <Link
                  key={p.slug}
                  href={`/${locale}/xaricde-tehsil/${relatedCountry.slug}/ixtisas/${p.slug}`}
                  className="glass rounded-full px-4 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-white/10 hover:text-foreground"
                >
                  {locale === "az" ? `${relatedCountry.name} ${programName(p, locale)}` : programName(p, locale)}
                </Link>
              ))}
            </div>
          </div>
        )}

        {otherArticles.length > 0 && (
          <div className="mt-14">
            <h2 className="font-heading text-2xl font-bold text-foreground">{s.otherGuides}</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {otherArticles.map((a) => {
                const localized = getArticleBySlugLocalized(a.slug, locale) ?? a;
                return (
                  <Link
                    key={a.slug}
                    href={`/${locale}/bloq/${a.slug}`}
                    className="glass shadow-brand-hover block h-full rounded-2xl p-5 transition-colors hover:bg-white/10"
                  >
                    <div className="text-2xl">{localized.heroEmoji}</div>
                    <h3 className="mt-2 font-heading text-base font-bold text-foreground">{localized.title}</h3>
                    <p className="mt-1 text-sm text-foreground/70">{localized.excerpt}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </article>

      <CTASection />
    </>
  );
}
