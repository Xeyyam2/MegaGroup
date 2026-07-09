"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin, ADMIN_DENIED } from "@/lib/supabase/auth-guard";
import { siteContentSchema } from "@/lib/validations/site-content.schema";

export async function saveSiteContent(key: string, formData: FormData) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const parsed = siteContentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { supabase } = guard;
  const { error } = await supabase
    .from("site_content")
    .upsert({ key, value_az: parsed.data.value_az, value_ru: parsed.data.value_ru ?? "", value_en: parsed.data.value_en ?? "" }, { onConflict: "key" });
  if (error) {
    console.error("[saveSiteContent]", error.message);
    return { error: error.message };
  }
  revalidatePath("/[locale]", "page");
  revalidateTag("site-content", "default");
  return { success: true };
}
