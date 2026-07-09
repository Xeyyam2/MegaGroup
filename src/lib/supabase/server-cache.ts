import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cache dostu Supabase klienti: anon açarı, cookie YOX.
// unstable_cache içində cookies()/headers() işləmədiyi üçün bu klient lazımdır.
// Yalnız PUBLIC oxumalar üçün (RLS "public read" policy-ləri anon-a SELECT verir).
// Admin/yazma əməliyyatları üçün cookie-li server klientini istifadə edin.
export function createCacheClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
