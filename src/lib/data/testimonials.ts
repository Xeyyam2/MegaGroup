import { unstable_cache } from "next/cache";
import { createCacheClient } from "@/lib/supabase/server-cache";
import { mapTestimonialRow } from "./mappers";
import { isSupabaseConfigured } from "./config";
import {
  testimonials as staticTestimonials,
  getTestimonialsByCountry as staticByCountry,
  getTestimonialsByUniversity as staticByUniversity,
} from "@/data/testimonials";
import type { Testimonial, Locale } from "@/types";

const REVALIDATE = 300;

async function fetchTestimonials(locale: Locale): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) {
    return staticTestimonials;
  }
  const supabase = createCacheClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  if (error) {
    console.warn("[testimonials] Supabase error, statik fallback:", error.message);
    return staticTestimonials;
  }
  return (data ?? []).map((row) => mapTestimonialRow(row, locale));
}

async function fetchTestimonialsByCountry(countrySlug: string, locale: Locale): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) {
    return staticByCountry(countrySlug);
  }
  const supabase = createCacheClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("country_slug", countrySlug)
    .eq("is_active", true)
    .order("sort_order");
  if (error) {
    return staticByCountry(countrySlug);
  }
  return (data ?? []).map((row) => mapTestimonialRow(row, locale));
}

async function fetchTestimonialsByUniversity(universitySlug: string, locale: Locale): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) {
    return staticByUniversity(universitySlug);
  }
  const supabase = createCacheClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("university_slug", universitySlug)
    .eq("is_active", true)
    .order("sort_order");
  if (error) {
    return staticByUniversity(universitySlug);
  }
  return (data ?? []).map((row) => mapTestimonialRow(row, locale));
}

export const getTestimonials = unstable_cache(fetchTestimonials, ["testimonials:all"], {
  revalidate: REVALIDATE,
  tags: ["testimonials"],
});

export const getTestimonialsByCountry = unstable_cache(fetchTestimonialsByCountry, ["testimonials:by-country"], {
  revalidate: REVALIDATE,
  tags: ["testimonials"],
});

export const getTestimonialsByUniversity = unstable_cache(
  fetchTestimonialsByUniversity,
  ["testimonials:by-university"],
  {
    revalidate: REVALIDATE,
    tags: ["testimonials"],
  },
);
