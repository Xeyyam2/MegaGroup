import type { Locale } from "@/types";

/**
 * seo.md 1.2 + 9 (P1): Ölkə alt-səhifə siloları.
 * Hər ölkə × alt-mövzu kombinasiyası ayrıca landing page-dir (1 keyword = 1 səhifə).
 * Mətnlər şablonlardan generasiya olunur: {country} = ölkə adı (lokal),
 * {loc} = AZ lokativ forma ("Türkiyədə"/"Rusiyada"), {year} = cari il
 * (seo.md 6.3 — cari il heç vaxt statik yazılmır).
 * Məzmun bloklarının əsas hissəsi real DB datasından (universitet/fee/fakültə)
 * render olunur — thin-copy deyil.
 */

export interface CountryTopic {
  slug: string;
  /** AZ lokativdən asılı title — məs. "Türkiyədə Tibb Təhsili" */
  title: (loc: string, year: number) => string;
  h1: (loc: string, year: number) => string;
  metaDescription: (loc: string, name: string, year: number) => string;
  intro: (loc: string, name: string, year: number) => string[];
}

export const COUNTRY_TOPICS: CountryTopic[] = [
  {
    slug: "universitetler",
    title: (loc, y) => `${loc} Universitetləri ${y} — Siyahı, Fakültələr və Təhsil Haqları | MegaGroup`,
    h1: (loc, y) => `${loc} Universitetləri ${y}`,
    metaDescription: (loc, name, y) =>
      `${loc} universitetləri ${y}: dövlət və özəl universitetlərin siyahısı, fakültələr, təhsil haqları və attestatla qəbul imkanları. ${name} təhsili üçün tam bələdçi.`,
    intro: (loc) => [
      `${loc} universitetləri Azərbaycanlı tələbələr arasında ən çox maraq görən seçimlərdəndir. Aşağıdakı siyahıda dövlət və özəl universitetlər, fakültə təklifləri və illik təhsil haqları bir yerdə toplanıb.`,
      "Hər universitetin adına kliklədikcə attestatla qəbul şərtləri, sənədlər, yataqxana və yaşayış xərcləri haqqında ətraflı profili açırsınız. Hansı universitetin sizə uyğun olduğunu seçərkən təhsil dili, ixtisas reytinqi və illik büdcəni birlikdə qiymətləndirmək tövsiyə olunur.",
    ],
  },
  {
    slug: "tehsil-haqqi",
    title: (loc, y) => `${loc} Təhsil Haqqı ${y} — Universitet Qiymətləri | MegaGroup`,
    h1: (loc, y) => `${loc} Təhsil Haqqı ${y}`,
    metaDescription: (loc, name, y) =>
      `${loc} təhsil haqqı ${y}: universitetlər üzrə illik qiymətlər USD ilə, bakalavr və magistr xərcləri, ən ucuz və ən bahalı proqramların müqayisəsi. ${name} təhsil büdcəsi.`,
    intro: (loc) => [
      `${loc} təhsil haqqı universitetdən, ixtisasdən və tədris dilindən asılı olaraq dəyişir. Aşağıdakı cədvəldə universitetlər üzrə illik təhsil haqqı diapazonları real qiymət datası əsasında göstərilir.`,
      "Qiymətlər hər il yenilənir — universitetin rəsmi qəbul səhifəsi ilə birlikdə yoxlamaq tövsiyə olunur. Ümumi büdcəni planlaşdırarkən təhsil haqqına əlavə olaraq yataqxana, qida və nəqliyyat xərclərini də hesablayın.",
    ],
  },
  {
    slug: "tibb",
    title: (loc, y) => `${loc} Tibb Təhsili ${y} — Universitetlər, Qiymətlər, Qəbul | MegaGroup`,
    h1: (loc, y) => `${loc} Tibb Təhsili ${y}`,
    metaDescription: (loc, name, y) =>
      `${loc} tibb təhsili ${y}: tibb fakültəsi olan universitetlər, müddət, tədris dili, illik qiymətlər və attestatla qəbul şərtləri. ${name} həkim təhsili üçün tam bələdçi.`,
    intro: (loc) => [
      `${loc} tibb təhsili həm müddətinin beynəlxalq standartlara uyğunluğu, həm də diplomun tanınması baxımından Azərbaycanlı tələbələr üçün cəlbedici seçimdir. Aşağıda tibb fakültəsi təklif edən universitetlər, müddət və tədris dilləri ilə göstərilib.`,
      "Tibb proqramları adətən rəqabətli olur — sənədləri əvvəlcədən hazırlamaq və qəbul tələblərini universitet profilindən dəqiqləşdirmək vacibdir. Qiymətlər universitet səhifəsində daha ətraflı verilir.",
    ],
  },

  {
    slug: "attestatla-qebul",
    title: (loc, y) => `${loc} Attestatla Təhsil ${y} — İmtahansız Qəbul | MegaGroup`,
    h1: (loc, y) => `${loc} Attestatla Təhsil ${y}`,
    metaDescription: (loc, name, y) =>
      `${loc} attestatla təhsil ${y}: imtahansız və ya minimal imtahanla qəbul şərtləri, tələb olunan sənədlər, müraciət prosesi və müddətləri. ${name} attestatla qəbul bələdçisi.`,
    intro: (loc) => [
      `${loc} attestatla təhsil — orta məktəb attestatı əsasında, imtahansız və ya minimal imtahanla universitetə qəbul deməkdir. Bu, DIM və ya digər mərkəzləşdirilmiş imtahanlar tələb etməyən qəbul yoludur və Azərbaycanlı tələbələr üçün ən sürətli marşrutdur.`,
      "Qəbul üçün əsas şərtlər: tam orta təhsil attestatı, pasport və universitetin tələb etdiyi sənəd dəsti. Aşağıda bu ölkədə attestatla qəbul qəbul edən universitetlər və tələb olunan sənədlər göstərilib.",
    ],
  },
  {
    slug: "teqaud",
    title: (loc, y) => `${loc} Təqaüd İmkanları ${y} — Burslar və Şərtlər | MegaGroup`,
    h1: (loc, y) => `${loc} Təqaüd İmkanları ${y}`,
    metaDescription: (loc, name, y) =>
      `${loc} təqaüd imkanları ${y}: universitet daxili burslar, ən aşağı təhsil haqlı proqramlar və büdcəni azaltmaq yolları. ${name} təhsilində qənaət bələdçisi.`,
    intro: (loc) => [
      `${loc} təhsildə təqaüd imkanları üç qrupda toplanır: universitetin öz akademik bursları, dövlət proqramları və müqavilə əsaslı endirimlər (gpa bursu, qardaş ölkə endirimləri).`,
      "Real praktikada ən böyük qənaət əvvəldən düzgün universitet seçimidir — aşağıda illik təhsil haqqına görə ən əlçatan universitetlər sıralanıb. Büdcənizi hesablarkən yataqxana və yaşayış xərcləri səhifəsindən də istifadə edin.",
    ],
  },
  {
    slug: "yasayis-xercleri",
    title: (loc, y) => `${loc} Yaşayış Xərcləri ${y} — Tələbə Büdcəsi | MegaGroup`,
    h1: (loc, y) => `${loc} Yaşayış Xərcləri ${y}`,
    metaDescription: (loc, name, y) =>
      `${loc} yaşayış xərcləri ${y}: yataqxana, qida, nəqliyyat və şəxsi xərclər ayda/ildə nə qədərdir? ${name} tələbə büdcəsi real rəqəmlərlə.`,
    intro: (loc) => [
      `${loc} yaşayış xərcləri təhsil haqqından ayrı planlaşdırılmalıdır. Aşağıdakı cədvəldə universitetlər üzrə yataqxana, qida, nəqliyyat və şəxsi xərc diapazonları ay ərzində göstərilir.`,
      "Rəqəmlər orta göstəricilərdir — şəhər (paytaxt/kənar), yaşayış forması (yataqxana/kirayə) və həyat tərzindən asılı olaraq dəyişə bilər. Təhsil haqqı ilə birlikdə illik ümumi büdcəni qarşılaşdırmaq üçün təhsil haqqı səhifəsinə keçid edin.",
    ],
  },
];

