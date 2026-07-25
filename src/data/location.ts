import type { Locale } from "@/i18n/routing";

// Mega Group Academy — Google Maps-də qeydli yer.
// Koordinatlar https://maps.app.goo.gl/3cy38rnZpCqKc59c6 linkindən alınıb.
//
// Xəritə OpenStreetMap embedidir. Google Maps Embed API iframe bəzi
// brauzerlərdə/regionlarda "www.google.com refused to connect" verir
// (Google-un consent/region blokmasıı — bizim tərəfdən düzəlmir). OSM
// açarsız və həmişə işləyir; "Google Maps-də aç" düyməsi tam Google
// təcrübəsinə (business adı, directions) aparır.
export const LOCATION = {
  lat: 40.383624,
  lng: 49.8258549,
  mapsLink: "https://maps.app.goo.gl/3cy38rnZpCqKc59c6",
  directions: "https://www.google.com/maps/dir/?api=1&destination=40.383624,49.8258549",
  embed:
    "https://www.openstreetmap.org/export/embed.html?bbox=49.82085,40.37862,49.83085,40.38862&layer=mapnik&marker=40.383624,49.8258549",
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
