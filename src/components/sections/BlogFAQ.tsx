"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ArticleFAQItem } from "@/data/articles";

export function BlogFAQ({ faqs }: { faqs: ArticleFAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((f, i) => {
        const open = openIdx === i;
        return (
          <div key={f.question} className="glass overflow-hidden rounded-xl">
            <button
              type="button"
              onClick={() => setOpenIdx(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-primary"
            >
              <span className="font-medium text-foreground">{f.question}</span>
              <ChevronDown
                size={20}
                className={cn("shrink-0 text-foreground/60 transition-transform", open && "rotate-180")}
              />
            </button>
            {open && <div className="px-5 pb-4 text-sm text-foreground/75">{f.answer}</div>}
          </div>
        );
      })}
    </div>
  );
}
