"use client";
import { useEffect } from "react";
import type Lenis from "lenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * SEO/Performance (seo.md 6.4 — P0-2):
 * gsap + lenis statik import idi → layout hər səhifədə (bloq, universitet,
 * haqqımızda) bu kitabxanaları egerload edirdi. İndi yalnız effect işə düşən
 * anda (desktop + reduced-motion deyil) dinamik import olunur — ilkin JS
 * bundle-da heç biri yoxdur. Statik HTML renderini heç bir şəkildə
 * bloklamır (client-only effektdir), SEO üçün risk yoxdur.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    // Touch / coarse-pointer cihazlarda Lenis smooth-wheel mobil INP-ni
    // pisləşdirir və faydasızdır (touch ekranında wheel yoxdur).
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let cancelled = false;
    let lenis: Lenis | null = null;
    let removeRaf: (() => void) | null = null;

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      lenis = new Lenis({ duration: 1.2, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      removeRaf = () => gsap.ticker.remove(raf);
    })();

    return () => {
      cancelled = true;
      removeRaf?.();
      lenis?.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
