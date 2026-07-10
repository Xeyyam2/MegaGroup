import { unstable_cache } from "next/cache";
import { createCacheClient } from "@/lib/supabase/server-cache";
import { mapSiteContentRow } from "./mappers";
import { isSupabaseConfigured } from "./config";
import type { Locale } from "@/types";

const REVALIDATE = 300;

const FALLBACK: Record<string, string> = {
  hero_title: "Xaricdə Təhsil — Attestatla, İmtahansız",
  hero_subtitle: "MegaGroup — Xaricdə Təhsil Mərkəzi",
  cta_choose_country: "Ölkə Seç",
  cta_apply: "Müraciət Et",
  cta_free_consult: "Pulsuz Konsultasiya Al",
  hero_stat_universities: "200",
  hero_stat_exams: "0",
  hero_stat_countries: "7",
  hero_stat_students: "1000",
  contact_whatsapp: "https://wa.me/994519999370",
  contact_phone: "+994 51 572 35 54",
  contact_email: "info@megagroup.az",
  contact_address: "Bakı, Azərbaycan",
  contact_instagram: "https://www.instagram.com/mega_xaricde_tehsil_merkezi/",
  contact_tiktok: "https://www.tiktok.com/@mega_xaricde_tehsil_merkezi",
  footer_description: "Azərbaycanlı tələbələr üçün xaricdə təhsil imkanlarını attestatla, imtahansız təqdim edirik.",
};

async function fetchSiteContentMap(locale: Locale): Promise<Record<string, string>> {
  if (!isSupabaseConfigured()) {
    return FALLBACK;
  }
  const supabase = createCacheClient();
  const { data, error } = await supabase.from("site_content").select("*").eq("is_deleted", false);
  if (error) {
    return FALLBACK;
  }
  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    const item = mapSiteContentRow(row, locale);
    map[item.key] = item.value;
  }
  return map;
}

async function fetchSiteContent(key: string, locale: Locale): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return FALLBACK[key] ?? null;
  }
  const supabase = createCacheClient();
  const { data, error } = await supabase.from("site_content").select("*").eq("is_deleted", false).eq("key", key).single();
  if (error || !data) {
    return FALLBACK[key] ?? null;
  }
  return mapSiteContentRow(data, locale).value;
}

export const getSiteContentMap = unstable_cache(fetchSiteContentMap, ["site-content:map"], {
  revalidate: REVALIDATE,
  tags: ["site-content"],
});

export const getSiteContent = unstable_cache(fetchSiteContent, ["site-content:key"], {
  revalidate: REVALIDATE,
  tags: ["site-content"],
});
