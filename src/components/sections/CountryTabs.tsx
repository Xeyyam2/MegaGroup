"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Country } from "@/types";

interface CountryTabsProps {
  countries: Country[];
  activeSlug?: string;
  onSelect?: (slug: string) => void;
  localePrefix?: string;
}

export function CountryTabs({ countries, activeSlug, onSelect, localePrefix = "" }: CountryTabsProps) {
  return (
    <div className="glass sticky top-[57px] z-30 hidden border-b border-white/10 md:block">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2 overflow-x-auto px-4 py-3 sm:px-6">
        {countries.map((c) => {
          const active = c.slug === activeSlug;
          const baseClass = cn(
            "whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
            active ? "bg-brand-primary text-white" : "text-foreground/70 hover:bg-white/10",
          );
          if (onSelect) {
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => onSelect(c.slug)}
                className={baseClass}
                aria-pressed={active}
              >
                {c.name}
              </button>
            );
          }
          return (
            <Link
              key={c.slug}
              href={`${localePrefix}/xaricde-tehsil/${c.slug}`}
              className={baseClass}
              aria-current={active ? "page" : undefined}
            >
              {c.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
