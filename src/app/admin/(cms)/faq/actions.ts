"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { faqSchema } from "@/lib/validations/faq.schema";

export async function createFaq(formData: FormData) {
  const parsed = faqSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const data = { ...parsed.data, country_slug: parsed.data.country_slug || null, university_slug: parsed.data.university_slug || null };
  const supabase = await createClient();
  const { error } = await supabase.from("faqs").insert(data);
  if (error) return { error: error.message };
  revalidatePath("/[locale]", "page");
  return { success: true };
}

export async function updateFaq(id: string, formData: FormData) {
  const parsed = faqSchema.partial().safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const data = {
    ...parsed.data,
    country_slug: (parsed.data.country_slug ?? "") || null,
    university_slug: (parsed.data.university_slug ?? "") || null,
  };
  const supabase = await createClient();
  const { error } = await supabase.from("faqs").update(data).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/[locale]", "page");
  return { success: true };
}

export async function deleteFaq(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/[locale]", "page");
  return { success: true };
}