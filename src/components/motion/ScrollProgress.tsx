"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const el = ref.current;
    let ticking = false;

    function update() {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? scrolled / max : 0;
      el.style.transform = `scaleX(${pct})`;
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div className="fixed left-0 top-0 z-[60] h-0.5 w-full origin-left">
      <div
        ref={ref}
        className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary transition-transform"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
