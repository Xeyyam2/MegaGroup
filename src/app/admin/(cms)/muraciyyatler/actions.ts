"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { contactSchema } from "@/lib/validations/contact.schema";

// Public müraciət formasından gələn məlumatı applications cədvəlinə yazır.
// Service role (admin) istifadə edirik ki, RLS/GRANT problemi olmasın —
// public form hər halda işləsin (anon-a INSERT GRANT verilməsə belə).
export async function createApplication(formData: FormData) {
  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const supabase = createAdminClient();
  const { error } = await supabase.from("applications").insert({
    full_name: parsed.data.full_name,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    country_interest: parsed.data.country_interest,
    attestat_avg: parsed.data.attestat_avg ?? null,
    message: parsed.data.message || null,
    status: "yeni",
  });
  if (error) return { error: error.message };
  return { success: true };
}

// Admin: müraciətin statusunu yeniləyir (yeni/goruldu/qebul_edildi/imtina)
export async function updateApplicationStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("applications").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/muraciyyatler");
  revalidatePath(`/admin/muraciyyatler/${id}`);
  return { success: true };
}

// Admin: müraciəti silir
export async function deleteApplication(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/muraciyyatler");
  return { success: true };
}

// Sidebar badge üçün: "yeni" statusundakı müraciətlərin sayı
export async function getNewApplicationsCount() {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("status", "yeni");
  if (error) return 0;
  return count ?? 0;
}
