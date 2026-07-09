"use server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isRateLimited } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { contactSchema } from "@/lib/validations/contact.schema";

// Public müraciət formasından gələn məlumatı applications cədvəlinə yazır.
// Admin route qrupundan ayrıldı — public form admin path-indan asılı deyil (B6).
// Service role (admin) istifadə edirik ki, RLS/GRANT problemi olmasın —
// public form hər halda işləsin (anon-a INSERT GRANT verilməsə belə).
// Xəta təfərrüatı client-ə getmir — yalnız server-də loglanır.
export async function createApplication(formData: FormData) {
  // Honeypot: botlar gizli "website" sahəsini doldurur; real istifadəçi görmür.
  // Doldurulubsa sessiyasız qəbul edirik (bot uğurlu olduğunu düşünsün), amma yazmırıq.
  const honeypot = formData.get("website");
  if (honeypot && String(honeypot).trim() !== "") {
    return { success: true };
  }

  // Rate-limit (Upstash konfiqurasiya olunubsa). Limit aşılıbsa spam hesab edilir.
  if (await isRateLimited()) {
    return { error: "Çoxsaylı müraciət etdiniz. Bir azdan yenidən cəhd edin." };
  }

  // Turnstile (Cloudflare konfiqurasiya olunubsa). Token yoxdursa/keçərsizdirsə rədd.
  const turnstileToken = String(formData.get("cf-turnstile-response") ?? "");
  if (!(await verifyTurnstile(turnstileToken))) {
    return { error: "Təhlükəsizlik yoxlaması uğursuz oldu. Yenidən cəhd edin." };
  }

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
  if (error) {
    console.error("[createApplication]", error.message);
    return { error: "Müraciət göndrilərkən xəta baş verdi. Bir azdan yenidən cəhd edin." };
  }
  return { success: true };
}
