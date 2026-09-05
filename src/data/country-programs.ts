/**
 * seo.md 2.3 + 9 (P1): İxtisas (program) səhifələri.
 * URL: /az/xaricde-tehsil/{ölkə}/ixtisas/{ixtisas} — `ixtisas` segmenti
 * dinamik `[university]` route-u ilə toqquşmasın deyə nested qoyulub.
 * Universitet filtri DB-dəki fakültə adlarının açar sözləri ilə işləyir —
 * yeni universitet/fakültə əlavə olunduqda səhifələr avtomatik genişlənir.
 */
import type { Locale } from "@/types";

export interface Program {
  slug: string;
  name_az: string;
  name_ru: string;
  name_en: string;
  /** Fakültə adı lowercased bu açar sözlərdən birini ehtiva edərsə uyğun sayılır. */
  match: string[];
  /** AZ title/H1 şablonu — {loc} lokativ, {year} cari il. */
}

export const PROGRAMS: Program[] = [
  {
    slug: "tibb",
    name_az: "Tibb", name_ru: "Медицина", name_en: "Medicine",
    match: ["tibb", "medicine", "медицин", "лечеб", "hekimlik"],
  },
  {
    slug: "stomatologiya",
    name_az: "Stomatologiya", name_ru: "Стоматология", name_en: "Dentistry",
    match: ["stomat", "dent", "стомат"],
  },
  {
    slug: "huquq",
    name_az: "Hüquq", name_ru: "Юриспруденция", name_en: "Law",
    match: ["hüquq", "huquq", "law", "юриспруд", "прав"],
  },
  {
    slug: "menecment",
    name_az: "Menecment", name_ru: "Менеджмент", name_en: "Management",
    match: ["menecment", "menedjment", "management", "менедж", "бизнес", "biznes idarəetmə"],
  },
  {
    slug: "komputer-muhendisliyi",
    name_az: "Kompüter Mühəndisliyi", name_ru: "Компьютерная инженерия", name_en: "Computer Engineering",
    match: ["kompüter", "komputer", "computer", "информат", "программ", "informasiya texnologiyaları", "computer science", "it "],
  },
  {
    slug: "memarliq",
    name_az: "Memarlıq", name_ru: "Архитектура", name_en: "Architecture",
    match: ["memarlıq", "memarliq", "architecture", "архитект"],
  },
];

export function getProgram(slug: string): Program | undefined {
  return PROGRAMS.find((p) => p.slug === slug);
}

export function programName(p: Program, locale: Locale): string {
  return locale === "ru" ? p.name_ru : locale === "en" ? p.name_en : p.name_az;
}

export function matchFaculties<T extends { name: string }>(
  faculties: T[],
  program: Program,
): T[] {
  return faculties.filter((f) => {
    const n = f.name.toLowerCase();
    return program.match.some((k) => n.includes(k));
  });
}

/** İxtisas səhifəsi copy üçün lazım olan ölkə formaları (az lokativ, RU hal, EN ad). */
export interface ProgramCountryCtx {
  azLoc: string;
  azName: string;
  enName: string;
  ruPrep: string;
  ruGen: string;
}

export function programTitle(p: Program, loc: string, year: number): string {
  return `${loc} ${p.name_az} Təhsili ${year} — Universitetlər, Qiymətlər və Qəbul | MegaGroup`;
}

export function programH1(p: Program, loc: string, year: number): string {
  return `${loc} ${p.name_az} Təhsili ${year}`;
}

export function programMeta(p: Program, loc: string, name: string, year: number): string {
  return `${loc} ${p.name_az.toLowerCase()} təhsili ${year}: hansı universitetlər təklif edir, müddət, tədris dili, illik qiymətlər və attestatla qəbul şərtləri. ${name} ${p.name_az.toLowerCase()} ixtisası üçün tam bələdçi.`;
}

/** Locale-ə uyğun ixtisas H1 — RU/EN-də AZ şablon istifadə edilmir. */
export function programHeading(p: Program, locale: Locale, year: number, ctx: ProgramCountryCtx): string {
  if (locale === "az") return programH1(p, ctx.azLoc, year);
  if (locale === "ru") return `${p.name_ru} ${ctx.ruPrep} ${year}`;
  return `${p.name_en} in ${ctx.enName} ${year}`;
}

/** Locale-ə uyğun ixtisas title. */
export function programTitleLoc(p: Program, locale: Locale, year: number, ctx: ProgramCountryCtx): string {
  if (locale === "az") return programTitle(p, ctx.azLoc, year);
  if (locale === "ru")
    return `${p.name_ru} ${ctx.ruPrep} ${year} — Университеты, стоимость и поступление | MegaGroup`;
  return `${p.name_en} in ${ctx.enName} ${year} — Universities, Fees and Admission | MegaGroup`;
}

/** Locale-ə uyğun ixtisas meta description. */
export function programMetaLoc(p: Program, locale: Locale, year: number, ctx: ProgramCountryCtx): string {
  if (locale === "az") return programMeta(p, ctx.azLoc, ctx.azName, year);
  if (locale === "ru")
    return `${p.name_ru} ${ctx.ruPrep} ${year}: какие вузы предлагают это направление, срок обучения, язык преподавания, годовая стоимость и условия поступления по аттестату. Полный гид для абитуриентов.`;
  return `${p.name_en} in ${ctx.enName} ${year}: which universities offer this programme, the duration, language of instruction, annual tuition and certificate-based admission requirements. A complete guide for applicants.`;
}
