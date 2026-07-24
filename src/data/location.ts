import type { Locale } from "@/i18n/routing";

// Mega Group Academy — Google Maps-də qeydli yer.
// Koordinatlar https://maps.app.goo.gl/3cy38rnZpCqKc59c6 linkindən alınıb.
//
// Maps Embed API açarı. BU GİZLİ DEYİL — Google Maps Embed API açarları
// dizayn etibarilə public-dir (iframe URL-də görünür). Təhlükəsizlik HTTP
// referrer restriction ilə təmin olunur (yalnız megatehsil.com domainində
// işləyir). https://developers.google.com/maps/documentation/embed/get-api-key
const EMBED_KEY = "AIzaSyA4Ss9DnuxBCErSuYKQVwdYLB_Kia4Zu_I";

export const LOCATION = {
  lat: 40.383624,
  lng: 49.8258549,
  mapsLink: "https://maps.app.goo.gl/3cy38rnZpCqKc59c6",
  directions: "https://www.google.com/maps/dir/?api=1&destination=40.383624,49.8258549",
  embed: (locale: Locale) =>
    `https://www.google.com/maps/embed/v1/place?key=${EMBED_KEY}&q=${40.383624},${49.8258549}&zoom=16&language=${locale}&maptype=roadmap`,
};

export const ADDRESS: Record<Locale, { line1: string; line2: string }> = {
  az: { line1: "1 nömrəli Tibb Kollecinin yanında", line2: "Məhəmməd Naxçıvani, Bakı" },
  ru: { line1: "Рядом с 1-м медицинским колледжем", line2: "ул. Мухаммеда Нахичевани, Баку" },
  en: { line1: "Next to 1st Medical College", line2: "Mammad Nakhchivani St., Baku" },
};

export const HOURS: Record<Locale, string> = {
  az: "Bazar ertəsi – Şənbə: 10:00 – 19:00",
  ru: "Понедельник – Суббота: 10:00 – 19:00",
  en: "Monday – Saturday: 10:00 – 19:00",
};
