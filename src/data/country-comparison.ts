import { siteUrl } from "@/lib/site";

/**
 * 7 ölkənin yan-yana müqayisəsi — tək mənbə (single source of truth).
 *
 * Bu məlumat `hansi-olkede-oxumaq-serfelidir` məqaləsinin cədvəli ilə
 * uyğun gəlir və ana səhifədəki sürətli-müqayisə komponenti tərəfindən
 * istifadə olunur. AI crawler-lar `<table>` kimi görəndə birbaşa çıxarış
 * edib sitat gətirə bilər.
 */
export interface ComparisonRow {
  country: string;
  countrySlug: string;
  tuition: string;
  living: string;
  language: string;
  admission: string;
  visa: string;
  recognition: string;
  distance: string;
}

export const countryComparison: ComparisonRow[] = [
  {
    country: "Türkiyə",
    countrySlug: "turkiye",
    tuition: "$1,200 – $8,000",
    living: "$300 – $600",
    language: "Türk / İngilis",
    admission: "Orta",
    visa: "Asan",
    recognition: "YÖK, beynəlxalq",
    distance: "2–3 saat uçuş",
  },
  {
    country: "Rusiya",
    countrySlug: "rusiya",
    tuition: "$1,500 – $4,000",
    living: "$250 – $500",
    language: "Rus / İngilis",
    admission: "Aşağı",
    visa: "Asan",
    recognition: "WHO, beynəlxalq",
    distance: "3–4 saat uçuş",
  },
  {
    country: "Gürcüstan",
    countrySlug: "gurcustan",
    tuition: "$3,000 – $6,000",
    living: "$300 – $500",
    language: "İngilis / Gürcü",
    admission: "Aşağı",
    visa: "Asan (vizasız)",
    recognition: "WHO, ECFMG",
    distance: "1 saat uçuş",
  },
  {
    country: "Ukrayna",
    countrySlug: "ukrayna",
    tuition: "$2,500 – $5,000",
    living: "$200 – $400",
    language: "İngilis / Rus",
    admission: "Aşağı",
    visa: "Orta (hazırda)",
    recognition: "WHO, ECFMG",
    distance: "3 saat uçuş",
  },
  {
    country: "Qazaxıstan",
    countrySlug: "qazaxistan",
    tuition: "$2,000 – $4,000",
    living: "$250 – $450",
    language: "Rus / İngilis",
    admission: "Aşağı",
    visa: "Asan",
    recognition: "Beynəlxalq",
    distance: "3 saat uçuş",
  },
  {
    country: "Almaniya",
    countrySlug: "almaniya",
    tuition: "$0 – $1,500",
    living: "$700 – $1,000",
    language: "Alman / İngilis",
    admission: "Yüksək",
    visa: "Çətin",
    recognition: "EU, qlobal",
    distance: "5–6 saat uçuş",
  },
  {
    country: "Polşa",
    countrySlug: "polsa",
    tuition: "$2,500 – $15,000",
    living: "$400 – $700",
    language: "Polyak / İngilis",
    admission: "Orta",
    visa: "Orta",
    recognition: "EU, WHO, ECFMG",
    distance: "4–5 saat uçuş",
  },
];

export const comparisonHeaders = [
  "Ölkə",
  "İllik təhsil haqqı",
  "Aylıq yaşayış",
  "Tədris dili",
  "Qəbul çətinliyi",
  "Viza",
  "Diplom tanınması",
  "Məsafə (Bakıdan)",
] as const;

export const countryComparisonUrl = `${siteUrl}/az/bloq/hansi-olkede-oxumaq-serfelidir`;
