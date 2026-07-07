"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { locales, type Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function switchTo(next: Locale) {
    const segments = pathname.split("/");
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    router.push(segments.join("/") || `/${next}`);
    setOpen(false);
  }

  const labels: Record<Locale, string> = { az: "AZ", ru: "RU", en: "EN" };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Dil seç"
        aria-expanded={open}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/20 px-2.5 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
      >
        <Globe size={16} /> {labels[locale]}
      </button>
      {open && (
        <div className="glass absolute right-0 mt-2 w-32 rounded-xl border border-white/20 p-1 shadow-xl">
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => switchTo(l)}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/10",
                l === locale ? "text-brand-primary" : "text-foreground/80",
              )}
            >
              {labels[l]} {l === locale && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
