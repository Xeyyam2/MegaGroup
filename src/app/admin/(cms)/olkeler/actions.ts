"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { countrySchema } from "@/lib/validations/country.schema";

export async function createCountry(formData: FormData) {
  const parsed = countrySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { error } = await supabase.from("countries").insert(parsed.data);
  if (error) return { error: error.message };
  revalidatePath("/[locale]", "page");
  return { success: true };
}

export async function updateCountry(id: string, formData: FormData) {
  const parsed = countrySchema.partial().safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { error } = await supabase.from("countries").update(parsed.data).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/[locale]", "page");
  return { success: true };
}

export async function deleteCountry(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("countries").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/[locale]", "page");
  return { success: true };
}