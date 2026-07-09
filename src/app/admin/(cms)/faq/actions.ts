"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin, ADMIN_DENIED } from "@/lib/supabase/auth-guard";
import { faqSchema } from "@/lib/validations/faq.schema";

export async function createFaq(formData: FormData) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const parsed = faqSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const data = { ...parsed.data, country_slug: parsed.data.country_slug || null, university_slug: parsed.data.university_slug || null };
  const { supabase } = guard;
  const { error } = await supabase.from("faqs").insert(data);
  if (error) {
    console.error("[createFaq]", error.message);
    return { error: error.message };
  }
  revalidatePath("/[locale]", "page");
  revalidateTag("faqs", "default");
  return { success: true };
}

export async function updateFaq(id: string, formData: FormData) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const parsed = faqSchema.partial().safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const data = {
    ...parsed.data,
    country_slug: (parsed.data.country_slug ?? "") || null,
    university_slug: (parsed.data.university_slug ?? "") || null,
  };
  const { supabase } = guard;
  const { error } = await supabase.from("faqs").update(data).eq("id", id);
  if (error) {
    console.error("[updateFaq]", error.message);
    return { error: error.message };
  }
  revalidatePath("/[locale]", "page");
  revalidateTag("faqs", "default");
  return { success: true };
}

export async function deleteFaq(id: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const { supabase } = guard;
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) {
    console.error("[deleteFaq]", error.message);
    return { error: error.message };
  }
  revalidatePath("/[locale]", "page");
  revalidateTag("faqs", "default");
  return { success: true };
}
