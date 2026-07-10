// Server action xətaları üçün mərkəzləşdirilmiş handler.
// Detalı server-də loglayır, client-ə ümumi mesaj qaytarır ki
// Supabase schema/sütun/constraint adları sızmasın.
export function handleActionError(scope: string, error: unknown): { error: string } {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[${scope}]`, message);
  return { error: "Əməliyyat zamanı xəta baş verdi. Yenidən cəhd edin." };
}
