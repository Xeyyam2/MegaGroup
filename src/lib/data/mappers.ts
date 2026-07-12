import type { Country, Faculty, University, FAQ, Testimonial, SiteContent, Locale } from "@/types";
import { countries as staticCountries } from "@/data/countries";
import type { Database } from "@/types/db.generated";

export function pickLocalized(locale: Locale, az: string | null, ru?: string | null, en?: string | null): string {
  if (locale === "ru") return ru && ru !== "" ? ru : az ?? "";
  if (locale === "en") return en && en !== "" ? en : az ?? "";
  return az ?? "";
}

export function pickLocalizedArray<T>(
  locale: Locale,
  az: T[] | null,
  ru?: T[] | null,
  en?: T[] | null,
): T[] {
  if (locale === "ru" && ru && ru.length) return ru;
  if (locale === "en" && en && en.length) return en;
  return az ?? [];
}

export function mapCountryRow(row: Database["public"]["Tables"]["countries"]["Row"], locale: Locale): Country {
  const sc = staticCountries.find((c) => c.slug === row.slug);
  return {
    id: row.id,
    slug: row.slug,
    name: pickLocalized(locale, row.name_az, row.name_ru, row.name_en),
    name_az: row.name_az,
    name_ru: row.name_ru ?? row.name_az,
    name_en: row.name_en ?? row.name_az,
    flag_emoji: row.flag_emoji ?? "",
    description: pickLocalized(locale, row.description_az, row.description_ru, row.description_en),
    description_az: row.description_az ?? "",
    description_ru: row.description_ru ?? "",
    description_en: row.description_en ?? "",
    hero_image_url: row.hero_image_url ?? "",
    sort_order: row.sort_order ?? 0,
    is_active: row.is_active ?? true,
    is_featured: row.is_featured ?? false,
    quick_stats: {
      universities: row.qs_universities ?? 0,
      avg_tuition_usd: row.qs_avg_tuition_usd ?? 0,
      language: row.qs_language ?? "",
      language_az: sc?.quick_stats.language_az ?? row.qs_language ?? "",
      language_ru: sc?.quick_stats.language_ru ?? row.qs_language ?? "",
      language_en: sc?.quick_stats.language_en ?? row.qs_language ?? "",
      visa_difficulty: row.qs_visa_difficulty ?? "medium",
    },
    advantages: pickLocalizedArray(locale, row.advantages_az, row.advantages_ru, row.advantages_en),
    warning_banner:
      pickLocalized(locale, row.warning_banner_az, row.warning_banner_ru, row.warning_banner_en) || undefined,
    warning_banner_az: row.warning_banner_az ?? undefined,
    warning_banner_ru: row.warning_banner_ru ?? undefined,
    warning_banner_en: row.warning_banner_en ?? undefined,
    documents_required: pickLocalizedArray(locale, row.documents_az, row.documents_ru, row.documents_en),
    documents_required_az: row.documents_az ?? [],
    documents_required_ru: row.documents_ru ?? [],
    documents_required_en: row.documents_en ?? [],
    application_steps: pickLocalizedArray(locale, row.steps_az, row.steps_ru, row.steps_en),
    application_steps_az: row.steps_az ?? [],
    application_steps_ru: row.steps_ru ?? [],
    application_steps_en: row.steps_en ?? [],
    advantages_az: row.advantages_az ?? [],
    advantages_ru: row.advantages_ru ?? [],
    advantages_en: row.advantages_en ?? [],
  };
}

export function mapFacultyRow(row: Database["public"]["Tables"]["faculties"]["Row"], locale: Locale): Faculty {
  return {
    id: row.id,
    university_id: row.university_slug,
    university_slug: row.university_slug,
    name: pickLocalized(locale, row.name_az, row.name_ru, row.name_en),
    name_az: row.name_az,
    name_ru: row.name_ru ?? row.name_az,
    name_en: row.name_en ?? row.name_az,
    is_competitive: row.is_competitive ?? false,
    duration_years: row.duration_years ?? 4,
    language: row.language ?? "",
    sort_order: row.sort_order ?? 0,
  };
}

