import { createClient } from "@/lib/supabase/server";
import { mapCountryRow } from "./mappers";
import { isSupabaseConfigured } from "./config";
import {
  countries as staticCountries,
  getCountryBySlug as staticGetCountryBySlug,
} from "@/data/countries";
import type { Country, Locale } from "@/types";

export async function getCountries(locale: Locale): Promise<Country[]> {
  if (!isSupabaseConfigured()) {
    return staticCountries.filter((c) => c.is_active);
  }
  const supabase = await createClient();
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

export async function getCountryBySlug(slug: string, locale: Locale): Promise<Country | null> {
  if (!isSupabaseConfigured()) {
    return staticGetCountryBySlug(slug) ?? null;
  }
  const supabase = await createClient();
  const { data, error } = await supabase.from("countries").select("*").eq("slug", slug).single();
  if (error) {
    return staticGetCountryBySlug(slug) ?? null;
  }
  return data ? mapCountryRow(data, locale) : null;
}

export async function getFeaturedCountries(locale: Locale): Promise<Country[]> {
  if (!isSupabaseConfigured()) {
    return staticCountries.filter((c) => c.is_active && c.is_featured);
  }
  const supabase = await createClient();
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
