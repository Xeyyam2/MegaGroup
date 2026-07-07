"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Lang = "az" | "ru" | "en";

export function LanguageTabs({ children }: { children: (lang: Lang) => React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("az");
  const tabs: { id: Lang; label: string; required?: boolean }[] = [
    { id: "az", label: "AZ", required: true },
    { id: "ru", label: "RU" },
    { id: "en", label: "EN" },
  ];
  return (
    <div>
      <div className="flex gap-2 border-b border-white/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setLang(t.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              lang === t.id
                ? "border-b-2 border-brand-primary text-brand-primary"
                : "text-foreground/60 hover:text-foreground",
            )}
          >
            {t.label}
            {t.required && <span className="ml-1 text-red-400">*</span>}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} className={cn("mt-4", lang === t.id ? "block" : "hidden")}>
          {children(t.id)}
        </div>
      ))}
    </div>
  );
}