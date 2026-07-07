"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { destinations, origin } from "./data";
import { OverlayCard } from "./OverlayCard";
import { Scene } from "./Scene";
import { Statistics } from "./Statistics";

gsap.registerPlugin(ScrollTrigger);

// Kept short on purpose: this is the only "nothing new is happening yet"
// window in the whole scroll story. The hero already hands off with a
// dissolve (see HeroSection's --hero-exit), so the journey should pick up
// the motion almost immediately rather than sitting still for a while.
const ENTRY_DEADZONE = 0.08;
const STEP = 0.16;

function getActiveIndex(progress: number) {
  if (progress < ENTRY_DEADZONE) return -1;
  return Math.min(destinations.length - 1, Math.max(0, Math.floor((progress - ENTRY_DEADZONE) / STEP)));
}

export function StudyJourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const reduced = useReducedMotion();
  const t = useTranslations("journey");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [isCompact, setIsCompact] = useState(false);
  const [inView, setInView] = useState(true);
  const activeLocation = activeIndex >= 0 ? destinations[activeIndex] : origin;
  const finalVisible = activeIndex >= destinations.length - 1 && progress > 0.82;

  // Pause the WebGL render loop once this section has scrolled well out of
  // view — R3F renders every frame forever by default, which is wasted GPU/
  // battery and a real source of scroll jank further down the page once
  // both this scene and the hero's globe are running at once.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "200px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setIsCompact(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (reduced) {
      progressRef.current = 0.92;
      const frame = requestAnimationFrame(() => {
        setProgress(0.92);
        setActiveIndex(destinations.length - 1);
      });
      return () => cancelAnimationFrame(frame);
    }

    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.9,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        setProgress(self.progress);
        setActiveIndex(getActiveIndex(self.progress));
      },
    });

    return () => trigger.kill();
  }, [reduced]);

  const cardEyebrow = useMemo(() => (activeIndex < 0 ? t("startingPoint") : t("destination")), [activeIndex, t]);

  // Entrance reveal: the sticky viewport rises into view right as the hero
  // dissolves out above it (see HeroSection's exit-dissolve). Fading it in
  // over the first sliver of local progress — instead of it simply
  // appearing at full opacity — keeps the two sections cross-fading into
  // each other rather than cutting.
  const entryReveal = reduced ? 1 : Math.min(1, progress / 0.05);

  return (
    <section ref={sectionRef} className="relative h-[450vh] bg-[#05070B]">
      <div
        className="sticky top-0 h-[100dvh] overflow-hidden"
        style={
          reduced
            ? undefined
            : {
                opacity: entryReveal,
                transform: `scale(${(0.985 + entryReveal * 0.015).toFixed(4)})`,
                willChange: "opacity, transform",
              }
        }
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(59,130,246,0.17),transparent_38%),linear-gradient(180deg,#05070B_0%,#07101d_54%,#05070B_100%)]" />

        <Canvas
          camera={{ position: [0, 0.04, isCompact ? 6.1 : 5.05], fov: isCompact ? 48 : 42 }}
          dpr={isCompact ? [1, 1.35] : [1, 1.75]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          frameloop={inView ? "always" : "never"}
          className="absolute inset-0"
        >
          <Suspense fallback={null}>
            <Scene progressRef={progressRef} progress={progress} compact={isCompact} reduced={reduced} />
          </Suspense>
        </Canvas>

        <div className="pointer-events-none absolute inset-x-0 top-8 z-10 mx-auto flex w-full max-w-7xl items-start justify-between px-4 sm:top-12 sm:px-8">
          <div className="max-w-[18rem]">
            <div className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-blue-200/55">{t("eyebrow")}</div>
            <h2 className="mt-3 font-heading text-2xl font-bold leading-tight text-white sm:text-4xl">
              {t("title")}
            </h2>
          </div>
          <div className="hidden rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-right text-xs uppercase tracking-[0.18em] text-blue-100/55 backdrop-blur-xl md:block">
            {t("scrollStory")}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-[58%] z-10 flex justify-center px-4 sm:top-1/2 sm:justify-end sm:px-12">
          <div
            className={`transition-all duration-700 ${
              finalVisible ? "translate-y-4 opacity-0 blur-sm" : "translate-y-0 opacity-100 blur-0"
            }`}
          >
            <OverlayCard location={activeLocation} eyebrow={cardEyebrow} />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-28 z-10 px-4 sm:bottom-10">
          <Statistics visible={finalVisible || reduced} />
        </div>
      </div>
    </section>
  );
}
