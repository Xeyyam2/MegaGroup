"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduced ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm text-foreground/75">
                    {f.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