export function mapUniversityRow(
  row: Database["public"]["Tables"]["universities"]["Row"],
  faculties: Database["public"]["Tables"]["faculties"]["Row"][],
  fees: Database["public"]["Tables"]["university_fees"]["Row"] | null,
  locale: Locale,
): University {
  const defaultFees = {
    tuition_min_usd: 0,
    tuition_max_usd: 0,
    dorm_min_usd: 0,
    dorm_max_usd: 0,
    food_min_usd: 0,
    food_max_usd: 0,
    transport_min_usd: 0,
    transport_max_usd: 0,
    personal_min_usd: 0,
    personal_max_usd: 0,
  };
  return {
    id: row.id,
    slug: row.slug,
    country_slug: row.country_slug,
    name: pickLocalized(locale, row.name_az, row.name_ru, row.name_en),
    name_az: row.name_az,
    name_ru: row.name_ru ?? row.name_az,
    name_en: row.name_en ?? row.name_az,
    city: pickLocalized(locale, row.city_az, row.city_ru, row.city_en),
    city_az: row.city_az,
    city_ru: row.city_ru ?? row.city_az,
    city_en: row.city_en ?? row.city_az,
    website_url: row.website_url ?? "",
    logo_url: row.logo_url ?? "",
    hero_image_url: row.hero_image_url ?? "",
    is_featured: row.is_featured ?? false,
    is_active: row.is_active ?? true,
    highlights: pickLocalizedArray(locale, row.highlights_az, row.highlights_ru, row.highlights_en),
    highlights_az: row.highlights_az ?? [],
    highlights_ru: row.highlights_ru ?? [],
    highlights_en: row.highlights_en ?? [],
    faculties: faculties.map((f) => mapFacultyRow(f, locale)),
    fees: fees ?? defaultFees,
    notes: pickLocalized(locale, row.notes_az, row.notes_ru, row.notes_en) || undefined,
    notes_az: row.notes_az,
    notes_ru: row.notes_ru,
    notes_en: row.notes_en,
    campus_info:
      pickLocalized(locale, row.campus_info_az, row.campus_info_ru, row.campus_info_en) || undefined,
    campus_info_az: row.campus_info_az,
    campus_info_ru: row.campus_info_ru,
    campus_info_en: row.campus_info_en,
  };
}

export function mapFaqRow(row: Database["public"]["Tables"]["faqs"]["Row"], locale: Locale): FAQ {
  return {
    id: row.id,
    question: pickLocalized(locale, row.question_az, row.question_ru, row.question_en),
    question_az: row.question_az,
    question_ru: row.question_ru ?? row.question_az,
    question_en: row.question_en ?? row.question_az,
    answer: pickLocalized(locale, row.answer_az, row.answer_ru, row.answer_en),
    answer_az: row.answer_az,
    answer_ru: row.answer_ru ?? row.answer_az,
    answer_en: row.answer_en ?? row.answer_az,
    country_slug: row.country_slug ?? undefined,
    university_slug: row.university_slug ?? undefined,
    sort_order: row.sort_order ?? 0,
  };
}

export function mapTestimonialRow(row: Database["public"]["Tables"]["testimonials"]["Row"], locale: Locale): Testimonial {
  return {
    id: row.id,
    student_name: row.student_name,
    university_slug: row.university_slug ?? "",
    country_slug: row.country_slug ?? "",
    photo_url: row.photo_url ?? "",
    quote: pickLocalized(locale, row.quote_az, row.quote_ru, row.quote_en),
    quote_az: row.quote_az,
    quote_ru: row.quote_ru ?? row.quote_az,
    quote_en: row.quote_en ?? row.quote_az,
    year: row.year ?? new Date().getFullYear(),
  };
}

export function mapSiteContentRow(row: Database["public"]["Tables"]["site_content"]["Row"], locale: Locale): SiteContent {
  return {
    key: row.key,
    value: pickLocalized(locale, row.value_az, row.value_ru, row.value_en),
    value_az: row.value_az,
    value_ru: row.value_ru ?? row.value_az,
    value_en: row.value_en ?? row.value_az,
  };
}
