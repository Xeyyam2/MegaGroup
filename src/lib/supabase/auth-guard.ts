import { createClient } from "@/lib/supabase/server";

export type AdminGuard =
  | { authorized: true; supabase: Awaited<ReturnType<typeof createClient>> }
  | { authorized: false };

// Admin server action-ları üçün defense-in-depth yoxlaması.
// RLS artıq admin rol tələb edir (0004 migration); bu, ikinci qoruma qatıdır —
// hətta RLS bypass olunsa belə, action icazə vermir.
export async function requireAdmin(): Promise<AdminGuard> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") {
    return { authorized: false };
  }
  return { authorized: true, supabase };
}

export const ADMIN_DENIED = { error: "İcazə yoxdur" };
