/**
 * programmatic-seo: Ölkə müqayisə silosu.
 * URL: /xaricde-tehsil/muqayise/[pair] — 7 ölkədən 21 cüt (C(7,2)) × 3 dil = 63 səhifə.
 *
 * PSEO prinsipləri:
 * - Proprietary data: bütün rəqəmlər mövcud `country-content.*` dərin məzmunundan
 *   hesablanır (təhsil haqqı, yataqxana, qida, viza, dil) — uydurma rəqəm yoxdur.
 * - Unique value per page: hər cüt üçün ayrıca intro (3 dil), computed verdict
 *   (qiymət fərqi %, dil üstünlüyü, viza asanlığı), cüt-spesifik FAQ.
 * - Thin content yoxdur: template yalnız struktur verir, məzmun data + intro ilə fərqlənir.
 */

import type { Locale } from "@/types";

export interface CompareSnapshot {
  slug: string;
  /** Ən aşağı illik təhsil haqqı (USD). */
  tuitionMin: number;
  /** Ən yüksək illik təhsil haqqı (USD). */
  tuitionMax: number;
  /** Aylıq yataqxana min–max (USD). */
  dormMin: number;
  dormMax: number;
  /** Aylıq qida min–max (USD). */
  foodMin: number;
  foodMax: number;
  /** Viza çətinliyi: easy | medium | hard. */
  visa: "easy" | "medium" | "hard";
  /** Tədris dilləri (AZ bazadan, renderdə lokalizə olunur). */
  languages: string;
  /** İngilis dilində tədris mövcuddur. */
  hasEnglish: boolean;
  /** Mərkəzləşdirilmiş imtahan olmadan attestatla qəbul. */
  certificateAdmission: boolean;
  /** Təhsil ümumiyyətlə pulsuzdur (dövlət). */
  freeTuition: boolean;
}

function snapshotOf(
  slug: string,
  o: {
    tuitionMin: number; tuitionMax: number; dormMin: number; dormMax: number;
    foodMin: number; foodMax: number; visa: CompareSnapshot["visa"];
    languages: string; hasEnglish: boolean; certificateAdmission: boolean; freeTuition?: boolean;
  },
): CompareSnapshot {
  return { slug, freeTuition: false, ...o };
}

/**
 * Real `country-content.*` costRows-larından törədilmiş snapshot-lar.
 * Qiymətlər oradakı cədvəllərlə üst-üstə düşməlidir (single source of truth).
 */
export const COMPARE_SNAPSHOTS: Record<string, CompareSnapshot> = {
  turkiye: snapshotOf("turkiye", {
    tuitionMin: 400, tuitionMax: 8000, dormMin: 100, dormMax: 300,
    foodMin: 200, foodMax: 400, visa: "easy",
    languages: "Türkçe / İngilis", hasEnglish: true, certificateAdmission: true,
  }),
  rusiya: snapshotOf("rusiya", {
    tuitionMin: 1500, tuitionMax: 6000, dormMin: 50, dormMax: 150,
    foodMin: 150, foodMax: 300, visa: "easy",
    languages: "Rus dili", hasEnglish: false, certificateAdmission: true,
  }),
  ukrayna: snapshotOf("ukrayna", {
    tuitionMin: 2500, tuitionMax: 5500, dormMin: 50, dormMax: 120,
    foodMin: 120, foodMax: 250, visa: "medium",
    languages: "Ukraynaca / İngilis", hasEnglish: true, certificateAdmission: true,
  }),
  gurcustan: snapshotOf("gurcustan", {
    tuitionMin: 2000, tuitionMax: 6000, dormMin: 150, dormMax: 350,
    foodMin: 150, foodMax: 300, visa: "easy",
    languages: "İngilis / Rus", hasEnglish: true, certificateAdmission: true,
  }),
  qazaxistan: snapshotOf("qazaxistan", {
    tuitionMin: 1500, tuitionMax: 6000, dormMin: 60, dormMax: 180,
    foodMin: 150, foodMax: 300, visa: "easy",
    languages: "İngilis / Rus / Qazax", hasEnglish: true, certificateAdmission: true,
  }),
  almaniya: snapshotOf("almaniya", {
    tuitionMin: 0, tuitionMax: 1500, dormMin: 300, dormMax: 600,
    foodMin: 200, foodMax: 350, visa: "hard",
    languages: "Alman / İngilis", hasEnglish: true, certificateAdmission: false, freeTuition: true,
  }),
  polsa: snapshotOf("polsa", {
    tuitionMin: 3000, tuitionMax: 15000, dormMin: 200, dormMax: 455,
    foodMin: 150, foodMax: 300, visa: "medium",
    languages: "İngilis", hasEnglish: true, certificateAdmission: true,
  }),
};

