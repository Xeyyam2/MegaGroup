"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdmin, ADMIN_DENIED } from "@/lib/supabase/auth-guard";
import { idSchema } from "@/lib/validations/common";
import { z } from "zod";
import { handleActionError } from "@/lib/handle-action-error";

/** UGC moderation — seo.md 5.5 (P2). Dərc et / cavabla / sil / bərpa et. */

const answerSchema = z.object({
  answer: z.string().trim().min(2, "Cavab minimum 2 simvol olmalıdır").max(2000),
});

function revalidateComments() {
  revalidatePath("/[locale]", "page");
  revalidateTag("comments", "default");
}

export async function publishComment(id: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const idResult = idSchema.safeParse(id);
  if (!idResult.success) return { error: "Yanlış ID" };
  const { error } = await guard.supabase
    .from("comments")
    .update({ is_published: true, published_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return handleActionError("publishComment", error);
  revalidateComments();
  return { success: true };
}

export async function unpublishComment(id: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const idResult = idSchema.safeParse(id);
  if (!idResult.success) return { error: "Yanlış ID" };
  const { error } = await guard.supabase
    .from("comments")
    .update({ is_published: false, published_at: null })
    .eq("id", id);
  if (error) return handleActionError("unpublishComment", error);
  revalidateComments();
  return { success: true };
}

export async function answerComment(id: string, formData: FormData) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const idResult = idSchema.safeParse(id);
  if (!idResult.success) return { error: "Yanlış ID" };
  const parsed = answerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  // requireAdmin user obyektini qaytarmır — cavabı verən admini id-lə qeyd edirik.
  const { data: adminUser } = await guard.supabase.auth.getUser();
  const { error } = await guard.supabase
    .from("comments")
    .update({
      answer: parsed.data.answer,
      answered_by: adminUser?.user?.email ?? "admin",
      is_published: true,
      published_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return handleActionError("answerComment", error);
  revalidateComments();
  return { success: true };
}

export async function deleteComment(id: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;
  const idResult = idSchema.safeParse(id);
  if (!idResult.success) return { error: "Yanlış ID" };
  const { error } = await guard.supabase
    .from("comments")
    .update({ is_deleted: true, deleted_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return handleActionError("deleteComment", error);
  revalidateComments();
  return { success: true };
}
