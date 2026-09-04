import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { getLocalizedArticles } from "@/data/articles";
import { FadeInUp } from "@/components/motion/FadeInUp";
import { siteUrl } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export const revalidate = 3600;
export const dynamic = "force-static";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const META: Record<Locale, { title: string; h1: string; subtitle: string; minRead: string; read: string; home: string; blogCrumb: string; dateLocale: string }> = {
  az: {
    title: "Xaricdə Təhsil Bloqu — Ölkələr, Universitetlər və Qəbul Bələdçiləri",
    h1: "Xaricdə Təhsil Bloqu",
    subtitle:
      "Ölkə seçimi, qəbul şərtləri, xərclər və sənəd prosesi haqqında ətraflı, faydalı bələdçilər — hamısı MegaGroup komandasının real təcrübəsinə əsaslanır.",
    minRead: "dəq oxu",
    read: "Oxu →",
    home: "Ana Səhifə",
    blogCrumb: "Bloq",
    dateLocale: "az-AZ",
  },
  ru: {
    title: "Блог об учёбе за рубежом — страны, вузы и руководства по поступлению",
    h1: "Блог об учёбе за рубежом",
    subtitle:
      "Подробные и полезные руководства о выборе страны, условиях поступления, расходах и документах — основанные на реальном опыте команды MegaGroup.",
    minRead: "мин чтения",
    read: "Читать →",
    home: "Главная",
    blogCrumb: "Блог",
    dateLocale: "ru-RU",
  },
  en: {
    title: "Study Abroad Blog — Countries, Universities & Admission Guides",
    h1: "Study Abroad Blog",
    subtitle:
      "Detailed, practical guides on choosing a country, admission requirements, costs and documents — all based on the real experience of the MegaGroup team.",
    minRead: "min read",
    read: "Read →",
    home: "Home",
    blogCrumb: "Blog",
    dateLocale: "en-US",
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const m = META[locale as Locale] ?? META.az;
  return {
    title: `${m.title} | MegaGroup`,
    alternates: {
      canonical: `${siteUrl}/${locale}/bloq`,
      languages: {
        az: `${siteUrl}/az/bloq`,
        ru: `${siteUrl}/ru/bloq`,
        en: `${siteUrl}/en/bloq`,
        "x-default": `${siteUrl}/az/bloq`,
      },
    },
    openGraph: {
      title: m.title,
      type: "website",
      url: `${siteUrl}/${locale}/bloq`,
    },
  };
}

export default async function BlogIndexPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  setRequestLocale(locale);
  const m = META[locale] ?? META.az;
  const articles = getLocalizedArticles(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: m.home, item: `${siteUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name: m.blogCrumb, item: `${siteUrl}/${locale}/bloq` },
    ],
  };

  // ItemList — bütün məqalələrin siyahısı (AI çıxarışı və zəngin nəticələr üçün).
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: m.h1,
    numberOfItems: articles.length,
    itemListElement: articles.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.title,
      url: `${siteUrl}/${locale}/bloq/${a.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h1 className="text-balance font-heading text-4xl font-extrabold text-foreground sm:text-5xl">
          {m.h1}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-foreground/70">{m.subtitle}</p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {articles.map((a, i) => (
            <FadeInUp key={a.slug} delay={i * 0.08}>
              <Link
                href={`/${locale}/bloq/${a.slug}`}
                className="glass shadow-brand-hover block h-full rounded-2xl p-6 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                <div className="text-3xl">{a.heroEmoji}</div>
                <h2 className="mt-3 font-heading text-xl font-bold text-foreground">{a.title}</h2>
                <p className="mt-2 text-sm text-foreground/70">{a.excerpt}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-foreground/50">
                  <span>{a.readingMinutes} {m.minRead}</span>
                  <span>·</span>
                  <span>{new Date(a.updatedAt).toLocaleDateString(m.dateLocale)}</span>
                </div>
                <span className="mt-4 inline-block text-sm font-semibold text-brand-primary">{m.read}</span>
              </Link>
            </FadeInUp>
          ))}
        </div>
      </section>
    </>
  );
}
