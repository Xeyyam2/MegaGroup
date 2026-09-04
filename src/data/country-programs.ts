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

export function programTitle(p: Program, loc: string, year: number): string {
  return `${loc} ${p.name_az} Təhsili ${year} — Universitetlər, Qiymətlər və Qəbul | MegaGroup`;
}

export function programH1(p: Program, loc: string, year: number): string {
  return `${loc} ${p.name_az} Təhsili ${year}`;
}

export function programMeta(p: Program, loc: string, name: string, year: number): string {
  return `${loc} ${p.name_az.toLowerCase()} təhsili ${year}: hansı universitetlər təklif edir, müddət, tədris dili, illik qiymətlər və attestatla qəbul şərtləri. ${name} ${p.name_az.toLowerCase()} ixtisası üçün tam bələdçi.`;
}
