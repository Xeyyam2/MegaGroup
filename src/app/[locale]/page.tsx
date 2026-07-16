import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/HeroSection";
import { SectionErrorBoundary } from "@/components/SectionErrorBoundary";
import { StudyJourneyLazy } from "@/components/study-journey/StudyJourneyLazy";
import { CountryTabs } from "@/components/sections/CountryTabs";
import { CostCalculator } from "@/components/sections/CostCalculator";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { InstagramCTA } from "@/components/sections/InstagramCTA";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";
import { CountryComparisonTable } from "@/components/sections/CountryComparisonTable";
import { FadeInUp } from "@/components/motion/FadeInUp";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { getCountries } from "@/lib/data/countries";
import { getAllUniversities } from "@/lib/data/universities";
import { getTestimonials } from "@/lib/data/testimonials";
import { getGeneralFAQs } from "@/lib/data/faqs";
import { getSiteContentMap } from "@/lib/data/site-content";
import { ARTICLES } from "@/data/articles";
import { siteUrl } from "@/lib/site";
import { getCountrySeo } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import type { Country } from "@/types";

export const revalidate = 3600;
export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const titles = {
    az: "Xaricdə Təhsil — Attestatla, İmtahansız Qəbul | MegaGroup",
    ru: "Учеба за рубежом — поступление по аттестату | MegaGroup",
    en: "Study Abroad — Certificate-Based Admission | MegaGroup",
  };
  const descs = {
    az: "Xaricdə təhsil — Türkiyə, Rusiya, Gürcüstan, Ukrayna, Qazaxıstan, Almaniya, Polşa universitetlərinə attestatla, DIM imtahanı olmadan qəbul. 200+ universitet, pulsuz konsultasiya.",
    ru: "Учеба за рубежом — поступление в университеты Турции, России, Грузии, Украины, Казахстана, Германии, Польши по аттестату, без экзаменов. 200+ вузов, бесплатная консультация.",
    en: "Study abroad — admission to universities in Turkey, Russia, Georgia, Ukraine, Kazakhstan, Germany, Poland by certificate, exam-free. 200+ universities, free consultation.",
  };
  const keywords = {
    az: ["xaricdə təhsil", "türkiyədə təhsil", "rusiyada təhsil", "gürcüstanda təhsil", "ukraynada təhsil", "qazaxistanda təhsil", "avropada təhsil", "attestatla qəbul", "imtahansız xaricə", "xaricde tehsil azerbaycan", "polşada təhsil", "almaniyada təhsil"],
    ru: ["учеба за рубежом", "учеба в турции", "учеба в россии", "учеба в грузии", "учеба в украине", "учеба в казахстане", "учеба в европе", "поступление по аттестату", "без экзаменов", "поступление в польшу", "учеба в германии"],
    en: ["study abroad", "study in turkey", "study in russia", "study in georgia", "study in ukraine", "study in kazakhstan", "study in europe", "certificate admission", "study in poland", "study in germany"],
  };
  const og = { az: "az_AZ", ru: "ru_RU", en: "en_US" }[locale];
  return {
    title: titles[locale],
    description: descs[locale],
    keywords: keywords[locale],
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        az: `${siteUrl}/az`,
        ru: `${siteUrl}/ru`,
        en: `${siteUrl}/en`,
        "x-default": `${siteUrl}/az`,
      },
    },
    openGraph: {
      title: titles[locale],
      description: descs[locale],
      type: "website",
      locale: og,
      siteName: "MegaGroup",
      url: `${siteUrl}/${locale}`,
    },
    twitter: { card: "summary_large_image", title: titles[locale], description: descs[locale] },
  };
}

async function UniversitiesSection({
  locale,
  countries,
}: {
  locale: Locale;
  countries: Country[];
}) {
  const universities = await getAllUniversities(locale);
  return <CostCalculator universities={universities} countries={countries} />;
}

