/**
 * Orijinal statistika (s.md 4.6 — GEO üçün ən güclü aktiv).
 *
 * BÜTÜN rəqəmlər saytın real datasından KOMPUTER hesablayır:
 *  - universitet + qiymət + fakültə datası (`universities`)
 *  - ölkə büdcə snapshot-ları (`country-compare`)
 * Uydurma rəqəm YOXDUR — hər göstəricinin hesablama üsulu `methodology`
 * sahəsində açıq yazılır (E-E-A-T + AI sitat üçün).
 */

import { universities } from "./universities";
import { COMPARE_SNAPSHOTS, COMPARE_COUNTRY_NAMES } from "./country-compare";
import type { Locale } from "@/types";

export interface StatEntry {
  value: string;
  method: Record<Locale, string>;
}

/** Fakültə adından tibb sahəsi olub-olmadığını müəyyən edən açar sözlər. */
const MEDICAL_KEYS = ["tibb", "medicin", "медицин", "лечеб", "hekimlik", "medicine", "stomat", "diş", "əcza", "pharm", "фармац"];

const mid = (min: number, max: number) => (min + max) / 2;
const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

function annualBudgetOf(u: (typeof universities)[number]): number {
  const f = u.fees;
  if (!f) return 0;
  return Math.round(mid(f.tuition_min_usd, f.tuition_max_usd) + 12 * (mid(f.dorm_min_usd, f.dorm_max_usd) + mid(f.food_min_usd, f.food_max_usd)));
}

const allFaculties = universities.flatMap((u) => u.faculties);
const withFees = universities.filter((u) => u.fees);

const sortedByTuition = [...withFees].sort(
  (a, b) => mid(a.fees!.tuition_min_usd, a.fees!.tuition_max_usd) - mid(b.fees!.tuition_min_usd, b.fees!.tuition_max_usd),
);
const cheapestUni = sortedByTuition[0];
const priciestUni = sortedByTuition[sortedByTuition.length - 1];
const avgTuition = Math.round(
  withFees.reduce((s, u) => s + mid(u.fees!.tuition_min_usd, u.fees!.tuition_max_usd), 0) / withFees.length,
);
const under3k = withFees.filter((u) => mid(u.fees!.tuition_min_usd, u.fees!.tuition_max_usd) < 3000).length;

const medicalFaculties = allFaculties.filter((f) => MEDICAL_KEYS.some((k) => f.name.toLowerCase().includes(k)));
const englishFaculties = allFaculties.filter((f) => /ingilis|english|инглис|английск/i.test(f.language));

// Ölkə üzrə orta illik büdcə — COMPARE_SNAPSHOTS-dan (təhsil orta + 12 ay yataqxana+qida).
const countryBudgets = Object.values(COMPARE_SNAPSHOTS)
  .map((s) => {
    const annual = Math.round(mid(s.tuitionMin, s.tuitionMax) + 12 * (mid(s.dormMin, s.dormMax) + mid(s.foodMin, s.foodMax)));
    return { slug: s.slug, annual };
  })
  .sort((a, b) => a.annual - b.annual);

const cheapestCountry = countryBudgets[0];
const priciestCountry = countryBudgets[countryBudgets.length - 1];

export interface CountryBudgetRow {
  slug: string;
  nameByLocale: Record<Locale, string>;
  annualUsd: number;
}