const VISA_RANK = { easy: 0, medium: 1, hard: 2 } as const;

export interface CompareVerdict {
  /** Tuition çatışmazlığı: a ölkəsi b-dən nə qədər ucuzdur (min-min). */
  tuitionCheaperPct: number;
  /** Ümumi illik xərc (təhsil + 12 ay yataqxana + qida) orta səviyyə. */
  annualTotalA: number;
  annualTotalB: number;
  cheaperSlug: "a" | "b" | "equal";
  visaEasier: "a" | "b" | "equal";
  languageAdvantage: "a" | "b" | "none";
}

export function computeVerdict(a: CompareSnapshot, b: CompareSnapshot): CompareVerdict {
  const annual = (s: CompareSnapshot) =>
    (s.tuitionMin + s.tuitionMax) / 2 + 12 * ((s.dormMin + s.dormMax) / 2 + (s.foodMin + s.foodMax) / 2);
  const totalA = Math.round(annual(a));
  const totalB = Math.round(annual(b));
  const cheaper = totalA < totalB ? "a" : totalB < totalA ? "b" : "equal";
  return {
    tuitionCheaperPct: Math.round(
      ((b.tuitionMin - a.tuitionMin) / (b.tuitionMin || 1)) * 100,
    ),
    annualTotalA: totalA,
    annualTotalB: totalB,
    cheaperSlug: cheaper,
    visaEasier: VISA_RANK[a.visa] === VISA_RANK[b.visa] ? "equal" : VISA_RANK[a.visa] < VISA_RANK[b.visa] ? "a" : "b",
    languageAdvantage: a.hasEnglish && !b.hasEnglish ? "a" : !a.hasEnglish && b.hasEnglish ? "b" : "none",
  };
}

// ============================================================
// Cüt-spesifik intro (3 dil) — unique value per pair (PSEO 1.1)
// ============================================================

type PairIntro = {
  title: (a: string, b: string, y: number) => string;
  h1: (a: string, b: string, y: number) => string;
  metaDescription: (a: string, b: string, y: number, aGen?: string, bGen?: string) => string;
  intro: (a: string, b: string, aGen?: string, bGen?: string) => string[];
};

/** Ən çox axtarılan cütlər üçün unikal giriş mətnləri (AZ). */
const PAIR_INTROS_AZ: Record<string, PairIntro> = {
  "turkiye-vs-almaniya": {
    title: (a, b, y) => `${a} və ya ${b}: Xaricdə Təhsil Müqayisəsi ${y} | MegaGroup`,
    h1: (a, b, y) => `${a} vs ${b}: Hansı Daha Yaxşıdır? (${y})`,
    metaDescription: (a, b, y) =>
      `${a} və ${b} müqayisəsi ${y}: təhsil haqqı, yaşayış, dil və viza fərqləri real rəqəmlərlə. ${a}–${b} müqayisəsində hansı ölkənin sizə uyğun olduğunu öyrənin.`,
    intro: (a, b) => [
      `${a} və ${b} — Azərbaycanlı tələbələrin ən çox müqayisə etdiyi iki istiqamətdir, çünki birində attestatla sürətli qəbul, digərində isə dünyada ən əlçatan (tehetəsiz) təhsil modeli mövcuddur.`,
      "Aşağıdakı müqayisə real rəqəmlərə əsaslanır: illik təhsil haqqı diapazonları, aylıq yataqxana və qida xərcləri, viza prosesinin çətinliyi və tədris dilləri. Rəqəmlər MegaGroup-un yerləşdirmə təcrübəsindən toplanıb və mütəmadi yenilənir.",
    ],
  },
  "turkiye-vs-polsa": {
    title: (a, b, y) => `${a} və ya ${b}: Tibb və Başqa İxtisaslar Müqayisəsi ${y} | MegaGroup`,
    h1: (a, b, y) => `${a} vs ${b}: Qiymət, Dil və Diploma Görə Müqayisə (${y})`,
    metaDescription: (a, b, y) =>
      `${a} və ${b} müqayisəsi ${y}: tibb təhsili, illik büdcə, ingilis dilli proqramlar və diplomatik tanınma. Hansı ölkə sərfəlidir?`,
    intro: (a, b) => [
      `${a} və ${b} müqayisəsi xüsusilə tibb arzusundan başlayır: birində ən aşağı giriş xərci, digərində Avropa İttifaqı diplomu. Real cavab büdcənizdən və dil planınızdan asılıdır.`,
      "Bu səhifə hər iki ölkənin illik təhsil haqqı diapazonunu, aylıq yaşayış xərclərini, viza prosesini və tədris dillərini eyni cədvəldə müqayisə edir — sonda hangi ölkənin hansı tələbə üçün uyğun olduğunu göstərir.",
    ],
  },
};

