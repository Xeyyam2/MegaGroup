import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { CTASection } from "@/components/sections/CTASection";
import { STATISTICS } from "@/data/statistics";
import { siteUrl } from "@/lib/site";
import type { Locale } from "@/types";

export const revalidate = 3600;

const LBL = {
  az: {
    h1: "Xaricdə Təhsil Statistikası 2026 — Real Rəqəmlər",
    title: "Xaricdə Təhsil Statistikası 2026 — Real Rəqəmlər və Analiz | MegaGroup",
    meta: "Xaricdə təhsil üzrə orijinal statistika: orta təhsil haqqı, ən sərfəli universitet və ölkələr, tibb və ingilis dilli proqramların payı — hamısı real datadan hesablanıb.",
    headlineTitle: "Əsas göstəricilər",
    methodology: "Hesablama üsulu",
    budgetTitle: "Ölkələr üzrə illik ümumi büdcə (USD)",
    budgetColCountry: "Ölkə",
    budgetColAnnual: "İllik büdcə (təhsil + yaşayış)",
    tableTitle: "Universitetlər üzrə təhsil haqqı (ən ucuzdan bahaya)",
    colUni: "Universitet",
    colCity: "Şəhər",
    colCountry: "Ölkə",
    colTuition: "Təhsil haqqı (USD/il)",
    colBudget: "Ümumi illik büdcə",
    generatedNote: STATISTICS.generatedNote.az,
  },
  ru: {
    h1: "Статистика учёбы за рубежом 2026 — реальные цифры",
    title: "Статистика учёбы за рубежом 2026 — реальные данные | MegaGroup",
    meta: "Оригинальная статистика по учёбе за рубежом: средняя стоимость обучения, самые доступные университеты и страны, доля медицинских и англоязычных программ — всё рассчитано на реальных данных.",
    headlineTitle: "Ключевые показатели",
    methodology: "Методика расчёта",
    budgetTitle: "Годовой общий бюджет по странам (USD)",
    budgetColCountry: "Страна",
    budgetColAnnual: "Годовой бюджет (обучение + проживание)",
    tableTitle: "Стоимость обучения по университетам (от cheapest до самых дорогих)",
    colUni: "Университет",
    colCity: "Город",
    colCountry: "Страна",
    colTuition: "Стоимость обучения (USD/год)",
    colBudget: "Общий годовой бюджет",
    generatedNote: STATISTICS.generatedNote.ru,
  },
  en: {
    h1: "Study Abroad Statistics 2026 — Real Figures",
    title: "Study Abroad Statistics 2026 — Real Data & Analysis | MegaGroup",
    meta: "Original study-abroad statistics: average tuition, most affordable universities and countries, share of medical and English-taught programs — all computed from real data.",
    headlineTitle: "Key figures",
    methodology: "Methodology",
    budgetTitle: "Total annual budget by country (USD)",
    budgetColCountry: "Country",
    budgetColAnnual: "Annual budget (tuition + living)",
    tableTitle: "Tuition by university (cheapest to most expensive)",
    colUni: "University",
    colCity: "City",
    colCountry: "Country",
    colTuition: "Tuition (USD/yr)",
    colBudget: "Total annual budget",
    generatedNote: STATISTICS.generatedNote.en,
  },
} as const;

