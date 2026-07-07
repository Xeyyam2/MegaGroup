"use client";

import { useTranslations } from "next-intl";
import { useCountUp } from "@/hooks/useCountUp";

function Stat({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp({ end, duration: 1200 });
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.075] px-4 py-4 text-center backdrop-blur-xl">
      <span ref={ref} className="font-heading block text-3xl font-bold tabular-nums text-white sm:text-4xl">
        {count}
        {suffix}
      </span>
      <div className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-blue-100/55">{label}</div>
    </div>
  );
}

export function Statistics({ visible }: { visible: boolean }) {
  const t = useTranslations("journey");
  const stats = [
    { end: 1000, suffix: "+", label: t("stats.studentsAbroad") },
    { end: 5, suffix: "", label: t("stats.countries") },
    { end: 50, suffix: "+", label: t("stats.partnerUniversities") },
    { end: 98, suffix: "%", label: t("stats.visaSuccessRate") },
  ];
  return (
    <div
      className={`pointer-events-none mx-auto grid w-[min(54rem,calc(100vw-2rem))] grid-cols-2 gap-3 transition-all duration-700 sm:grid-cols-4 ${
        visible ? "translate-y-0 opacity-100 blur-0" : "translate-y-8 opacity-0 blur-sm"
      }`}
    >
      {stats.map((stat) => (
        <Stat key={stat.label} {...stat} />
      ))}
    </div>
  );
}
