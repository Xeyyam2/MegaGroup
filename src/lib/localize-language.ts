import type { Locale } from "@/types";

/**
 * Fakültə/qiymət cədvəllərində tədris dili dəyərləri bazada AZ şəklində
 * saxlanılır ("İngilis", "Türkçe", "Rus" ...). RU/EN səhifələrdə bu tokenlər
 * yerli dilə çevrilir — əks halda EN səhifədə "İngilis" kimi yarımçıq çıxır.
 */
const LANG_TOKENS: Record<string, { az: string; ru: string; en: string }> = {
  Türkçe: { az: "Türkçe", ru: "Турецкий", en: "Turkish" },
  İngilis: { az: "İngilis", ru: "Английский", en: "English" },
  Rus: { az: "Rus", ru: "Русский", en: "Russian" },
  Alman: { az: "Alman", ru: "Немецкий", en: "German" },
  Gürcü: { az: "Gürcü", ru: "Грузинский", en: "Georgian" },
  Ukraynaca: { az: "Ukraynaca", ru: "Украинский", en: "Ukrainian" },
  Qazax: { az: "Qazax", ru: "Казахский", en: "Kazakh" },
  Polyak: { az: "Polyak", ru: "Польский", en: "Polish" },
  Azərbaycan: { az: "Azərbaycan", ru: "Азербайджанский", en: "Azerbaijani" },
};

export function localizeLang(raw: string | null | undefined, locale: Locale): string {
  if (!raw) return "";
  if (locale === "az") return raw;
  const key = locale === "ru" ? "ru" : "en";
  return raw
    .split("/")
    .map((part) => part.trim())
    .map((part) => LANG_TOKENS[part]?.[key] ?? part)
    .join("/");
}
