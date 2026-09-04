import { universities } from "@/data/universities";

/**
 * Məqalə bələdçiləri üçün RƏSMİ mənbələr.
 *
 * E-E-A-T / trust siqnalı: məqalədəki qəbul, viza və diplom tanınması
 * iddiaları şəxsi fikir deyil — dövlət/universitet mənbələrinə əsaslanır.
 * Yalnız stabil, rəsmi domenlər siyahıya alınır (dəyişən daxili səhifə
 * linkləri yox — qırıq link riski yaratmamaq üçün əsas rəsmi girişlər).
 */
export interface ArticleSource {
  name: string;
  url: string;
}

/** Ölkə səviyyəli rəsmi təhsil/viza mənbələri (ölkə slug-ı ilə). */
const COUNTRY_OFFICIAL_SOURCES: Record<string, ArticleSource[]> = {
  turkiye: [
    {
      name: "YÖK — Türkiyə Ali Təhsil Qurumu (Yükseköğretim Kurulu)",
      url: "https://www.yok.gov.tr",
    },
    {
      name: "Türkiyə Respublikası Xarici İşlər Nazirliyi — viza məlumatları",
      url: "https://www.mfa.gov.tr",
    },
  ],
  rusiya: [
    {
      name: "Study in Russia — Rusiya Təhsil Nazirliyinin rəsmi tələbə portalı",
      url: "https://studyinrussia.ru",
    },
    {
      name: "Rusiya Təhsil və Elm Nazirliyi (Minobrnauki)",
      url: "https://minobrnauki.gov.ru",
    },
  ],
  ukrayna: [
    {
      name: "Ukrayna Təhsil və Elm Nazirliyi (MON)",
      url: "https://mon.gov.ua",
    },
  ],
  gurcustan: [
    {
      name: "Gürcüstan Təhsil və Elm Nazirliyi",
      url: "https://mes.gov.ge",
    },
    {
      name: "Gürcüstan Təhsil Keyfiyyəti İnkişaf Mərkəzi (EQE)",
      url: "https://eqe.ge",
    },
  ],
  qazaxistan: [
    {
      name: "Qazaxıstan Respublikası Təhsil Nazirliyi",
      url: "https://www.gov.kz/memleket/entities/edu",
    },
    {
      name: "Qazaxıstan Təhsil və Elm üzrə Keyfiyyət Təminatı Komitəsi",
      url: "https://nkaoko.kz",
    },
  ],
  almaniya: [
    {
      name: "DAAD — Alman Akademik Mübadilə Xidməti (rəsmi təhsil portalı)",
      url: "https://www.daad.de",
    },
    {
      name: "anabin — Almaniya diplom tanınması məlumat bazası (KMK)",
      url: "https://anabin.kmk.org",
    },
  ],
  polsa: [
    {
      name: "NAWA — Polşa Milli Akademik Mübadilə Agentliyi",
      url: "https://nawa.gov.pl",
    },
    {
      name: "Polşa Elm və Ali Təhsil Nazirliyi (gov.pl)",
      url: "https://www.gov.pl/web/science",
    },
  ],
};

/** Ölkə bələdçisi üçün rəsmi mənbə siyahısı. */
export function countryOfficialSources(countrySlug?: string | null): ArticleSource[] {
  if (!countrySlug) return [];
  return COUNTRY_OFFICIAL_SOURCES[countrySlug] ?? [];
}

/**
 * Universitet bələdçisidirsə, universitetin RƏSMİ saytını qaytarır.
 * URL-lər universities.ts-dən gəlir — iki yerdə ayrıca saxlanmır,
 * beləcə köhnə/yanlış link riski yoxdur.
 */
export function officialUniversitySite(
  articleSlug: string,
): { url: string } | undefined {
  const u = universities.find((x) => x.slug === articleSlug);
  if (!u || !u.website_url) return undefined;
  return { url: u.website_url };
}
