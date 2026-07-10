"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin, ADMIN_DENIED } from "@/lib/supabase/auth-guard";
import { universitySchema, facultiesArraySchema, feesSchema } from "@/lib/validations/university.schema";
import { idSchema } from "@/lib/validations/common";
import { handleActionError } from "@/lib/handle-action-error";

export async function createUniversity(formData: FormData) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const parsed = universitySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { supabase } = guard;
  const { highlights_az, highlights_ru, highlights_en, ...rest } = parsed.data;
  const { error } = await supabase.from("universities").insert({
    ...rest,
    highlights_az: highlights_az ? highlights_az.split("\n").filter(Boolean) : [],
    highlights_ru: highlights_ru ? highlights_ru.split("\n").filter(Boolean) : [],
    highlights_en: highlights_en ? highlights_en.split("\n").filter(Boolean) : [],
  });
  if (error) {
    return handleActionError("createUniversity", error);
  }
  revalidatePath("/[locale]", "page");
  revalidateTag("universities", "default");
  return { success: true };
}

export async function updateUniversity(id: string, formData: FormData) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const idResult = idSchema.safeParse(id);
  if (!idResult.success) return { error: "Yanlış ID" };
  const parsed = universitySchema.partial().safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { supabase } = guard;
  const { highlights_az, highlights_ru, highlights_en, ...rest } = parsed.data;
  const { error } = await supabase
    .from("universities")
    .update({
      ...rest,
      ...(highlights_az !== undefined ? { highlights_az: highlights_az.split("\n").filter(Boolean) } : {}),
      ...(highlights_ru !== undefined ? { highlights_ru: highlights_ru.split("\n").filter(Boolean) } : {}),
      ...(highlights_en !== undefined ? { highlights_en: highlights_en.split("\n").filter(Boolean) } : {}),
    })
    .eq("id", id);
  if (error) {
    return handleActionError("updateUniversity", error);
  }
  revalidatePath("/[locale]", "page");
  revalidateTag("universities", "default");
  return { success: true };
}

export async function deleteUniversity(id: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const idResult = idSchema.safeParse(id);
  if (!idResult.success) return { error: "Yanlış ID" };
  const { supabase } = guard;
  const { data: u } = await supabase.from("universities").select("slug").eq("id", id).single();
  const { error } = await supabase.from("universities").delete().eq("id", id);
  if (error) {
    return handleActionError("deleteUniversity", error);
  }
  revalidatePath("/[locale]", "page");
  revalidateTag("universities", "default");
  return { success: true, slug: u?.slug };
}

export async function saveFaculties(universitySlug: string, faculties: unknown[]) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const parsedFaculties = facultiesArraySchema.safeParse(faculties);
  if (!parsedFaculties.success) return { error: "Fakültə məlumatları yararsız" };
  const { supabase } = guard;
  await supabase.from("faculties").delete().eq("university_slug", universitySlug);
  for (const f of parsedFaculties.data) {
    const { error } = await supabase.from("faculties").insert({ university_slug: universitySlug, ...f });
    if (error) {
      return handleActionError("saveFaculties", error);
    }
  }
  revalidatePath("/[locale]", "page");
  revalidateTag("universities", "default");
  return { success: true };
}

export async function saveFees(universitySlug: string, fees: unknown) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const parsedFees = feesSchema.safeParse(fees);
  if (!parsedFees.success) return { error: "Ödəniş məlumatları yararsız" };
  const { supabase } = guard;
  const { error } = await supabase
    .from("university_fees")
    .upsert({ university_slug: universitySlug, ...parsedFees.data }, { onConflict: "university_slug" });
  if (error) {
    return handleActionError("saveFees", error);
  }
  revalidatePath("/[locale]", "page");
  revalidateTag("universities", "default");
  return { success: true };
}
