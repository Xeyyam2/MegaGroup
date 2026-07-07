// Country markers shown on the hero globe as the visitor scrolls.
// Kept in sync with the `journey.countries` i18n namespace (az/ru/en)
// so no new translation keys are required.
export interface HeroCountryMarker {
  id: "azerbaijan" | "turkey" | "russia" | "georgia" | "kazakhstan";
  flag: string;
  lat: number;
  lon: number;
}

export const HERO_COUNTRY_MARKERS: HeroCountryMarker[] = [
  { id: "azerbaijan", flag: "🇦🇿", lat: 40.4093, lon: 49.8671 },
  { id: "turkey", flag: "🇹🇷", lat: 39.9334, lon: 32.8597 },
  { id: "russia", flag: "🇷🇺", lat: 55.7558, lon: 37.6173 },
  { id: "georgia", flag: "🇬🇪", lat: 41.7151, lon: 44.8271 },
  { id: "kazakhstan", flag: "🇰🇿", lat: 51.1605, lon: 71.4704 },
];

/**
 * Deterministic circular layout used by the CSS-only fallback on mobile /
 * reduced-motion, where the WebGL globe isn't rendered. Returns [top%, left%].
 */
export function hero2DFallbackPosition(index: number, total: number): { top: string; left: string } {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const radius = 42; // % of the container box
  const top = 50 + Math.sin(angle) * radius;
  const left = 50 + Math.cos(angle) * radius;
  return { top: `${top}%`, left: `${left}%` };
}