const COUNTRY_NAMES: Record<string, Record<Locale, string>> = {
  turkiye: { az: "Türkiyə", ru: "Турция", en: "Turkey" },
  rusiya: { az: "Rusiya", ru: "Россия", en: "Russia" },
  ukrayna: { az: "Ukrayna", ru: "Украина", en: "Ukraine" },
  gurcustan: { az: "Gürcüstan", ru: "Грузия", en: "Georgia" },
  qazaxistan: { az: "Qazaxıstan", ru: "Казахстан", en: "Kazakhstan" },
  almaniya: { az: "Almaniya", ru: "Германия", en: "Germany" },
  polsa: { az: "Polşa", ru: "Польша", en: "Poland" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale as Locale) || "az";
  const l = LBL[locale];
  const path = "statistika";
  return {
    title: l.title,
    description: l.meta,
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
      title: l.title,
      description: l.meta,
      type: "website",
      locale: locale === "az" ? "az_AZ" : locale === "ru" ? "ru_RU" : "en_US",
      siteName: "MegaGroup",
      url: `${siteUrl}/${locale}/${path}`,
    },
    twitter: { card: "summary_large_image", title: l.title, description: l.meta },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale as Locale) || "az";
  setRequestLocale(locale);
  const l = LBL[locale];
  const h = STATISTICS.headline;
  const year = new Date().getFullYear();

  const entries: [string, { value: string; method: Record<Locale, string> }][] = [
    [locale === "ru" ? "Средняя годовая стоимость обучения" : locale === "en" ? "Average annual tuition" : "Orta illik təhsil haqqı", h.avgTuition],
    [locale === "ru" ? "Самый доступный университет" : locale === "en" ? "Most affordable university" : "Ən sərfəli universitet", h.cheapestUniversity],
    [locale === "ru" ? "Самый дорогой университет" : locale === "en" ? "Most expensive university" : "Ən bahalı universitet", h.priciestUniversity],
    [locale === "ru" ? "Доля вузов дешевле $3 000/год" : locale === "en" ? "Universities under $3,000/yr" : "$3,000-dan ucuz universitetlərin payı", h.under3kShare],
    [locale === "ru" ? "Доля медицинских программ" : locale === "en" ? "Medical programs share" : "Tibb proqramlarının payı", h.medicalShare],
    [locale === "ru" ? "Доля программ на английском" : locale === "en" ? "English-taught share" : "İngilis dilli proqramların payı", h.englishShare],
    [locale === "ru" ? "Самая бюджетная страна" : locale === "en" ? "Most affordable country" : "Ən sərfəli ölkə", h.cheapestCountry],
    [locale === "ru" ? "Самая дорогая страна" : locale === "en" ? "Most expensive country" : "Ən bahalı ölkə", h.priciestCountry],
  ];

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `MegaGroup Study-Abroad Cost Statistics ${year}`,
    description: l.meta,
    url: `${siteUrl}/${locale}/statistika`,
    creator: { "@type": "Organization", name: "MegaGroup", url: siteUrl },
    temporalCoverage: `${year}`,
    spatialCoverage: "Azerbaijan (students from), 7 destination countries",
    variableMeasured: [
      "annual tuition (USD)",
      "dormitory cost (USD/month)",
      "food cost (USD/month)",
      "total annual budget (USD)",
      "share of English-taught faculties",
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${siteUrl}/${locale}/statistika`,
    name: l.h1,
    description: l.meta,
    inLanguage: locale,
  };

  const faqs = [
    {
      q:
        locale === "ru"
          ? `Сколько в среднем стоит учёба за рубежом для азербайджанского студента?`
          : locale === "en"
            ? `How much does studying abroad cost on average for an Azerbaijani student?`
            : `Azərbaycanlı tələbə üçün xaricdə təhsil orta nə qədərə başa gəlir?`,
      a:
        locale === "ru"
          ? `Средняя годовая стоимость обучения в 14 партнёрских университетах MegaGroup составляет ${h.avgTuition.value}. Полный годовой бюджет (обучение + проживание) варьируется от ${STATISTICS.countryBudgets[0].annualUsd.toLocaleString("en-US")} USD (${STATISTICS.countryBudgets[0].nameByLocale[locale]}) до ${STATISTICS.countryBudgets[STATISTICS.countryBudgets.length - 1].annualUsd.toLocaleString("en-US")} USD (${STATISTICS.countryBudgets[STATISTICS.countryBudgets.length - 1].nameByLocale[locale]}) в зависимости от страны.`
          : locale === "en"
            ? `The average annual tuition across MegaGroup's 14 partner universities is ${h.avgTuition.value}. The full annual budget (tuition + living) ranges from ${STATISTICS.countryBudgets[0].annualUsd.toLocaleString("en-US")} USD (${STATISTICS.countryBudgets[0].nameByLocale[locale]}) to ${STATISTICS.countryBudgets[STATISTICS.countryBudgets.length - 1].annualUsd.toLocaleString("en-US")} USD (${STATISTICS.countryBudgets[STATISTICS.countryBudgets.length - 1].nameByLocale[locale]}), depending on the country.`
            : `MegaGroup-un 14 tərəfdaş universitetində orta illik təhsil haqqı ${h.avgTuition.value} təşkil edir. Tam illik büdcə (təhsil + yaşayış) ölkədən asılı olaraq ${STATISTICS.countryBudgets[0].annualUsd.toLocaleString("en-US")} USD (${STATISTICS.countryBudgets[0].nameByLocale[locale]}) ilə ${STATISTICS.countryBudgets[STATISTICS.countryBudgets.length - 1].annualUsd.toLocaleString("en-US")} USD (${STATISTICS.countryBudgets[STATISTICS.countryBudgets.length - 1].nameByLocale[locale]}) arasında dəyişir.`,
    },
    {
      q:
        locale === "ru"
          ? `Какая страна самая доступная для учёбы из Азербайджана?`
          : locale === "en"
            ? `Which country is the most affordable to study in from Azerbaijan?`
            : `Azərbaycandan oxumaq üçün ən sərfəli ölkə hansıdır?`,
      a:
        locale === "ru"
          ? `${STATISTICS.countryBudgets[0].nameByLocale[locale]} — самая доступная: примерно ${STATISTICS.countryBudgets[0].annualUsd.toLocaleString("en-US")} USD в год (обучение + проживание) по данным партнёрских вузов MegaGroup.`
          : locale === "en"
            ? `${STATISTICS.countryBudgets[0].nameByLocale[locale]} is the most affordable: about ${STATISTICS.countryBudgets[0].annualUsd.toLocaleString("en-US")} USD per year (tuition + living) based on MegaGroup partner-university data.`
            : `${STATISTICS.countryBudgets[0].nameByLocale[locale]} ən sərfəlidir: MegaGroup tərəfdaş universitetlərinin datasına görə təxminən ${STATISTICS.countryBudgets[0].annualUsd.toLocaleString("en-US")} USD/il (təhsil + yaşayış).`,
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const money = (n: number) => `$${n.toLocaleString("en-US")}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 pt-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-foreground/50">
          <li>
            <Link href={`/${locale}/xaricde-tehsil`} className="hover:text-brand-primary">
              {locale === "az" ? "Xaricdə Təhsil" : locale === "ru" ? "Учёба за рубежом" : "Study Abroad"}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground/70">
            {locale === "az" ? "Statistika" : locale === "ru" ? "Статистика" : "Statistics"}
          </li>
        </ol>
      </nav>

      <section className="mx-auto max-w-3xl px-6 pt-12">
        <h1 className="text-balance font-heading text-4xl font-extrabold text-foreground sm:text-5xl">{l.h1}</h1>
        <p className="mt-4 text-sm text-foreground/60">{l.generatedNote}</p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="font-heading text-3xl font-bold text-foreground">{l.headlineTitle}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {entries.map(([label, entry]) => (
            <div key={label} className="glass rounded-2xl p-5">
              <div className="text-sm text-foreground/60">{label}</div>
              <div className="mt-1 font-heading text-xl font-bold text-foreground">{entry.value}</div>
              <p className="mt-2 text-xs text-foreground/50">
                {l.methodology}: {entry.method[locale]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-8">
        <h2 className="font-heading text-3xl font-bold text-foreground">{l.budgetTitle}</h2>
        <div className="glass mt-6 overflow-x-auto rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-foreground/70">
              <tr>
                <th className="px-5 py-3">{l.budgetColCountry}</th>
                <th className="px-5 py-3">{l.budgetColAnnual}</th>
              </tr>
            </thead>
            <tbody>
              {STATISTICS.countryBudgets.map((c) => (
                <tr key={c.slug} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3 font-medium text-foreground">{c.nameByLocale[locale]}</td>
                  <td className="px-5 py-3 text-foreground/80">{money(c.annualUsd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-8">
        <h2 className="font-heading text-3xl font-bold text-foreground">{l.tableTitle}</h2>
        <div className="glass mt-6 overflow-x-auto rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-foreground/70">
              <tr>
                <th className="px-5 py-3">{l.colUni}</th>
                <th className="px-5 py-3">{l.colCity}</th>
                <th className="px-5 py-3">{l.colCountry}</th>
                <th className="px-5 py-3">{l.colTuition}</th>
                <th className="px-5 py-3">{l.colBudget}</th>
              </tr>
            </thead>
            <tbody>
              {STATISTICS.universityTuitionTable.map((u) => (
                <tr key={u.slug} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3">
                    <Link
                      href={`/${locale}/xaricde-tehsil/${u.countrySlug}/${u.slug}`}
                      className="font-medium text-foreground hover:text-brand-primary"
                    >
                      {u.name_az}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-foreground/70">{u.city_az}</td>
                  <td className="px-5 py-3 text-foreground/70">{COUNTRY_NAMES[u.countrySlug]?.[locale] ?? u.countrySlug}</td>
                  <td className="px-5 py-3 text-foreground/80">
                    {money(u.tuitionMin)}–{money(u.tuitionMax)}
                  </td>
                  <td className="px-5 py-3 text-foreground/80">{money(u.annualUsd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-8">
        <h2 className="font-heading text-3xl font-bold text-foreground">{l.h1 ? (locale === "ru" ? "Часто задаваемые вопросы" : locale === "en" ? "FAQ" : "Tez-tez Verilən Suallar") : ""}</h2>
        <div className="mt-8 space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="glass rounded-xl p-5">
              <h3 className="font-semibold text-foreground">{f.q}</h3>
              <p className="mt-2 text-sm text-foreground/75">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
