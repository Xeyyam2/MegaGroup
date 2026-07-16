import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ARTICLES, getArticleBySlug } from "@/data/articles";
import { getCountryBySlug } from "@/lib/data/countries";
import { FadeInUp } from "@/components/motion/FadeInUp";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { CTASection } from "@/components/sections/CTASection";
import { BlogFAQ } from "@/components/sections/BlogFAQ";
import { AuthorBio } from "@/components/sections/AuthorBio";
import { siteUrl } from "@/lib/site";
import { authorPersonJsonLd, editorialAuthor } from "@/data/site-authors";
import type { Locale } from "@/i18n/routing";

export const revalidate = 3600;
export const dynamic = "force-static";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ locale: "az", slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== "az") return {};
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Tapılmadı" };
  return {
    title: `${article.title} | MegaGroup`,
    description: article.metaDescription,
    keywords: article.keywords,
    alternates: { canonical: `${siteUrl}/az/bloq/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      type: "article",
      url: `${siteUrl}/az/bloq/${article.slug}`,
      modifiedTime: article.updatedAt,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  if (locale !== "az") notFound();
  setRequestLocale(locale);

  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const relatedCountry = article.relatedCountrySlug
    ? await getCountryBySlug(article.relatedCountrySlug, locale)
    : null;

  // Cross-link the other cornerstone SEO articles — strengthens the
  // "study abroad" topical cluster and keeps visitors moving between the
  // exact-match keyword pages (turkiyede-tehsil, rusiyada-tehsil, etc.).
  const otherArticles = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 4);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Səhifə", item: `${siteUrl}/az` },
      { "@type": "ListItem", position: 2, name: "Bloq", item: `${siteUrl}/az/bloq` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${siteUrl}/az/bloq/${article.slug}` },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: article.title,
    description: article.metaDescription,
    provider: { "@type": "Organization", name: "MegaGroup", url: siteUrl },
  };

  // Müəllif artıq `Organization` deyil, `Person`-dur (E-E-A-T).
  const authorPerson = authorPersonJsonLd(locale === "az" ? "az" : locale === "ru" ? "ru" : "en");

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.metaDescription,
    keywords: article.keywords.join(", "),
    dateModified: article.updatedAt,
    datePublished: article.updatedAt,
    author: authorPerson,
    publisher: {
      "@type": "Organization",
      name: "MegaGroup",
      url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/icons/icon-512.png` },
    },
    mainEntityOfPage: `${siteUrl}/az/bloq/${article.slug}`,
    citation: article.faqs.length
      ? {
          "@type": "CreativeWork",
          name: `${article.title} — Tez-tez verilən suallar`,
        }
      : undefined,
  };

  // Ayrıca `Person` obyekti — Google entity tanıması üçün tək başına da
  // mövcud olmalıdır (BlogPosting.author referansı kifayət deyil).
  const personJsonLd = {
    "@context": "https://schema.org",
    ...authorPerson,
  };

  // speakable — AI/səsli cavablar üçün ən yaxşı qısa cavab (intro).
  const speakableJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${siteUrl}/az/bloq/${article.slug}`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".article-intro-summary", ".article-answer"],
    },
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
          <Link href="/az" className="hover:text-brand-primary">
            Ana Səhifə
          </Link>
          <span>/</span>
          <Link href="/az/bloq" className="hover:text-brand-primary">
            Bloq
          </Link>
          <span>/</span>
          <span className="text-foreground/70">{article.title}</span>
        </nav>

        <div className="text-4xl">{article.heroEmoji}</div>
        <h1 className="text-balance mt-4 font-heading text-3xl font-extrabold text-foreground sm:text-5xl">
          {article.title}
        </h1>
        <div className="mt-4 flex items-center gap-3 text-sm text-foreground/50">
          <span>{article.readingMinutes} dəqiqəlik oxu</span>
          <span>·</span>
          <span>Yenilənib: {new Date(article.updatedAt).toLocaleDateString("az-AZ")}</span>
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
              href={`/az/xaricde-tehsil/${relatedCountry.slug}`}
              className="glass shadow-brand-hover mt-12 block rounded-2xl p-6 transition-colors hover:bg-white/10"
            >
              <span className="text-sm font-semibold text-brand-primary">
                {relatedCountry.name} üzrə universitetlərə bax →
              </span>
              <p className="mt-1 text-sm text-foreground/70">
                {relatedCountry.name}dəki universitetlər, qəbul şərtləri və xərclər haqqında ətraflı məlumat.
              </p>
            </Link>
          </FadeInUp>
        )}

        <div className="mt-14">
          <h2 className="font-heading text-2xl font-bold text-foreground">Tez-tez Verilən Suallar</h2>
          <div className="mt-6">
            <BlogFAQ faqs={article.faqs} />
          </div>
        </div>

        <AuthorBio locale={locale} />

        {otherArticles.length > 0 && (
          <div className="mt-14">
            <h2 className="font-heading text-2xl font-bold text-foreground">Digər Bələdçilər</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {otherArticles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/az/bloq/${a.slug}`}
                  className="glass shadow-brand-hover block h-full rounded-2xl p-5 transition-colors hover:bg-white/10"
                >
                  <div className="text-2xl">{a.heroEmoji}</div>
                  <h3 className="mt-2 font-heading text-base font-bold text-foreground">{a.title}</h3>
                  <p className="mt-1 text-sm text-foreground/70">{a.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <CTASection />
    </>
  );
}
