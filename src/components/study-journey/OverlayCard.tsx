"use client";

import { useTranslations } from "next-intl";
import type { JourneyLocation } from "./data";

export function OverlayCard({
  location,
  eyebrow,
}: {
  location: JourneyLocation;
  eyebrow: string;
}) {
  const t = useTranslations("journey");
  return (
    <div className="journey-card w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-white/12 bg-white/[0.08] px-5 py-4 shadow-2xl shadow-blue-950/40 backdrop-blur-xl">
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-blue-200/70">{eyebrow}</div>
      <div className="mt-2 flex items-center gap-3">
        <span className="rounded-md border border-white/10 bg-white/10 px-2 py-1 text-xs font-bold text-white/80">
          {location.flag}
        </span>
        <div>
          <div className="font-heading text-2xl font-bold text-white">{t(`countries.${location.nameKey}`)}</div>
          <div className="text-sm text-blue-100/70">{t(`descriptions.${location.descriptionKey}`)}</div>
        </div>
      </div>
    </div>
  );
}
