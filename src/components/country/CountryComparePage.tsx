import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { CTASection } from "@/components/sections/CTASection";
import { siteUrl } from "@/lib/site";
import { ruCountryForms } from "@/data/country-topics";
import type { Locale } from "@/types";
import {
  COMPARE_SNAPSHOTS,
  COMPARE_UI,
  COMPARE_COUNTRY_NAMES,
  VISA_LABELS,
  computeVerdict,
  getPairIntro,
  allComparePairs,
  type CompareSnapshot,
} from "@/data/country-compare";

export const revalidate = 3600;

interface ComparePageProps {
  locale: Locale;
  pairSlug: string;
}

const money = (n: number) => `$${n.toLocaleString("en-US")}`;
const range = (min: number, max: number) =>
  min === max ? money(min) : min === 0 ? `${money(0)} – ${money(max)}` : `${money(min)} – ${money(max)}`;

function SnapshotRow({
  label,
  aVal,
  bVal,
  highlight,
}: {
  label: string;
  aVal: React.ReactNode;
  bVal: React.ReactNode;
  highlight?: "a" | "b" | undefined;
}) {
  return (
    <tr className="border-b border-white/5 last:border-0">
      <td className="px-5 py-3 text-foreground/70">{label}</td>
      <td className={`px-5 py-3 font-medium ${highlight === "a" ? "text-green-400" : "text-foreground"}`}>{aVal}</td>
      <td className={`px-5 py-3 font-medium ${highlight === "b" ? "text-green-400" : "text-foreground"}`}>{bVal}</td>
    </tr>
  );
}

