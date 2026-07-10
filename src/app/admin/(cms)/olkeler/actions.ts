"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin, ADMIN_DENIED } from "@/lib/supabase/auth-guard";
import { countrySchema } from "@/lib/validations/country.schema";
import { handleActionError } from "@/lib/handle-action-error";

export async function createCountry(formData: FormData) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const parsed = countrySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { supabase } = guard;
  const { error } = await supabase.from("countries").insert(parsed.data);
  if (error) {
    return handleActionError("createCountry", error);
  }
  revalidatePath("/[locale]", "page");
  revalidateTag("countries", "default");
  return { success: true };
}

export async function updateCountry(id: string, formData: FormData) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const parsed = countrySchema.partial().safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { supabase } = guard;
  const { error } = await supabase.from("countries").update(parsed.data).eq("id", id);
  if (error) {
    return handleActionError("updateCountry", error);
  }
  revalidatePath("/[locale]", "page");
  revalidateTag("countries", "default");
  return { success: true };
}

export async function deleteCountry(id: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const { supabase } = guard;
  const { error } = await supabase.from("countries").delete().eq("id", id);
  if (error) {
    return handleActionError("deleteCountry", error);
  }
  revalidatePath("/[locale]", "page");
  revalidateTag("countries", "default");
  return { success: true };
}
