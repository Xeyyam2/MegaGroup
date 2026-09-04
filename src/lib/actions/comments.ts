"use server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isRateLimited } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { commentSchema } from "@/lib/validations/comment.schema";

/**
 * Public UGC sual formu — seo.md 5.5 (P2).
 * createApplication ilə eyni təhlükəsizlik sxemi: honeypot + rate-limit +
 * Turnstile + zod validasiya. Moderasiya: sual əvvəlcə is_published=false
 * yazılır, admin panelində təsdiqlənəndən sonra dərc olunur (spam/UGC keyfiyyəti).
 * Xəta təfərrüatı client-ə getmir — yalnız server-də loglanır.
 */
export async function createComment(formData: FormData) {
  const honeypot = formData.get("website");
  if (honeypot && String(honeypot).trim() !== "") {
    return { success: true };
  }

  if (await isRateLimited()) {
    return { error: "Çoxsaylı göndəriş etdiniz. Bir azdan yenidən cəhd edin." };
  }

  const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");
  if (!(await verifyTurnstile(turnstileToken))) {
    return { error: "Təhlükəsizlik yoxlaması uğursuz oldu. Yenidən cəhd edin." };
  }

  const parsed = commentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const supabase = createAdminClient();
  const { error } = await supabase.from("comments").insert({
    article_slug: parsed.data.article_slug,
    author_name: parsed.data.author_name,
    question: parsed.data.question,
    is_published: false,
  });
  if (error) {
    console.error("[createComment]", error.message);
    return { error: "Sualınız göndərilərkən xəta baş verdi. Bir azdan yenidən cəhd edin." };
  }
  return { success: true };
}
