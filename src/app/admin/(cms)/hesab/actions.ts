"use server";
import { requireAdmin, ADMIN_DENIED } from "@/lib/supabase/auth-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { changeEmailSchema, changePasswordSchema } from "@/lib/validations/account.schema";

type Result = { success: true } | { error: string };

// Supabase auth xətalarını qısa AZ mesajlara salırıq. Tanınmazsa xam mesajı qaytarırıq
// (heç vaxt səssiz udmaq olmaz — admin xətanı görməlidir).
function mapAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("already") && m.includes("register")) return "Bu email artıq istifadə olunur";
  if (m.includes("unique")) return "Bu email artıq istifadə olunur";
  if (m.includes("invalid") && m.includes("email")) return "Email formatı yanlışdır";
  if (m.includes("password") && (m.includes("short") || m.includes("length") || m.includes("weak")))
    return "Parol ən azı 8 simvol olmalıdır";
  return message;
}

// Daxil olmuş adminin ID-sini session client-dən alırıq, sonra service-role ilə
// updateUserById işlədirik ki, email təsdiq flow-u olmasın (dərhal dəyişir).
async function getCurrentUserId(): Promise<string | null> {
  const guard = await requireAdmin();
  if (!guard.authorized) return null;
  const {
    data: { user },
  } = await guard.supabase.auth.getUser();
  return user?.id ?? null;
}

export async function updateEmail(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;

  const parsed = changeEmailSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Yanlış məlumat" };

  const userId = await getCurrentUserId();
  if (!userId) return ADMIN_DENIED;

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(userId, {
    email: parsed.data.email,
    email_confirm: true,
  });
  if (error) {
    console.error("[updateEmail]", error.message);
    return { error: mapAuthError(error.message) };
  }
  return { success: true };
}

export async function updatePassword(formData: FormData): Promise<Result> {
  const guard = await requireAdmin();
  if (!guard.authorized) return ADMIN_DENIED;

  const parsed = changePasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Yanlış məlumat" };

  const userId = await getCurrentUserId();
  if (!userId) return ADMIN_DENIED;

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.updateUserById(userId, {
    password: parsed.data.password,
  });
  if (error) {
    console.error("[updatePassword]", error.message);
    return { error: mapAuthError(error.message) };
  }
  return { success: true };
}