export function getCountryTopic(slug: string): CountryTopic | undefined {
  return COUNTRY_TOPICS.find((t) => t.slug === slug);
}

/** AZ lokativ forma — sait ahəngi qaydası (bax: src/lib/seo.ts). */
export function azLocative(nameAz: string, slug: string): string {
  const known: Record<string, string> = {
    turkiye: "Türkiyədə",
    rusiya: "Rusiyada",
    ukrayna: "Ukraynada",
    gurcustan: "Gürcüstanda",
    qazaxistan: "Qazaxıstanda",
    almaniya: "Almaniyada",
    polsa: "Polşada",
  };
  if (known[slug]) return known[slug];
  return /ə$/.test(nameAz) ? `${nameAz}də` : `${nameAz}da`;
}

/** RU/EN üçün prefiks formaları. */
export function ruIn(nameRu: string): string {
  return `в ${nameRu}`;
}
export function enIn(nameEn: string): string {
  return `in ${nameEn}`;
}

/** Lokal ölkə adı — topic başlıqları üçün. */
export function countryNameByLocale(
  c: { name_az: string; name_ru: string; name_en: string },
  locale: Locale,
): string {
  return locale === "ru" ? c.name_ru : locale === "en" ? c.name_en : c.name_az;
}

export function topicHeading(
  topic: CountryTopic,
  locale: Locale,
  name: string,
  slug: string,
  year: number,
): string {
  const az = azLocative(name, slug);
  switch (locale) {
    case "ru":
      return topic.slug === "universitetler"
        ? `Университеты ${name}`
        : topic.slug === "tibb"
          ? `Медицинское образование ${ruIn(name)}`
          : topic.slug === "attestatla-qebul"
            ? `Поступление по аттестату ${ruIn(name)}`
            : topic.slug === "tehsil-haqqi"
              ? `Стоимость обучения ${ruIn(name)}`
              : topic.slug === "teqaud"
                ? `Стипендии и гранты ${ruIn(name)}`
                : `Расходы на проживание ${ruIn(name)}`;
    case "en":
      return topic.slug === "universitetler"
        ? `Universities ${enIn(name)}`
        : topic.slug === "tibb"
          ? `Medical Education ${enIn(name)}`
          : topic.slug === "attestatla-qebul"
            ? `Certificate-Based Admission ${enIn(name)}`
            : topic.slug === "tehsil-haqqi"
              ? `Tuition Fees ${enIn(name)}`
              : topic.slug === "teqaud"
                ? `Scholarships ${enIn(name)}`
                : `Living Costs ${enIn(name)}`;
    default:
      return topic.h1(az, year);
  }
}
