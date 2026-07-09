"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin, ADMIN_DENIED } from "@/lib/supabase/auth-guard";
import { testimonialSchema } from "@/lib/validations/testimonial.schema";

export async function createTestimonial(formData: FormData) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const parsed = testimonialSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const data = { ...parsed.data, university_slug: parsed.data.university_slug || null, country_slug: parsed.data.country_slug || null };
  const { supabase } = guard;
  const { error } = await supabase.from("testimonials").insert(data);
  if (error) {
    console.error("[createTestimonial]", error.message);
    return { error: error.message };
  }
  revalidatePath("/[locale]", "page");
  revalidateTag("testimonials", "default");
  return { success: true };
}

export async function updateTestimonial(id: string, formData: FormData) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const parsed = testimonialSchema.partial().safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const data = {
    ...parsed.data,
    university_slug: (parsed.data.university_slug ?? "") || null,
    country_slug: (parsed.data.country_slug ?? "") || null,
  };
  const { supabase } = guard;
  const { error } = await supabase.from("testimonials").update(data).eq("id", id);
  if (error) {
    console.error("[updateTestimonial]", error.message);
    return { error: error.message };
  }
  revalidatePath("/[locale]", "page");
  revalidateTag("testimonials", "default");
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const { supabase } = guard;
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) {
    console.error("[deleteTestimonial]", error.message);
    return { error: error.message };
  }
  revalidatePath("/[locale]", "page");
  revalidateTag("testimonials", "default");
  return { success: true };
}