async function StoriesSection({ locale }: { locale: Locale }) {
  const testimonials = await getTestimonials(locale);
  return <SuccessStories testimonials={testimonials} />;
}

async function FaqSectionWithData({ locale }: { locale: Locale }) {
  const faqs = await getGeneralFAQs(locale);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FAQSection faqs={faqs} />
    </>
  );
}

// Məzmunu asılı olan bölmələr ayrı async komponentdə fetch olunur ki,
// Hero + kritik HTML dərhal stream olunsun (SEO: Googlebot ilk crawl-da
// h1 və əsas məzmunu görür; data yalnız alt Suspense sərhədlərində gəlir).
async function HomeBody({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home" });
  const tCta = await getTranslations({ locale, namespace: "cta" });
  const countries = await getCountries(locale);
  const content = await getSiteContentMap(locale);

  return (
    <>
      <section id="olkeler" className="mx-auto max-w-7xl px-6 py-16">
        <ScrollReveal className="text-center">
          <h2 className="text-balance font-heading text-3xl font-bold text-foreground">
            {content.section_countries_title || t("countriesTitle")}
          </h2>
          <p className="mt-2 text-foreground/60">{content.section_countries_subtitle || t("countriesSubtitle")}</p>
        </ScrollReveal>
        <div className="mt-8">
          <CountryTabs countries={countries} localePrefix={`/${locale}`} />
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((c, i) => {
            // AZ üçün açar sözlü anchor text (internal link gücü),
            // RU/EN üçün sadəcə ölkə adı.
            const cardTitle =
              locale === "az" ? (getCountrySeo(c.slug)?.h1 ?? c.name) : c.name;
            return (
            <FadeInUp key={c.slug} delay={i * 0.08}>
              <Link
                href={`/${locale}/xaricde-tehsil/${c.slug}`}
                className="glass shadow-brand-hover block h-full rounded-2xl p-6 text-center transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                <h3 className="font-heading text-xl font-bold text-foreground">{cardTitle}</h3>
                <p className="mt-2 text-sm text-foreground/70">{c.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-foreground/60">
                  <span>🎓 {c.quick_stats.universities}</span>
                  <span>💬 {c.quick_stats.language}</span>
                  <span>
                    💰{" "}
                    {c.quick_stats.avg_tuition_usd === 0
                      ? locale === "az"
                        ? "Pulsuz"
                        : locale === "ru"
                          ? "Бесплатно"
                          : "Free"
                      : `${c.quick_stats.avg_tuition_usd}` + (locale === "az" ? "/il" : locale === "ru" ? "/год" : "/yr")}
                  </span>
                </div>
                <span className="mt-4 inline-block text-sm font-semibold text-brand-primary">
                  {tCta("more")} →
                </span>
              </Link>
            </FadeInUp>
            );
          })}
        </div>
      </section>

      {locale === "az" && (
        <section className="mx-auto max-w-7xl px-6 py-8">
          <ScrollReveal className="text-center">
            <h2 className="text-balance font-heading text-3xl font-bold text-foreground">
              Xaricdə Təhsil — 7 Ölkə Müqayisəsi
            </h2>
            <p className="mt-2 text-foreground/60">
              Türkiyə, Rusiya, Gürcüstan, Ukrayna, Qazaxıstan, Almaniya və Polşa üzrə
              təhsil haqqı, dil, qəbul, viza və diplom tanınması bir yerdə.
            </p>
          </ScrollReveal>
          <div className="mt-8">
            <ScrollReveal direction="scale">
              <CountryComparisonTable />
            </ScrollReveal>
          </div>
        </section>
      )}

      <section id="kalkulator" className="mx-auto max-w-7xl px-6 py-16">
        <ScrollReveal className="text-center" delay={0.1}>
          <h2 className="text-balance font-heading text-3xl font-bold text-foreground">
            {content.section_calc_title || t("calcTitle")}
          </h2>
          <p className="mt-2 text-foreground/60">{content.section_calc_subtitle || t("calcSubtitle")}</p>
        </ScrollReveal>
        <div className="mt-8">
          <ScrollReveal direction="scale">
                <SectionErrorBoundary>
              <UniversitiesSection locale={locale} countries={countries} />
            </SectionErrorBoundary>
          </ScrollReveal>
        </div>
      </section>

      <section id="heqayeler" className="mx-auto max-w-7xl px-6 py-16">
        <ScrollReveal className="text-center" delay={0.1}>
          <h2 className="text-balance font-heading text-3xl font-bold text-foreground">
            {content.section_stories_title || t("storiesTitle")}
          </h2>
          <p className="mt-2 text-foreground/60">{content.section_stories_subtitle || t("storiesSubtitle")}</p>
        </ScrollReveal>
        <div className="mt-8">
          <SectionErrorBoundary>
            <StoriesSection locale={locale} />
          </SectionErrorBoundary>
        </div>
      </section>

      <InstagramCTA />

      {locale === "az" && (
        <section className="mx-auto max-w-7xl px-6 py-16">
          <ScrollReveal className="text-center" delay={0.1}>
            <h2 className="text-balance font-heading text-3xl font-bold text-foreground">Bloqdan Faydalı Yazılar</h2>
            <p className="mt-2 text-foreground/60">Ölkə seçimi, qəbul şərtləri və xərclər haqqında ətraflı bələdçilər</p>
          </ScrollReveal>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.slice(0, 3).map((a, i) => (
              <FadeInUp key={a.slug} delay={i * 0.08}>
                <Link
                  href={`/az/bloq/${a.slug}`}
                  className="glass shadow-brand-hover block h-full rounded-2xl p-6 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                >
                  <div className="text-2xl">{a.heroEmoji}</div>
                  <h3 className="mt-3 font-heading text-lg font-bold text-foreground">{a.title}</h3>
                  <p className="mt-2 text-sm text-foreground/70">{a.excerpt}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-brand-primary">Oxu →</span>
                </Link>
              </FadeInUp>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/az/bloq" className="text-sm font-semibold text-brand-primary hover:underline">
              Bütün məqalələrə bax →
            </Link>
          </div>
        </section>
      )}

      <section id="faq" className="mx-auto max-w-7xl px-6 py-16">
        <ScrollReveal className="text-center" delay={0.1}>
          <h2 className="text-balance font-heading text-3xl font-bold text-foreground">
            {content.section_faq_title || t("faqTitle")}
          </h2>
        </ScrollReveal>
        <div className="mt-8">
          <SectionErrorBoundary>
            <FaqSectionWithData locale={locale} />
          </SectionErrorBoundary>
        </div>
      </section>

      <CTASection whatsappUrl={content.contact_whatsapp} />
    </>
  );
}

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);

  // speakable — AI/səsli assistant cavabları üçün ana səhifənin ən yaxşı qısa
  // cavab hissəsi (hero başlığı + alt yazısı).
  const speakableJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${siteUrl}/${locale}`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".hero-fade-content"],
    },
  };

  // Hero dərhal render olunur (öz tərcüməsi + default statistikaları var),
  // beləcə h1 və əsas məzmun ilk HTML stream-ə düşür — data fetch-lər
  // onu bloklamır. Bu, SEO üçün kritikdir (Googlebot skelet deyil, məzmunu görür).
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }} />
      <HeroSection />

      <SectionErrorBoundary>
        <StudyJourneyLazy />
      </SectionErrorBoundary>

      {/*
        force-static (SSG) istifadə etdiyimiz üçün Suspense stream-i lazım deyil —
        bütün data build zamanı resolve olunur və məzmun birbaşa statik HTML-ə
        düşür (gizli S:0 seqmentləri YOXDUR → Googlebot hər şeyi dərhal görür).
      */}
      <HomeBody locale={locale} />
    </>
  );
}
