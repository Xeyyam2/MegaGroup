"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { siteContentSchema } from "@/lib/validations/site-content.schema";

export async function saveSiteContent(key: string, formData: FormData) {
  const parsed = siteContentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_content")
    .upsert({ key, value_az: parsed.data.value_az, value_ru: parsed.data.value_ru ?? "", value_en: parsed.data.value_en ?? "" }, { onConflict: "key" });
  if (error) return { error: error.message };
  revalidatePath("/[locale]", "page");
  return { success: true };
}