export const STATISTICS = {
  generatedNote: {
    az: "Bütün rəqəmlər MegaGroup-un yerləşdirdiyi universitetlərin qeydiyyatlı qiymət və fakültə datasından avtomatik hesablanır.",
    ru: "Все показатели автоматически рассчитываются на основе зарегистрированных данных о ценах и факультетах университетов, с которыми работает MegaGroup.",
    en: "All figures are computed automatically from MegaGroup's registered tuition and faculty data for its partner universities.",
  },

  totals: {
    universities: universities.length,
    countries: Object.keys(COMPARE_SNAPSHOTS).length,
    faculties: allFaculties.length,
  },

  headline: {
    avgTuition: {
      value: usd(avgTuition),
      method: {
        az: `14 tərəfdaş universitetin illik təhsil haqqı orta nöqtələrinin (min+max)/2 riyazi ortalaması.`,
        ru: `Среднее арифметическое серединных значений (мин+макс)/2 годовой стоимости обучения 14 партнёрских университетов.`,
        en: `Arithmetic mean of midpoints (min+max)/2 of annual tuition across 14 partner universities.`,
      },
    } as StatEntry,
    cheapestUniversity: {
      value: `${cheapestUni.name_az} — ${usd(mid(cheapestUni.fees!.tuition_min_usd, cheapestUni.fees!.tuition_max_usd))}/il`,
      method: {
        az: "Təhsil haqqı orta nöqtəsinə görə ən aşağı universitet.",
        ru: "Университет с наименьшим серединным значением годовой стоимости обучения.",
        en: "University with the lowest midpoint annual tuition.",
      },
    } as StatEntry,
    priciestUniversity: {
      value: `${priciestUni.name_az} — ${usd(mid(priciestUni.fees!.tuition_min_usd, priciestUni.fees!.tuition_max_usd))}/il`,
      method: {
        az: "Təhsil haqqı orta nöqtəsinə görə ən yüksək universitet.",
        ru: "Университет с наибольшим серединным значением годовой стоимости обучения.",
        en: "University with the highest midpoint annual tuition.",
      },
    } as StatEntry,
    under3kShare: {
      value: `${Math.round((under3k / withFees.length) * 100)}%`,
      method: {
        az: `İllik təhsil haqqı (orta nöqtə) $3,000-dən aşağı olan universitetlərin payı (${under3k}/${withFees.length}).`,
        ru: `Доля университетов с годовой стоимостью обучения (середина) ниже $3 000 (${under3k}/${withFees.length}).`,
        en: `Share of universities with midpoint annual tuition under $3,000 (${under3k}/${withFees.length}).`,
      },
    } as StatEntry,
    medicalShare: {
      value: `${Math.round((medicalFaculties.length / allFaculties.length) * 100)}%`,
      method: {
        az: `Tibb/stomatologiya/əczaçılıq sahəsi fakültələrinin bütün qeydiyyatlı fakültələr içində payı (${medicalFaculties.length}/${allFaculties.length}).`,
        ru: `Доля факультетов медицины/стоматологии/фармации среди всех зарегистрированных факультетов (${medicalFaculties.length}/${allFaculties.length}).`,
        en: `Share of medicine/dentistry/pharmacy faculties among all registered faculties (${medicalFaculties.length}/${allFaculties.length}).`,
      },
    } as StatEntry,
    englishShare: {
      value: `${Math.round((englishFaculties.length / allFaculties.length) * 100)}%`,
      method: {
        az: `Tədris dili ingilis olan fakültələrin payı (${englishFaculties.length}/${allFaculties.length}).`,
        ru: `Доля факультетов с преподаванием на английском языке (${englishFaculties.length}/${allFaculties.length}).`,
        en: `Share of faculties taught in English (${englishFaculties.length}/${allFaculties.length}).`,
      },
    } as StatEntry,
    cheapestCountry: {
      value: `${COMPARE_COUNTRY_NAMES[cheapestCountry.slug].az} — ${usd(cheapestCountry.annual)}/il`,
      method: {
        az: "Ölkə üzrə illik ümumi büdcə: təhsil haqqı orta nöqtəsi + 12 ay (yataqxana + qida orta nöqtələri).",
        ru: "Годовой общий бюджет по стране: середина стоимости обучения + 12 месяцев (середины общежития и питания).",
        en: "Country-level total annual budget: tuition midpoint + 12 months (dorm and food midpoints).",
      },
    } as StatEntry,
    priciestCountry: {
      value: `${COMPARE_COUNTRY_NAMES[priciestCountry.slug].az} — ${usd(priciestCountry.annual)}/il`,
      method: {
        az: "Eyni hesablama üsulu, ən yüksək nəticə.",
        ru: "Тот же метод расчёта, наибольший результат.",
        en: "Same method, highest result.",
      },
    } as StatEntry,
  },

  countryBudgets: countryBudgets.map(
    (c): CountryBudgetRow => ({ slug: c.slug, nameByLocale: COMPARE_COUNTRY_NAMES[c.slug], annualUsd: c.annual }),
  ),

  universityTuitionTable: sortedByTuition.map((u) => ({
    slug: u.slug,
    countrySlug: u.country_slug,
    name_az: u.name_az,
    city_az: u.city_az,
    tuitionMin: u.fees!.tuition_min_usd,
    tuitionMax: u.fees!.tuition_max_usd,
    annualUsd: annualBudgetOf(u),
  })),
} as const;

export type Statistics = typeof STATISTICS;
