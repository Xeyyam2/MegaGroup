"use server";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { requireAdmin, ADMIN_DENIED } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { applicationStatusSchema } from "@/lib/validations/application.schema";
import { idSchema } from "@/lib/validations/common";
import { handleActionError } from "@/lib/handle-action-error";

// Admin: müraciətin statusunu yeniləyir (yeni/goruldu/qebul_edildi/imtina)
export async function updateApplicationStatus(id: string, status: string) {
  const parsed = applicationStatusSchema.safeParse(status);
  if (!parsed.success) return { error: "Yanlış status dəyəri" };
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const idResult = idSchema.safeParse(id);
  if (!idResult.success) return { error: "Yanlış ID" };
  const { supabase } = guard;
  const { error } = await supabase.from("applications").update({ status: parsed.data }).eq("id", id);
  if (error) {
    return handleActionError("updateApplicationStatus", error);
  }
  revalidatePath("/admin/muraciyyatler");
  revalidatePath(`/admin/muraciyyatler/${id}`);
  revalidateTag("applications-count", "default");
  return { success: true };
}

// Admin: müraciəti silir
export async function deleteApplication(id: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const idResult = idSchema.safeParse(id);
  if (!idResult.success) return { error: "Yanlış ID" };
  const { supabase } = guard;
  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) {
    return handleActionError("deleteApplication", error);
  }
  revalidatePath("/admin/muraciyyatler");
  revalidateTag("applications-count", "default");
  return { success: true };
}

// Sidebar badge üçün: "yeni" statusundakı müraciyyetlərin sayı.
// Service-role client istifadə olunur çünki anon RLS ilə applications cədvəlini oxuya bilmir (yalnız INSERT icazəsi var); yalnız tam sayı ifşa olunur, PII yoxdur.
const getNewApplicationsCountCached = unstable_cache(
  async () => {
    const supabase = createAdminClient();
    const { count, error } = await supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("status", "yeni");
    if (error) {
      console.error("[getNewApplicationsCount]", error.message);
      return 0;
    }
    return count ?? 0;
  },
  ["applications-count"],
  { revalidate: 30, tags: ["applications-count"] },
);

export async function getNewApplicationsCount(): Promise<number> {
  const guard = await requireAdmin();
  if (!guard.authorized) return 0;
  return getNewApplicationsCountCached();
}