export async function CountryComparePage({ locale, pairSlug }: ComparePageProps) {
  setRequestLocale(locale);
  const parsed = pairSlug.match(/^([a-z]+)-vs-([a-z]+)$/);
  const aSlug = parsed?.[1];
  const bSlug = parsed?.[2];
  const a = aSlug ? COMPARE_SNAPSHOTS[aSlug] : undefined;
  const b = bSlug ? COMPARE_SNAPSHOTS[bSlug] : undefined;
  if (!a || !b) throw new Error(`Invalid pair: ${pairSlug}`);

  const ui = COMPARE_UI[locale];
  const year = new Date().getFullYear();
  const nameA = COMPARE_COUNTRY_NAMES[a.slug][locale];
  const nameB = COMPARE_COUNTRY_NAMES[b.slug][locale];
  // RU-da genitive formalar — "Сравнение Турции и Германии" kimi qrammatik düzgün mətn.
  const genA = locale === "ru" ? ruCountryForms(a.slug, nameA).gen : nameA;
  const genB = locale === "ru" ? ruCountryForms(b.slug, nameB).gen : nameB;
  const copy = getPairIntro(pairSlug, locale);

  const basePath = "xaricde-tehsil/muqayise";
  const v = computeVerdict(a, b);

  // İngilis dilli proqram səviyyəsində status — hər ölkə üçün.
  const engLabel = (s: CompareSnapshot) => (s.hasEnglish ? ui.onlyB : "—");

  const faqs = [
    {
      q:
        locale === "ru"
          ? `${nameA} и ${nameB}: где дешевле учиться?`
          : locale === "en"
            ? `${nameA} or ${nameB}: where is studying cheaper?`
            : `${nameA} yoxsa ${nameB}: harada oxumaq daha ucuzdur?`,
      a:
        locale === "ru"
          ? `По общему годовому бюджету (обучение + проживание) ${v.cheaperSlug === "a" ? nameA : v.cheaperSlug === "b" ? nameB : "обе страны"} выгоднее: примерно ${money(Math.min(v.annualTotalA, v.annualTotalB))} против ${money(Math.max(v.annualTotalA, v.annualTotalB))} в год. Цифры включают среднюю стоимость обучения, общежитие и питание.`
          : locale === "en"
            ? `By total annual budget (tuition + living) ${v.cheaperSlug === "a" ? nameA : v.cheaperSlug === "b" ? nameB : "both countries"} come out cheaper: about ${money(Math.min(v.annualTotalA, v.annualTotalB))} vs ${money(Math.max(v.annualTotalA, v.annualTotalB))} per year. Figures include average tuition, dormitory and food.`
            : `Ümumi illik büdcəyə görə (təhsil + yaşayış) ${v.cheaperSlug === "a" ? nameA : v.cheaperSlug === "b" ? nameB : "hər iki ölkə"} daha sərfəlidir: təxminən ${money(Math.min(v.annualTotalA, v.annualTotalB))} против ${money(Math.max(v.annualTotalA, v.annualTotalB))} — illik. Rəqəmlərə orta təhsil haqqı, yataqxana və qida daxildir.`,
    },
    {
      q:
        locale === "ru"
          ? `В ${nameA} и ${nameB} возможно ли поступление по аттестату?`
          : locale === "en"
            ? `In ${nameA} and ${nameB}, is certificate-based admission possible?`
            : `${nameA} və ${nameB}-də attestatla qəbul mümkündürmü?`,
      a:
        locale === "ru"
          ? `${nameA}: ${a.certificateAdmission ? "да" : "нет — требуется подготовка (Studienkolleg) и экзамены"}. ${nameB}: ${b.certificateAdmission ? "да" : "нет — требуется подготовка (Studienkolleg) и экзамены"}. ${nameA === "Германия" || nameB === "Германия" ? "Для Германии требуется Studienkolleg и знание языка уровня B2–C1." : ""}`
          : locale === "en"
            ? `${nameA}: ${a.certificateAdmission ? "yes" : "no — preparation (Studienkolleg) and exams are required"}. ${nameB}: ${b.certificateAdmission ? "yes" : "no — preparation (Studienkolleg) and exams are required"}. ${a.slug === "almaniya" || b.slug === "almaniya" ? "For Germany, a Studienkolleg year and B2–C1 language skills are required." : ""}`
            : `${nameA}: ${a.certificateAdmission ? "bəli" : "xeyr — hazırlıq (Studienkolleg) və imtahan tələb olunur"}. ${nameB}: ${b.certificateAdmission ? "bəli" : "xeyr — hazırlıq (Studienkolleg) və imtahan tələb olunur"}. ${a.slug === "almaniya" || b.slug === "almaniya" ? "Almaniya üçün Studienkolleg ili və B2–C1 dil səviyyəsi tələb olunur." : ""}`,
    },
    {
      q:
        locale === "ru"
          ? `В какой из стран — ${nameA} или ${nameB} — можно учиться на английском?`
          : locale === "en"
            ? `In which country — ${nameA} or ${nameB} — can you study in English?`
            : `${nameA} və ya ${nameB} — hansında ingilis dilində oxumaq olar?`,
      a:
        locale === "ru"
          ? `${nameA}: ${a.hasEnglish ? "да" : "в основном русский язык; английских программ мало"}. ${nameB}: ${b.hasEnglish ? "да" : "в основном русский язык; английских программ мало"}.`
          : locale === "en"
            ? `${nameA}: ${a.hasEnglish ? "yes" : "mainly the local language; few English-taught programs"}. ${nameB}: ${b.hasEnglish ? "yes" : "mainly the local language; few English-taught programs"}.`
            : `${nameA}: ${a.hasEnglish ? "bəli" : "əsasən yerli dil; ingilis dilli proqram azdır"}. ${nameB}: ${b.hasEnglish ? "bəli" : "əsasən yerli dil; ingilis dilli proqram azdır"}.`,
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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "az" ? "Xaricdə Təhsil" : locale === "ru" ? "Учёба за рубежом" : "Study Abroad", item: `${siteUrl}/${locale}/xaricde-tehsil` },
      { "@type": "ListItem", position: 2, name: `${nameA} vs ${nameB}`, item: `${siteUrl}/${locale}/${basePath}/${pairSlug}` },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${siteUrl}/${locale}/${basePath}/${pairSlug}`,
    name: copy.h1(nameA, nameB, year),
    description: copy.metaDescription(nameA, nameB, year, genA, genB),
    inLanguage: locale,
  };

  const otherPairs = allComparePairs()
    .filter((p) => p.slug !== pairSlug && (p.a === a.slug || p.b === b.slug || p.a === b.slug || p.b === a.slug))
    .slice(0, 6);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 pt-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-foreground/50">
          <li>
            <Link href={`/${locale}/xaricde-tehsil`} className="hover:text-brand-primary">
              {locale === "az" ? "Xaricdə Təhsil" : locale === "ru" ? "Учёба за рубежом" : "Study Abroad"}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-foreground/70">{nameA} vs {nameB}</li>
        </ol>
      </nav>

      <section className="mx-auto max-w-3xl px-6 pt-12">
        <h1 className="text-balance font-heading text-4xl font-extrabold text-foreground sm:text-5xl">
          {copy.h1(nameA, nameB, year)}
        </h1>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-foreground/80">
          {copy.intro(nameA, nameB, genA, genB).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Data cədvəli — real snapshot datasından */}
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="glass overflow-x-auto rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-foreground/70">
              <tr>
                <th className="px-5 py-3">{ui.indicator}</th>
                <th className="px-5 py-3">{nameA}</th>
                <th className="px-5 py-3">{nameB}</th>
              </tr>
            </thead>
            <tbody>
              <SnapshotRow label={ui.tuitionPerYear} aVal={range(a.tuitionMin, a.tuitionMax)} bVal={range(b.tuitionMin, b.tuitionMax)} highlight={v.tuitionCheaperPct < 0 ? "a" : v.tuitionCheaperPct > 0 ? "b" : undefined} />
              <SnapshotRow label={ui.dormPerMonth} aVal={range(a.dormMin, a.dormMax)} bVal={range(b.dormMin, b.dormMax)} highlight={a.dormMin < b.dormMin ? "a" : b.dormMin < a.dormMin ? "b" : undefined} />
              <SnapshotRow label={ui.foodPerMonth} aVal={range(a.foodMin, a.foodMax)} bVal={range(b.foodMin, b.foodMax)} highlight={a.foodMin < b.foodMin ? "a" : b.foodMin < a.foodMin ? "b" : undefined} />
              <SnapshotRow
                label={ui.visa}
                aVal={VISA_LABELS[a.visa][locale]}
                bVal={VISA_LABELS[b.visa][locale]}
                highlight={v.visaEasier === "a" ? "a" : v.visaEasier === "b" ? "b" : undefined}
              />
              <SnapshotRow label={ui.languages} aVal={a.languages} bVal={b.languages} />
              <SnapshotRow label={ui.englishAvailable} aVal={engLabel(a)} bVal={engLabel(b)} />
              <SnapshotRow label={ui.certificateAdmission} aVal={a.certificateAdmission ? ui.required : ui.notRequired} bVal={b.certificateAdmission ? ui.required : ui.notRequired} />
              <SnapshotRow
                label={ui.annualTotal}
                aVal={`${money(v.annualTotalA)} / ${locale === "ru" ? "год" : locale === "en" ? "yr" : "il"}`}
                bVal={`${money(v.annualTotalB)} / ${locale === "ru" ? "год" : locale === "en" ? "yr" : "il"}`}
                highlight={v.cheaperSlug === "a" ? "a" : v.cheaperSlug === "b" ? "b" : undefined}
              />
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-foreground/50">
          {locale === "ru"
            ? "Данные из базы MegaGroup, регулярно обновляются — проверяйте официальный сайт университета."
            : locale === "en"
              ? "Data from the MegaGroup database, updated regularly — verify with the university's official website."
              : "Rəqəmlər MegaGroup bazasından götürülür və mütəmadi yenilənir — dəqiqləşdirmə üçün universitetin rəsmi saytını yoxlayın."}
        </p>
      </section>

      {/* Nəticə bloku — computed verdict */}
      <section className="mx-auto max-w-3xl px-6 pb-4">
        <h2 className="font-heading text-3xl font-bold text-foreground">{ui.verdictTitle}</h2>
        <div className="glass mt-6 rounded-2xl p-6 text-base text-foreground/80">
          <p>
            <strong className="text-foreground">
              {v.cheaperSlug === "equal"
                ? ui.similar
                : v.cheaperSlug === "a"
                  ? nameA
                  : nameB}
            </strong>{" "}
            {v.cheaperSlug !== "equal" && ui.cheaperVerdict}: {money(Math.min(v.annualTotalA, v.annualTotalB))}{" "}
            {locale === "ru" ? "против" : locale === "en" ? "vs" : "ilə"} {money(Math.max(v.annualTotalA, v.annualTotalB))}{" "}
            ({ui.annualTotal.toLowerCase()}).
          </p>
          {v.visaEasier !== "equal" && (
            <p className="mt-3">
              {ui.visaEasier}{" "}
              <strong className="text-foreground">{v.visaEasier === "a" ? nameA : nameB}</strong>{" "}
              ({VISA_LABELS[(v.visaEasier === "a" ? a : b).visa][locale]}).
            </p>
          )}
          {v.languageAdvantage !== "none" && (
            <p className="mt-3">
              {ui.englishAvailable}{" "}
              <strong className="text-foreground">{v.languageAdvantage === "a" ? nameA : nameB}</strong>
              {v.languageAdvantage === "a" ? (a.hasEnglish ? " ✓" : "") : b.hasEnglish ? " ✓" : ""}
            </p>
          )}
        </div>
      </section>

      {/* Cüt-spesifik FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="font-heading text-3xl font-bold text-foreground">{ui.faqTitle}</h2>
        <div className="mt-8 space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="glass rounded-xl p-5">
              <h3 className="font-semibold text-foreground">{f.q}</h3>
              <p className="mt-2 text-sm text-foreground/75">{f.a}</p>
            </div>
          ))}
        </div>
      </section>      {/* Digər müqayisələr — internal linking (hub & spoke) */}
      {otherPairs.length > 0 && (
        <nav aria-label={ui.otherComparisons} className="mx-auto max-w-3xl px-6 pb-12">
          <h2 className="font-heading text-2xl font-bold text-foreground">{ui.otherComparisons}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {otherPairs.map((p) => (
              <Link
                key={p.slug}
                href={`/${locale}/${basePath}/${p.slug}`}
                className="glass rounded-full px-4 py-1.5 text-sm text-foreground/80 transition-colors hover:bg-white/10 hover:text-foreground"
              >
                {COMPARE_COUNTRY_NAMES[p.a][locale]} vs {COMPARE_COUNTRY_NAMES[p.b][locale]}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <CTASection />
    </>
  );
}
