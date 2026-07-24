import type { Locale } from "@/i18n/routing";
import { MapPin, Clock, Navigation } from "lucide-react";
import { LOCATION, ADDRESS, HOURS } from "@/data/location";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

const STR: Record<Locale, { title: string; subtitle: string; openMaps: string; directions: string }> = {
  az: { title: "Bizi Tapın", subtitle: "Ofisimiz Bakının mərkəzində yerləşir", openMaps: "Google Maps-də aç", directions: "Yol xəritəsi" },
  ru: { title: "Найдите нас", subtitle: "Наш офис находится в центре Баку", openMaps: "Открыть в Google Maps", directions: "Маршрут" },
  en: { title: "Find Us", subtitle: "Our office is located in central Baku", openMaps: "Open in Google Maps", directions: "Get directions" },
};

export function LocationSection({ locale }: { locale: Locale }) {
  const s = STR[locale] ?? STR.az;
  const addr = ADDRESS[locale] ?? ADDRESS.az;
  const hours = HOURS[locale] ?? HOURS.az;

  return (
    <section id="unvan" className="mx-auto max-w-7xl px-6 py-16">
      <ScrollReveal className="text-center">
        <h2 className="text-balance font-heading text-3xl font-bold text-foreground">{s.title}</h2>
        <p className="mt-2 text-foreground/60">{s.subtitle}</p>
      </ScrollReveal>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <ScrollReveal className="lg:col-span-2">
          <div className="glass-strong flex h-full flex-col justify-center rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary/15 text-brand-primary">
                <MapPin size={20} />
              </span>
              <div>
                <div className="text-sm font-semibold text-foreground">{addr.line1}</div>
                <div className="mt-1 text-sm text-foreground/70">{addr.line2}</div>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary/15 text-brand-primary">
                <Clock size={20} />
              </span>
              <div className="mt-1 text-sm text-foreground/70">{hours}</div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={LOCATION.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                <MapPin size={18} /> {s.openMaps}
              </a>
              <a
                href={LOCATION.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                <Navigation size={18} /> {s.directions}
              </a>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="scale" className="lg:col-span-3">
          <div className="glass-strong overflow-hidden rounded-2xl">
            <iframe
              title="MegaGroup — Google Maps"
              src={LOCATION.embed(locale)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-[300px] w-full sm:h-[380px]"
              style={{ border: 0, filter: "saturate(1.05)" }}
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