const PAIR_INTROS_RU: Record<string, PairIntro> = {
  "turkiye-vs-almaniya": {
    title: (a, b, y) => `${a} или ${b}: сравнение учёбы за рубежом ${y} | MegaGroup`,
    h1: (a, b, y) => `${a} или ${b}: что лучше? (${y})`,
    metaDescription: (a, b, y, aGen, bGen) =>
      `Сравнение ${aGen ?? a} и ${bGen ?? b} в ${y}: стоимость обучения, проживание, язык и виза — с реальными цифрами. Какая страна подойдёт именно вам?`,
    intro: (a, b) => [
      `${a} и ${b} — два направления, которые чаще всего сравнивают азербайджанские студенты: в одном быстрое поступление по аттестату, в другом — самая доступная модель бесплатного обучения.`,
      "Сравнение ниже основано на реальных цифрах: годовые диапазоны оплаты обучения, ежемесячные расходы на общежитие и питание, сложность визового процесса и языки преподавания. Данные собраны из практики размещения MegaGroup и регулярно обновляются.",
    ],
  },
  "turkiye-vs-polsa": {
    title: (a, b, y) => `${a} или ${b}: сравнение медицины и других программ ${y} | MegaGroup`,
    h1: (a, b, y) => `${a} или ${b}: сравнение по цене, языку и диплому (${y})`,
    metaDescription: (a, b, y, aGen, bGen) =>
      `Сравнение ${aGen ?? a} и ${bGen ?? b} в ${y}: медицинское образование, годовой бюджет, англоязычные программы и признание диплома. Какая страна выгоднее?`,
    intro: (a, b, aGen, bGen) => [
      `Выбор между ${aGen ?? a} и ${bGen ?? b} чаще всего начинается с медицины: в одной стране ниже входная стоимость, в другой — диплом Евросоюза. Реальный ответ зависит от бюджета и языкового плана.`,
      "На этой странице годовые диапазоны стоимости обучения, ежемесячные расходы, визовый процесс и языки преподавания обеих стран сведены в одну таблицу — в конце показано, какая страна подходит какому типу студентов.",
    ],
  },
};

const PAIR_INTROS_EN: Record<string, PairIntro> = {
  "turkiye-vs-almaniya": {
    title: (a, b, y) => `${a} or ${b}: Study Abroad Comparison ${y} | MegaGroup`,
    h1: (a, b, y) => `${a} vs ${b}: Which Is Better? (${y})`,
    metaDescription: (a, b, y) =>
      `Comparing ${a} and ${b} in ${y}: tuition, living costs, language and visa differences with real figures. Find out which country suits you best.`,
    intro: (a, b) => [
      `${a} and ${b} are the two destinations Azerbaijani students compare most often — one offers fast certificate-based admission, the other the world's most accessible (tuition-free) study model.`,
      "The comparison below is based on real figures: annual tuition ranges, monthly dormitory and food costs, visa difficulty and languages of instruction. The data comes from MegaGroup's placement experience and is updated regularly.",
    ],
  },
  "turkiye-vs-polsa": {
    title: (a, b, y) => `${a} or ${b}: Medicine and Other Programs Comparison ${y} | MegaGroup`,
    h1: (a, b, y) => `${a} vs ${b}: Compared by Price, Language and Diploma (${y})`,
    metaDescription: (a, b, y) =>
      `Comparing ${a} and ${b} in ${y}: medical education, annual budget, English-taught programs and diploma recognition. Which country is worth it?`,
    intro: (a, b) => [
      `The choice between ${a} and ${b} usually starts with medicine: one offers the lowest entry cost, the other a European Union diploma. The real answer depends on your budget and language plan.`,
      "This page puts both countries' annual tuition ranges, monthly living costs, visa process and languages of instruction into a single table — and shows at the end which country fits which type of student.",
    ],
  },
};

