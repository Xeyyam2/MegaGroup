"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { cn } from "@/lib/utils";
import type { FAQ } from "@/types";

export function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const reduced = useReducedMotion();

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqs.map((f, i) => {
        const open = openIdx === i;
        return (
          <ScrollReveal key={f.id} delay={Math.min(i, 6) * 0.06}>
            <div className="glass overflow-hidden rounded-xl">
              <button
                type="button"
                onClick={() => setOpenIdx(open ? null : i)}
                aria-expanded={open}
                aria-controls={`faq-answer-${f.id}`}
                id={`faq-question-${f.id}`}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-primary"
              >
                <span className="font-medium text-foreground">{f.question}</span>
                <ChevronDown
                  size={20}
                  className={cn(
                    "shrink-0 text-foreground/60 transition-transform",
                    open && "rotate-180",
                  )}
                />
              </button>
              {/*
                Cavab həmişə DOM-da olur (SEO üçün — Googlebot mətni oxuyur).
                CSS grid-rows trick ilə yumşaq açılış: 0fr -> 1fr.
                display:none İŞLƏNMİR ki, məzmun crawlers üçün gizli qalmaya.
              */}
              <div
                id={`faq-answer-${f.id}`}
                role="region"
                aria-labelledby={`faq-question-${f.id}`}
                className={cn("grid", !reduced && "transition-all duration-300 ease-in-out")}
                style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm text-foreground/75">
                    {f.answer}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
