import { unstable_cache } from "next/cache";
import { createCacheClient } from "@/lib/supabase/server-cache";
import { mapUniversityRow } from "./mappers";
import { isSupabaseConfigured } from "./config";
import {
  universities as staticUniversities,
  getUniversitiesByCountry as staticByCountry,
  getUniversityBySlug as staticBySlug,
  getFeaturedUniversity as staticFeatured,
  localizeUniversity,
} from "@/data/universities";
import type { University, Locale } from "@/types";

const REVALIDATE = 300;

async function fetchUniversitiesByCountry(
  countrySlug: string,
  locale: Locale,
): Promise<University[]> {
  if (!isSupabaseConfigured()) {
    return staticByCountry(countrySlug).map((u) => localizeUniversity(u, locale));
  }
  const supabase = createCacheClient();
  const { data: unis, error } = await supabase
    .from("universities")
    .select("*")
    .eq("is_deleted", false)
    .eq("country_slug", countrySlug)
    .eq("is_active", true)
    .order("name_az");
  if (error) {
    console.warn("[universities] Supabase error, statik fallback:", error.message);
    return staticByCountry(countrySlug).map((u) => localizeUniversity(u, locale));
  }
  if (!unis?.length) return [];
  const slugs = unis.map((u) => u.slug);
  const { data: faculties } = await supabase
    .from("faculties")
    .select("*")
    .eq("is_deleted", false)
    .in("university_slug", slugs)
    .order("sort_order");
  const { data: fees } = await supabase.from("university_fees").select("*").eq("is_deleted", false).in("university_slug", slugs);
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

async function fetchUniversityBySlug(slug: string, locale: Locale): Promise<University | null> {
  if (!isSupabaseConfigured()) {
    const su = staticBySlug(slug); return su ? localizeUniversity(su, locale) : null;
  }
  const supabase = createCacheClient();
  const { data: uni, error } = await supabase.from("universities").select("*").eq("is_deleted", false).eq("slug", slug).single();
  if (error) {
    const su = staticBySlug(slug); return su ? localizeUniversity(su, locale) : null;
  }
  if (!uni) return null;
  const { data: faculties } = await supabase
    .from("faculties")
    .select("*")
    .eq("is_deleted", false)
    .eq("university_slug", slug)
    .order("sort_order");
  const { data: fees } = await supabase
    .from("university_fees")
    .select("*")
    .eq("is_deleted", false)
    .eq("university_slug", slug)
    .single();
  return mapUniversityRow(uni, faculties ?? [], fees ?? null, locale);
}

async function fetchFeaturedUniversity(countrySlug: string, locale: Locale): Promise<University | null> {
  if (!isSupabaseConfigured()) {
    const sf = staticFeatured(countrySlug); return sf ? localizeUniversity(sf, locale) : null;
  }
  const supabase = createCacheClient();
  const { data: uni, error } = await supabase
    .from("universities")
    .select("*")
    .eq("is_deleted", false)
    .eq("country_slug", countrySlug)
    .eq("is_featured", true)
    .eq("is_active", true)
    .single();
  if (error || !uni) {
    const sf = staticFeatured(countrySlug); return sf ? localizeUniversity(sf, locale) : null;
  }
  const { data: faculties } = await supabase
    .from("faculties")
    .select("*")
    .eq("is_deleted", false)
    .eq("university_slug", uni.slug)
    .order("sort_order");
  const { data: fees } = await supabase
    .from("university_fees")
    .select("*")
    .eq("is_deleted", false)
    .eq("university_slug", uni.slug)
    .single();
  return mapUniversityRow(uni, faculties ?? [], fees ?? null, locale);
}

async function fetchAllUniversitySlugs(): Promise<{ slug: string; country_slug: string }[]> {
  if (!isSupabaseConfigured()) {
    return staticUniversities.map((u) => ({ slug: u.slug, country_slug: u.country_slug }));
  }
  const supabase = createCacheClient();
  const { data, error } = await supabase.from("universities").select("slug, country_slug").eq("is_deleted", false).eq("is_active", true);
  if (error) {
    return staticUniversities.map((u) => ({ slug: u.slug, country_slug: u.country_slug }));
  }
  return data ?? [];
}

async function fetchAllUniversities(locale: Locale): Promise<University[]> {
  if (!isSupabaseConfigured()) {
    return staticUniversities.map((u) => localizeUniversity(u, locale));
  }
  const supabase = createCacheClient();
  const { data: unis, error } = await supabase
    .from("universities")
    .select("*")
    .eq("is_deleted", false)
    .eq("is_active", true)
    .order("country_slug")
    .order("name_az");
  if (error || !unis?.length) {
    return staticUniversities.map((u) => localizeUniversity(u, locale));
  }
  const slugs = unis.map((u) => u.slug);
  const { data: faculties } = await supabase
    .from("faculties")
    .select("*")
    .eq("is_deleted", false)
    .in("university_slug", slugs)
    .order("sort_order");
  const { data: fees } = await supabase
    .from("university_fees")
    .select("*")
    .eq("is_deleted", false)
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

export const getUniversitiesByCountry = unstable_cache(fetchUniversitiesByCountry, ["universities:by-country"], {
  revalidate: REVALIDATE,
  tags: ["universities"],
});

export const getUniversityBySlug = unstable_cache(fetchUniversityBySlug, ["universities:by-slug"], {
  revalidate: REVALIDATE,
  tags: ["universities"],
});

export const getFeaturedUniversity = unstable_cache(fetchFeaturedUniversity, ["universities:featured"], {
  revalidate: REVALIDATE,
  tags: ["universities"],
});

export const getAllUniversitySlugs = unstable_cache(fetchAllUniversitySlugs, ["universities:all-slugs"], {
  revalidate: REVALIDATE,
  tags: ["universities"],
});

export const getAllUniversities = unstable_cache(fetchAllUniversities, ["universities:all"], {
  revalidate: REVALIDATE,
  tags: ["universities"],
});
