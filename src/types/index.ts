export const LOCALES = ["az", "ru", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export interface Country {
  id: string;
  slug: string;
  // Lokalize olunmus (mapper terefinden locale-e gore doldurulur)
  name: string;
  // Hamisi saxlanilir (alt-layihe 1 uygunlugu + dashboard redakte ucun)
  name_az: string;
  name_ru: string;
  name_en: string;
  flag_emoji: string;
  description: string;
  description_az: string;
  description_ru: string;
  description_en: string;
  hero_image_url: string;
  sort_order: number;
  is_active: boolean;
  is_featured: boolean;
  quick_stats: {
    universities: number;
    avg_tuition_usd: number;
    language: string;
    language_az: string;
    language_ru: string;
    language_en: string;
    visa_difficulty: "easy" | "medium" | "hard";
  };
  advantages: string[];
  advantages_az: string[];
  advantages_ru: string[];
  advantages_en: string[];
  warning_banner?: string;
  warning_banner_az?: string;
  warning_banner_ru?: string;
  warning_banner_en?: string;
  documents_required: string[];
  documents_required_az: string[];
  documents_required_ru: string[];
  documents_required_en: string[];
  application_steps: { step: number; title: string; description: string }[];
  application_steps_az: { step: number; title: string; description: string }[];
  application_steps_ru: { step: number; title: string; description: string }[];
  application_steps_en: { step: number; title: string; description: string }[];
}

export interface Faculty {
  id: string;
  university_id: string;
  university_slug: string;
  name: string;
  name_az: string;
  name_ru: string;
  name_en: string;
  is_competitive: boolean;
  duration_years: number;
  language: string;
  sort_order: number;
}

export interface UniversityFee {
  tuition_min_usd: number;
  tuition_max_usd: number;
  dorm_min_usd: number;
  dorm_max_usd: number;
  food_min_usd: number;
  food_max_usd: number;
  transport_min_usd: number;
  transport_max_usd: number;
  personal_min_usd: number;
  personal_max_usd: number;
}

export interface University {
  id: string;
  slug: string;
  country_slug: string;
  name: string;
  name_az: string;
  name_ru: string;
  name_en: string;
  city: string;
  city_az: string;
  city_ru: string;
  city_en: string;
  website_url: string;
  logo_url: string;
  hero_image_url: string;
  is_featured: boolean;
  is_active: boolean;
  highlights: string[];
  highlights_az: string[];
  highlights_ru: string[];
  highlights_en: string[];
  faculties: Faculty[];
  fees: UniversityFee;
  notes?: string;
  notes_az?: string;
  notes_ru?: string;
  notes_en?: string;
  campus_info?: string;
  campus_info_az?: string;
  campus_info_ru?: string;
  campus_info_en?: string;
}

export interface Testimonial {
  id: string;
  student_name: string;
  university_slug: string;
  country_slug: string;
  photo_url: string;
  quote: string;
  quote_az: string;
  quote_ru: string;
  quote_en: string;
  year: number;
}

export interface FAQ {
  id: string;
  question: string;
  question_az: string;
  question_ru: string;
  question_en: string;
  answer: string;
  answer_az: string;
  answer_ru: string;
  answer_en: string;
  country_slug?: string;
  university_slug?: string;
  sort_order: number;
}

export interface CostData {
  university_slug: string;
  fees: UniversityFee;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SiteContent {
  key: string;
  value: string;
  value_az: string;
  value_ru: string;
  value_en: string;
}

export type ApplicationStatus = "yeni" | "goruldu" | "qebul_edildi" | "imtina";

export interface Application {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  country_interest: string | null;
  attestat_avg: number | null;
  message: string | null;
  status: ApplicationStatus;
  created_at: string;
}