/** Lokalizasiya üçün ölkə adları (üç dil). */
export const COMPARE_COUNTRY_NAMES: Record<string, Record<Locale, string>> = {
  turkiye: { az: "Türkiyə", ru: "Турция", en: "Turkey" },
  rusiya: { az: "Rusiya", ru: "Россия", en: "Russia" },
  ukrayna: { az: "Ukrayna", ru: "Украина", en: "Ukraine" },
  gurcustan: { az: "Gürcüstan", ru: "Грузия", en: "Georgia" },
  qazaxistan: { az: "Qazaxıstan", ru: "Казахстан", en: "Kazakhstan" },
  almaniya: { az: "Almaniya", ru: "Германия", en: "Germany" },
  polsa: { az: "Polşa", ru: "Польша", en: "Poland" },
};

/** Viza çətinliyi etiketi — hər dil üçün. */
export const VISA_LABELS: Record<CompareSnapshot["visa"], Record<Locale, string>> = {
  easy: { az: "Asan", ru: "Легко", en: "Easy" },
  medium: { az: "Orta", ru: "Средне", en: "Medium" },
  hard: { az: "Çətin", ru: "Сложно", en: "Hard" },
};

/** Ümumi paylaşdırılmış UI etiketləri — 3 dil. */
export const COMPARE_UI: Record<Locale, {
  indicator: string; country: string; tuitionPerYear: string; dormPerMonth: string; foodPerMonth: string;
  visa: string; languages: string; annualTotal: string; cheaper: string; moreAffordable: string;
  similar: string; visaEasier: string; englishAvailable: string; onlyB: string; certificateAdmission: string;
  required: string; notRequired: string; verdictTitle: string; cheaperVerdict: string;
  faqTitle: string; otherComparisons: string; applyCta: string;
}> = {
  az: {
    indicator: "Göstərici", country: "Ölkə", tuitionPerYear: "Təhsil haqqı (USD/il)",
    dormPerMonth: "Yataqxana (USD/ay)", foodPerMonth: "Qida (USD/ay)", visa: "Viza", languages: "Tədris dilləri",
    annualTotal: "İllik ümumi büdcə (təhsil + yaşayış)", cheaper: "daha sərfəli", moreAffordable: "daha əlçatan",
    similar: "təxminən bərabər", visaEasier: "Vizası daha asan:", englishAvailable: "İngilis dilli proqramlar:",
    onlyB: "Mövcuddur", certificateAdmission: "Attestatla qəbul:", required: "Tələb olunur", notRequired: "Tələb olunmur",
    verdictTitle: "Nəticə", cheaperVerdict: "ümumi büdcəyə görə daha sərfəlidir",
    faqTitle: "Tez-tez Verilən Suallar", otherComparisons: "Digər müqayisələr", applyCta: "Pulsuz konsultasiya al",
  },
  ru: {
    indicator: "Показатель", country: "Страна", tuitionPerYear: "Стоимость обучения (USD/год)",
    dormPerMonth: "Общежитие (USD/мес)", foodPerMonth: "Питание (USD/мес)", visa: "Виза", languages: "Языки преподавания",
    annualTotal: "Годовой общий бюджет (обучение + проживание)", cheaper: "доступнее", moreAffordable: "доступнее",
    similar: "примерно равны", visaEasier: "Виза проще:", englishAvailable: "Программы на английском:",
    onlyB: "Есть", certificateAdmission: "Поступление по аттестату:", required: "Требуется", notRequired: "Не требуется",
    verdictTitle: "Вывод", cheaperVerdict: "выгоднее по общему годовому бюджету",
    faqTitle: "Часто задаваемые вопросы", otherComparisons: "Другие сравнения", applyCta: "Бесплатная консультация",
  },
  en: {
    indicator: "Metric", country: "Country", tuitionPerYear: "Tuition (USD/yr)",
    dormPerMonth: "Dormitory (USD/mo)", foodPerMonth: "Food (USD/mo)", visa: "Visa", languages: "Languages of instruction",
    annualTotal: "Total annual budget (tuition + living)", cheaper: "more affordable", moreAffordable: "more affordable",
    similar: "roughly equal", visaEasier: "Easier visa:", englishAvailable: "English-taught programs:",
    onlyB: "Available", certificateAdmission: "Certificate-based admission:", required: "Required", notRequired: "Not required",
    verdictTitle: "Verdict", cheaperVerdict: "is more affordable by total annual budget",
    faqTitle: "FAQ", otherComparisons: "Other comparisons", applyCta: "Get a free consultation",
  },
};

