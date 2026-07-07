"use client";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { calculateMonthlyCost } from "@/data/cost-data";
import type { University } from "@/types";

export function CostCalculator({
  universities,
}: {
  universities: University[];
}) {
  const t = useTranslations("calc");
  const [slug, setSlug] = useState(universities[0]?.slug ?? "");
  const [months, setMonths] = useState(9);

  const ROW_META = [
    { key: "tuition", label: t("tuition"), color: "bg-brand-primary" },
    { key: "dorm", label: t("dorm"), color: "bg-brand-secondary" },
    { key: "food", label: t("food"), color: "bg-brand-accent" },
    { key: "transport", label: t("transport"), color: "bg-info" },
    { key: "personal", label: t("personal"), color: "bg-success" },
  ] as const;

  const result = useMemo(() => {
    const uni = universities.find((u) => u.slug === slug);
    if (!uni) return null;
    return calculateMonthlyCost(uni.fees);
  }, [slug, universities]);

  if (!result) return null;

  const maxMonthly = Math.max(...Object.values(result.monthly), 1);

  return (
    <div className="glass-strong mx-auto max-w-3xl rounded-3xl p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <label className="flex-1">
          <span className="mb-1 block text-sm font-medium text-foreground/80">{t("university")}</span>
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary"
          >
            {universities.map((u) => (
              <option key={u.slug} value={u.slug} className="bg-slate-900">
                {u.name} — {u.city}
              </option>
            ))}
          </select>
        </label>
        <label className="sm:w-56">
          <span className="mb-1 block text-sm font-medium text-foreground/80">
            {t("durationLabel", { months })}
          </span>
          <input
            type="range"
            min={1}
            max={12}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full accent-brand-primary"
          />
        </label>
      </div>

      <div className="mt-6 space-y-3">
        {ROW_META.map((row) => {
          const value = result.monthly[row.key];
          return (
            <div key={row.key}>
              <div className="flex justify-between text-sm">
                <span className="text-foreground/80">{row.label}</span>
                <span className="font-semibold text-foreground">${value}{t("monthlyTotal").includes("/") ? "" : ""}/mo</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${row.color}`}
                  style={{ width: `${(value / maxMonthly) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-xs text-foreground/60">{t("monthlyTotal")}</div>
          <div className="text-2xl font-bold text-brand-primary">${result.total_monthly}</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="text-xs text-foreground/60">{t("periodTotal", { months })}</div>
          <div className="text-2xl font-bold text-brand-secondary">${result.total_period(months)}</div>
        </div>
      </div>
    </div>
  );
}