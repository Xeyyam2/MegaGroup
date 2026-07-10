import { unstable_cache } from "next/cache";
import { createCacheClient } from "@/lib/supabase/server-cache";
import { mapFaqRow } from "./mappers";
import { isSupabaseConfigured } from "./config";
import {
  getGeneralFAQs as staticGeneral,
  getFAQsByCountry as staticByCountry,
  getFAQsByUniversity as staticByUniversity,
} from "@/data/faqs";
import type { FAQ, Locale } from "@/types";

const REVALIDATE = 300;

async function fetchGeneralFAQs(locale: Locale): Promise<FAQ[]> {
  if (!isSupabaseConfigured()) {
    return staticGeneral();
  }
  const supabase = createCacheClient();
  const { data, error } = await supabase.from("faqs").select("*").eq("is_deleted", false).order("sort_order");
  if (error) {
    console.warn("[faqs] Supabase error, statik fallback:", error.message);
    return staticGeneral();
  }
  return (data ?? [])
    .filter((f) => !f.country_slug && !f.university_slug)
    .map((row) => mapFaqRow(row, locale));
}

async function fetchFAQsByCountry(countrySlug: string, locale: Locale): Promise<FAQ[]> {
  if (!isSupabaseConfigured()) {
    return staticByCountry(countrySlug);
  }
  const supabase = createCacheClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_deleted", false)
    .or(`country_slug.eq.${countrySlug},country_slug.is.null`)
    .order("sort_order");
  if (error) {
    return staticByCountry(countrySlug);
  }
  return (data ?? []).map((row) => mapFaqRow(row, locale));
}

async function fetchFAQsByUniversity(universitySlug: string, locale: Locale): Promise<FAQ[]> {
  if (!isSupabaseConfigured()) {
    return staticByUniversity(universitySlug);
  }
  const supabase = createCacheClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_deleted", false)
    .or(`university_slug.eq.${universitySlug},university_slug.is.null`)
    .order("sort_order");
  if (error) {
    return staticByUniversity(universitySlug);
  }
  return (data ?? []).map((row) => mapFaqRow(row, locale));
}

export const getGeneralFAQs = unstable_cache(fetchGeneralFAQs, ["faqs:general"], {
  revalidate: REVALIDATE,
  tags: ["faqs"],
});

export const getFAQsByCountry = unstable_cache(fetchFAQsByCountry, ["faqs:by-country"], {
  revalidate: REVALIDATE,
  tags: ["faqs"],
});

export const getFAQsByUniversity = unstable_cache(fetchFAQsByUniversity, ["faqs:by-university"], {
  revalidate: REVALIDATE,
  tags: ["faqs"],
});
