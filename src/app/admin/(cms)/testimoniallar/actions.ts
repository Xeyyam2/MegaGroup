"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { testimonialSchema } from "@/lib/validations/testimonial.schema";

export async function createTestimonial(formData: FormData) {
  const parsed = testimonialSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const data = { ...parsed.data, university_slug: parsed.data.university_slug || null, country_slug: parsed.data.country_slug || null };
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert(data);
  if (error) return { error: error.message };
  revalidatePath("/[locale]", "page");
  return { success: true };
}

export async function updateTestimonial(id: string, formData: FormData) {
  const parsed = testimonialSchema.partial().safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const data = {
    ...parsed.data,
    university_slug: (parsed.data.university_slug ?? "") || null,
    country_slug: (parsed.data.country_slug ?? "") || null,
  };
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").update(data).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/[locale]", "page");
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/[locale]", "page");
  return { success: true };
}