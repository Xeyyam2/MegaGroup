import { unstable_cache } from "next/cache";
import { createCacheClient } from "@/lib/supabase/server-cache";
import { mapCountryRow } from "./mappers";
import { isSupabaseConfigured } from "./config";
import {
  countries as staticCountries,
  getCountryBySlug as staticGetCountryBySlug,
  localizeCountry,
} from "@/data/countries";
import type { Country, Locale } from "@/types";

const REVALIDATE = 300; // 5 dəqiqə; admin update-də revalidateTag dərhal yeniləyir

async function fetchCountries(locale: Locale): Promise<Country[]> {
  if (!isSupabaseConfigured()) {
    return staticCountries.filter((c) => c.is_active).map((c) => localizeCountry(c, locale));
  }
  const supabase = createCacheClient();
  const { data, error } = await supabase
    .from("countries")
    .select("*")
    .eq("is_deleted", false)
    .eq("is_active", true)
    .order("sort_order");
  if (error) {
    console.warn("[countries] Supabase error, statik fallback:", error.message);
    return staticCountries.filter((c) => c.is_active).map((c) => localizeCountry(c, locale));
  }
  return (data ?? []).map((row) => mapCountryRow(row, locale));
}

async function fetchCountryBySlug(slug: string, locale: Locale): Promise<Country | null> {
  if (!isSupabaseConfigured()) {
    const sc = staticGetCountryBySlug(slug);
    return sc ? localizeCountry(sc, locale) : null;
  }
  const supabase = createCacheClient();
  const { data, error } = await supabase.from("countries").select("*").eq("is_deleted", false).eq("slug", slug).single();
  if (error) {
    const sc = staticGetCountryBySlug(slug);
    return sc ? localizeCountry(sc, locale) : null;
  }
  return data ? mapCountryRow(data, locale) : null;
}

async function fetchFeaturedCountries(locale: Locale): Promise<Country[]> {
  if (!isSupabaseConfigured()) {
    return staticCountries.filter((c) => c.is_active && c.is_featured).map((c) => localizeCountry(c, locale));
  }
  const supabase = createCacheClient();
  const { data, error } = await supabase
    .from("countries")
    .select("*")
    .eq("is_deleted", false)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order");
  if (error) {
    return staticCountries.filter((c) => c.is_active && c.is_featured).map((c) => localizeCountry(c, locale));
  }
  return (data ?? []).map((row) => mapCountryRow(row, locale));
}

export const getCountries = unstable_cache(fetchCountries, ["countries:list"], {
  revalidate: REVALIDATE,
  tags: ["countries"],
});

export const getCountryBySlug = unstable_cache(fetchCountryBySlug, ["countries:by-slug"], {
  revalidate: REVALIDATE,
  tags: ["countries"],
});

export const getFeaturedCountries = unstable_cache(fetchFeaturedCountries, ["countries:featured"], {
  revalidate: REVALIDATE,
  tags: ["countries"],
});
