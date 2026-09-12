import type { Locale } from "@/types";

export const WHATSAPP_NUMBER = "994519999370";
export const DEFAULT_WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

// Ziyarətçi saytdan WhatsApp-a yazanda mesajın "saytdan gəldiyi" bilinsin —
// wa.me-nun ?text= parametri ilə hazır (prefill) mesaj qoyulur. Üç dil.
const WA_MESSAGES: Record<Locale, string> = {
  az: "Salam! MegaGroup saytınızdan yazıram — xaricdə təhsil üçün məlumat almaq istəyirəm.",
  ru: "Здравствуйте! Пишу с вашего сайта MegaGroup — хочу получить информацию об обучении за рубежом.",
  en: "Hello! I'm writing from the MegaGroup website — I'd like to learn more about studying abroad.",
};

// WhatsApp linkini hazır mesaj ilə qaytarır. Əgər base-də artıq ?text= varsa
// (məs. admin paneldən xüsusi mesaj qoyulubsa) — toxunmur.
export function whatsappUrl(locale: string, base?: string): string {
  const url = base?.trim() || DEFAULT_WHATSAPP_URL;
  if (/[?&]text=/.test(url)) return url;
  const sep = url.includes("?") ? "&" : "?";
  const msg = WA_MESSAGES[locale as Locale] ?? WA_MESSAGES.az;
  return `${url}${sep}text=${encodeURIComponent(msg)}`;
}