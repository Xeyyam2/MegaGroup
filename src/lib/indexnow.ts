import { siteUrl } from "@/lib/site";

/**
 * IndexNow protokolu — Bing (ChatGPT/Copilot) və Yandex kimi axtarış
 * sistemlərinə səhifə dəyişikliyini dərhal bildirir. RAG əsaslı AI axtarışı
 * üçün indeks yenilənməsini sürətləndirir.
 *
 * Protokol: https://www.indexnow.org/documentation
 *
 * İstifadə:
 *   1. `public/<key>.txt` faylında açar yerləşdirilir (bax: requestə bax).
 *   2. Revalidate/Lorem build sonrası `pingIndexNow(urlList)` çağırılır.
 *
 * Açarı dəyişdirdikdə həm `INDEXNOW_KEY` env-i, həm də `public/`-dakı faylı
 * yeniləməyi unutma.
 */
export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY || "1c0f3a9e7b4d2e8a5f6c1b9d0e2a7f3c";

/** IndexNow açar faylının yolu (`/<key>.txt`). */
export const indexNowKeyFilePath = `/${INDEXNOW_KEY}.txt`;

const INDEXNOW_ENDPOINT =
  "https://api.indexnow.org/IndexNow";

export interface IndexNowResult {
  ok: boolean;
  status?: number;
  error?: string;
}

/**
 * IndexNow-a URL siyahısı göndərir. Uğursuz olsa da əsas axını sındırmır —
 * yalnız nəticəni qaytarır (fire-and-forget siqnal).
 */
export async function pingIndexNow(urls: string[]): Promise<IndexNowResult> {
  if (urls.length === 0) return { ok: true };
  if (process.env.NODE_ENV !== "production" && !process.env.INDEXNOW_ENABLED) {
    // Dev rejimində real ping etmə — yalnız log.
    return { ok: true };
  }

  const payload = {
    host: new URL(siteUrl).host,
    key: INDEXNOW_KEY,
    keyLocation: `${siteUrl}${indexNowKeyFilePath}`,
    urlList: urls.slice(0, 10000),
  };

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
      // Ağıllı timeout — revalidate axınını göydərməmək üçün.
      signal: AbortSignal.timeout(8000),
    });
    // 200 = tam uğur, 202 = qəbul edildi (sonra emal olunacaq).
    if (res.status === 200 || res.status === 202) {
      return { ok: true, status: res.status };
    }
    return { ok: false, status: res.status, error: `IndexNow ${res.status}` };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "IndexNow ping failed";
    return { ok: false, error: msg };
  }
}
