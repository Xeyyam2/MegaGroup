import { createClient } from "@/lib/supabase/server";
import { mapUniversityRow } from "./mappers";
import { isSupabaseConfigured } from "./config";
import {
  universities as staticUniversities,
  getUniversitiesByCountry as staticByCountry,
  getUniversityBySlug as staticBySlug,
  getFeaturedUniversity as staticFeatured,
} from "@/data/universities";
import type { University, Locale } from "@/types";

export async function getUniversitiesByCountry(
  countrySlug: string,
  locale: Locale,
): Promise<University[]> {
  if (!isSupabaseConfigured()) {
    return staticByCountry(countrySlug);
  }
  const supabase = await createClient();
  const { data: unis, error } = await supabase
    .from("universities")
    .select("*")
    .eq("country_slug", countrySlug)
    .eq("is_active", true)
    .order("name_az");
  if (error) {
    console.warn("[universities] Supabase error, statik fallback:", error.message);
    return staticByCountry(countrySlug);
  }
  if (!unis?.length) return [];
  const slugs = unis.map((u) => u.slug);
  const { data: faculties } = await supabase
    .from("faculties")
    .select("*")
    .in("university_slug", slugs)
    .order("sort_order");
  const { data: fees } = await supabase
    .from("university_fees")
    .select("*")
    .in("university_slug", slugs);
  const feeMap = new Map((fees ?? []).map((f) => [f.university_slug, f]));
  return unis.map((u) =>
    mapUniversityRow(
      u,
      (faculties ?? []).filter((f) => f.university_slug === u.slug),
      feeMap.get(u.slug),
      locale,
    ),
  );
}

export async function getUniversityBySlug(slug: string, locale: Locale): Promise<University | null> {
  if (!isSupabaseConfigured()) {
    return staticBySlug(slug) ?? null;
  }
  const supabase = await createClient();
  const { data: uni, error } = await supabase
    .from("universities")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) {
    return staticBySlug(slug) ?? null;
  }
  if (!uni) return null;
  const { data: faculties } = await supabase
    .from("faculties")
    .select("*")
    .eq("university_slug", slug)
    .order("sort_order");
  const { data: fees } = await supabase
    .from("university_fees")
    .select("*")
    .eq("university_slug", slug)
    .single();
  return mapUniversityRow(uni, faculties ?? [], fees ?? null, locale);
}

export async function getFeaturedUniversity(
  countrySlug: string,
  locale: Locale,
): Promise<University | null> {
  if (!isSupabaseConfigured()) {
    return staticFeatured(countrySlug) ?? null;
  }
  const supabase = await createClient();
  const { data: uni, error } = await supabase
    .from("universities")
    .select("*")
    .eq("country_slug", countrySlug)
    .eq("is_featured", true)
    .eq("is_active", true)
    .single();
  if (error || !uni) {
    return staticFeatured(countrySlug) ?? null;
  }
  const { data: faculties } = await supabase
    .from("faculties")
    .select("*")
    .eq("university_slug", uni.slug)
    .order("sort_order");
  const { data: fees } = await supabase
    .from("university_fees")
    .select("*")
    .eq("university_slug", uni.slug)
    .single();
  return mapUniversityRow(uni, faculties ?? [], fees ?? null, locale);
}

export async function getAllUniversitySlugs(): Promise<{ slug: string; country_slug: string }[]> {
  if (!isSupabaseConfigured()) {
    return staticUniversities.map((u) => ({ slug: u.slug, country_slug: u.country_slug }));
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("universities")
    .select("slug, country_slug")
    .eq("is_active", true);
  if (error) {
    return staticUniversities.map((u) => ({ slug: u.slug, country_slug: u.country_slug }));
  }
  return data ?? [];
}
