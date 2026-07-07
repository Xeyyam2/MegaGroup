import { createClient } from "@/lib/supabase/server";
import { mapTestimonialRow } from "./mappers";
import { isSupabaseConfigured } from "./config";
import {
  testimonials as staticTestimonials,
  getTestimonialsByCountry as staticByCountry,
  getTestimonialsByUniversity as staticByUniversity,
} from "@/data/testimonials";
import type { Testimonial, Locale } from "@/types";

export async function getTestimonials(locale: Locale): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) {
    return staticTestimonials;
  }
  const supabase = await createClient();
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

export async function getTestimonialsByCountry(
  countrySlug: string,
  locale: Locale,
): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) {
    return staticByCountry(countrySlug);
  }
  const supabase = await createClient();
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

export async function getTestimonialsByUniversity(
  universitySlug: string,
  locale: Locale,
): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) {
    return staticByUniversity(universitySlug);
  }
  const supabase = await createClient();
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
