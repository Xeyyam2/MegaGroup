import { createClient } from "@/lib/supabase/server";
import { mapFaqRow } from "./mappers";
import { isSupabaseConfigured } from "./config";
import {
  getGeneralFAQs as staticGeneral,
  getFAQsByCountry as staticByCountry,
  getFAQsByUniversity as staticByUniversity,
} from "@/data/faqs";
import type { FAQ, Locale } from "@/types";

export async function getGeneralFAQs(locale: Locale): Promise<FAQ[]> {
  if (!isSupabaseConfigured()) {
    return staticGeneral();
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("faqs").select("*").order("sort_order");
  if (error) {
    console.warn("[faqs] Supabase error, statik fallback:", error.message);
    return staticGeneral();
  }
  return (data ?? [])
    .filter((f) => !f.country_slug && !f.university_slug)
    .map((row) => mapFaqRow(row, locale));
}

export async function getFAQsByCountry(countrySlug: string, locale: Locale): Promise<FAQ[]> {
  if (!isSupabaseConfigured()) {
    return staticByCountry(countrySlug);
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .or(`country_slug.eq.${countrySlug},country_slug.is.null`)
    .order("sort_order");
  if (error) {
    return staticByCountry(countrySlug);
  }
  return (data ?? []).map((row) => mapFaqRow(row, locale));
}

export async function getFAQsByUniversity(universitySlug: string, locale: Locale): Promise<FAQ[]> {
  if (!isSupabaseConfigured()) {
    return staticByUniversity(universitySlug);
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .or(`university_slug.eq.${universitySlug},university_slug.is.null`)
    .order("sort_order");
  if (error) {
    return staticByUniversity(universitySlug);
  }
  return (data ?? []).map((row) => mapFaqRow(row, locale));
}
