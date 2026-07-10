"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin, ADMIN_DENIED } from "@/lib/supabase/auth-guard";
import { testimonialSchema } from "@/lib/validations/testimonial.schema";
import { idSchema } from "@/lib/validations/common";
import { handleActionError } from "@/lib/handle-action-error";

export async function createTestimonial(formData: FormData) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const parsed = testimonialSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const data = { ...parsed.data, university_slug: parsed.data.university_slug || null, country_slug: parsed.data.country_slug || null };
  const { supabase } = guard;
  const { error } = await supabase.from("testimonials").insert(data);
  if (error) {
    return handleActionError("createTestimonial", error);
  }
  revalidatePath("/[locale]", "page");
  revalidateTag("testimonials", "default");
  return { success: true };
}

export async function updateTestimonial(id: string, formData: FormData) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const idResult = idSchema.safeParse(id);
  if (!idResult.success) return { error: "Yanlış ID" };
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
    return handleActionError("updateTestimonial", error);
  }
  revalidatePath("/[locale]", "page");
  revalidateTag("testimonials", "default");
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const idResult = idSchema.safeParse(id);
  if (!idResult.success) return { error: "Yanlış ID" };
  const { supabase } = guard;
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) {
    return handleActionError("deleteTestimonial", error);
  }
  revalidatePath("/[locale]", "page");
  revalidateTag("testimonials", "default");
  return { success: true };
}
