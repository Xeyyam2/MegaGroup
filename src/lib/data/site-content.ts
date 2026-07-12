import { unstable_cache } from "next/cache";
import { createCacheClient } from "@/lib/supabase/server-cache";
import { mapSiteContentRow } from "./mappers";
import { isSupabaseConfigured } from "./config";
import type { Locale } from "@/types";

const REVALIDATE = 300;

const FALLBACK_AZ: Record<string, string> = {
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

const FALLBACK_RU: Record<string, string> = {
  hero_title: "Учеба за рубежом — аттестат, без экзаменов",
  hero_subtitle: "MegaGroup — Центр обучения за рубежом",
  cta_choose_country: "Выбрать страну",
  cta_apply: "Подать заявку",
  cta_free_consult: "Бесплатная консультация",
  footer_description: "Мы предлагаем азербайджанским студентам обучение за рубежом по аттестату, без экзаменов.",
};

const FALLBACK_EN: Record<string, string> = {
  hero_title: "Study Abroad — Certificate, Exam-Free",
  hero_subtitle: "MegaGroup — Study Abroad Center",
  cta_choose_country: "Choose Country",
  cta_apply: "Apply Now",
  cta_free_consult: "Get Free Consultation",
  footer_description: "We offer Azerbaijani students study-abroad opportunities by certificate, exam-free.",
};

function getFallback(locale: Locale): Record<string, string> {
  const base = FALLBACK_AZ;
  if (locale === "ru") return { ...base, ...FALLBACK_RU };
  if (locale === "en") return { ...base, ...FALLBACK_EN };
  return base;
}

async function fetchSiteContentMap(locale: Locale): Promise<Record<string, string>> {
  if (!isSupabaseConfigured()) {
    return getFallback(locale);
  }
  const supabase = createCacheClient();
  const { data, error } = await supabase.from("site_content").select("*").eq("is_deleted", false);
  if (error) {
    return getFallback(locale);
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
    return getFallback(locale)[key] ?? null;
  }
  const supabase = createCacheClient();
  const { data, error } = await supabase.from("site_content").select("*").eq("is_deleted", false).eq("key", key).single();
  if (error || !data) {
    return getFallback(locale)[key] ?? null;
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