/** Bütün cütlər (C(7,2)) — URL-də "a-vs-b" formatı. */
export function comparePairSlug(a: string, b: string): string {
  return `${a}-vs-${b}`;
}

export function parsePairSlug(pair: string): [string, string] | undefined {
  const m = pair.match(/^([a-z]+)-vs-([a-z]+)$/);
  if (!m) return undefined;
  const [, a, b] = m;
  if (!COMPARE_SNAPSHOTS[a] || !COMPARE_SNAPSHOTS[b] || a === b) return undefined;
  return [a, b];
}

/** Verilən ölkənin iştirak etdiyi cütlər — ölkə səhifəsindən internal link üçün. */
export function pairsForCountry(slug: string): { a: string; b: string; slug: string }[] {
  return allComparePairs().filter((p) => p.a === slug || p.b === slug);
}

export function allComparePairs(): { a: string; b: string; slug: string }[] {
  const slugs = Object.keys(COMPARE_SNAPSHOTS);
  const out: { a: string; b: string; slug: string }[] = [];
  for (let i = 0; i < slugs.length; i++) {
    for (let j = i + 1; j < slugs.length; j++) {
      out.push({ a: slugs[i], b: slugs[j], slug: comparePairSlug(slugs[i], slugs[j]) });
    }
  }
  return out;
}

/** Cüt üçün intro — pair-specific varsa onu, yoxdursa generic (data-driven) şablon. */
export function getPairIntro(pairSlug: string, locale: Locale): PairIntro {
  const table =
    locale === "ru" ? PAIR_INTROS_RU : locale === "en" ? PAIR_INTROS_EN : PAIR_INTROS_AZ;
  const generic: PairIntro = {
    title: (a: string, b: string, y: number, _aGen?: string, _bGen?: string) =>
      locale === "ru"
        ? `${a} или ${b}: сравнение ${y} | MegaGroup`
        : locale === "en"
          ? `${a} vs ${b}: Study Comparison ${y} | MegaGroup`
          : `${a} və ya ${b}: Təhsil Müqayisəsi ${y} | MegaGroup`,
    h1: (a: string, b: string, y: number) =>
      locale === "ru"
        ? `${a} или ${b} (${y})`
        : locale === "en"
          ? `${a} vs ${b} (${y})`
          : `${a} vs ${b} (${y})`,
    metaDescription: (a: string, b: string, y: number, aGen?: string, bGen?: string) =>
      locale === "ru"
        ? `Сравнение ${aGen ?? a} и ${bGen ?? b} в ${y}: стоимость обучения, проживание, виза и язык преподавания — реальные цифры от MegaGroup.`
        : locale === "en"
          ? `Comparing ${a} and ${b} in ${y}: tuition, living costs, visa and language of instruction — real figures from MegaGroup.`
          : `${a} və ${b} müqayisəsi ${y}: təhsil haqqı, yaşayış, viza və tədris dili — MegaGroup-dan real rəqəmlərlə.`,
    intro: (a: string, b: string, aGen?: string, bGen?: string) =>
      locale === "ru"
        ? [
            `Сравнение ${aGen ?? a} и ${bGen ?? b} для азербайджанских студентов: стоимость обучения, расходы на проживание, виза и язык преподавания — на основе реальных данных MegaGroup.`,
            "Таблица ниже показывает годовые диапазоны оплаты, ежемесячные расходы на общежитие и питание, сложность визы и доступность английского языка. В конце — вывод: какая страна подходит какому типу студентов.",
          ]
        : locale === "en"
          ? [
              `Comparing ${a} and ${b} for Azerbaijani students: tuition, living costs, visa and language of instruction — based on real MegaGroup data.`,
              "The table below shows annual tuition ranges, monthly dormitory and food costs, visa difficulty and English availability. The verdict at the end shows which country suits which type of student.",
            ]
          : [
              `${a} və ${b} müqayisəsi Azərbaycanlı tələbələr üçün: təhsil haqqı, yaşayış xərcləri, viza və tədris dili — MegaGroup-un real datası əsasında.`,
              "Aşağıdakı cədvəl illik təhsil haqqı diapazonlarını, aylıq yataqxana və qida xərclərini, viza çətinliyini və ingilis dilinin mövcudluğunu göstərir. Sonda nəticə: hansı ölkə hansı tələbə tipinə uyğundur.",
            ],
  };
  return table[pairSlug] ?? generic;
}
