import { unstable_cache } from "next/cache";
import { createCacheClient } from "@/lib/supabase/server-cache";
import { mapCountryRow } from "./mappers";
import { isSupabaseConfigured } from "./config";
import {
  countries as staticCountries,
  getCountryBySlug as staticGetCountryBySlug,
} from "@/data/countries";
import type { Country, Locale } from "@/types";

const REVALIDATE = 300; // 5 dəqiqə; admin update-də revalidateTag dərhal yeniləyir

async function fetchCountries(locale: Locale): Promise<Country[]> {
  if (!isSupabaseConfigured()) {
    return staticCountries.filter((c) => c.is_active);
  }
  const supabase = createCacheClient();
  const { data, error } = await supabase
    .from("countries")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  if (error) {
    console.warn("[countries] Supabase error, statik fallback:", error.message);
    return staticCountries.filter((c) => c.is_active);
  }
  return (data ?? []).map((row) => mapCountryRow(row, locale));
}

async function fetchCountryBySlug(slug: string, locale: Locale): Promise<Country | null> {
  if (!isSupabaseConfigured()) {
    return staticGetCountryBySlug(slug) ?? null;
  }
  const supabase = createCacheClient();
  const { data, error } = await supabase.from("countries").select("*").eq("slug", slug).single();
  if (error) {
    return staticGetCountryBySlug(slug) ?? null;
  }
  return data ? mapCountryRow(data, locale) : null;
}

async function fetchFeaturedCountries(locale: Locale): Promise<Country[]> {
  if (!isSupabaseConfigured()) {
    return staticCountries.filter((c) => c.is_active && c.is_featured);
  }
  const supabase = createCacheClient();
  const { data, error } = await supabase
    .from("countries")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order");
  if (error) {
    return staticCountries.filter((c) => c.is_active && c.is_featured);
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
