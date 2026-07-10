"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextReveal } from "@/components/motion/TextReveal";
import { CounterAnimation } from "@/components/motion/CounterAnimation";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ScrollParallax } from "@/components/motion/ScrollParallax";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HERO_COUNTRY_MARKERS, hero2DFallbackPosition } from "@/components/three/heroCountries";

gsap.registerPlugin(ScrollTrigger);

const ShaderBackground = dynamic(
  () => import("@/components/three/ShaderBackground").then((m) => m.ShaderBackground),
  { ssr: false, loading: () => <div className="hero-fallback-gradient h-full w-full" /> },
);

const GlobeScene = dynamic(
  () => import("@/components/three/GlobeScene").then((m) => m.GlobeScene),
  { ssr: false, loading: () => null },
);

// CanvasWrapper @react-three/fiber-in Canvas-ini çəkir — dynamic ilə ayrı chunk-a
// ayırırıq ki, three.js əsas bundle-a girməsin (yalnız client-də, ehtiyaca yüklənsin).
const CanvasWrapper = dynamic(
  () => import("@/components/three/CanvasWrapper").then((m) => m.CanvasWrapper),
  { ssr: false, loading: () => <div className="hero-fallback-gradient absolute inset-0" aria-hidden /> },
);

// Must match GROW_END in GlobeScene.tsx — the fraction of the total hero
// scroll spent growing the globe before the country labels start revealing.
const GROW_END = 0.55;

interface HeroStats {
  end: number;
  suffix: string;
  label: string;
}

export function HeroSection({
  stats,
  title,
  subtitle,
}: {
  stats?: HeroStats[];
  title?: string;
  subtitle?: string;
}) {
  const locale = useLocale();
  const t = useTranslations("hero");
  const tCta = useTranslations("cta");
  const tCountries = useTranslations("journey.countries");
  const reduced = useReducedMotion();
  const wrapperRef = useRef<HTMLElement>(null);
  const globeProgressRef = useRef(0);

  const defaultStats: HeroStats[] = [
    { end: 200, suffix: "+", label: t("statUniversities") },
    { end: 0, suffix: "", label: t("statExams") },
    { end: 7, suffix: "", label: t("statCountries") },
    { end: 1000, suffix: "+", label: t("statStudents") },
  ];
  const STATS = stats ?? defaultStats;

  // Two-phase scroll story, driven by a single scroll-through of the hero:
  //  Phase 1 (0 -> GROW_END):   the globe grows to fill the screen in real 3D
  //                             (see GlobeScene) while the headline/stats card
  //                             fades away completely (opacity 1 -> 0).
  //  Phase 2 (GROW_END -> 1):   once the globe has finished growing, the
  //                             destination-country labels fade in (0 -> 1).
  // Scrolling back up reverses both phases automatically (GSAP scrub is
  // bidirectional). Everything is driven by CSS custom properties + a plain
  // ref so no React re-renders happen on scroll.
  //
  // IMPORTANT: the pinned (sticky) viewport only stays fixed for
  // `sectionHeight - 100dvh` of scroll — the CSS `sticky top-0` mechanism
  // releases at that exact point. The trigger below uses "bottom bottom"
  // (not "bottom top") so progress 0 -> 1 lines up exactly with that pinned
  // window: the globe fully grows and every label finishes fading in while
  // the section is still visually locked in place, instead of finishing
  // mid-slide as it exits. A second trigger then drives a soft dissolve for
  // the short handoff scroll that follows, so the hero melts away right as
  // the countries section rises into view underneath it — no dead gap.
  useEffect(() => {
    if (reduced) {
      document.documentElement.style.setProperty("--hero-globe", "0");
      document.documentElement.style.setProperty("--hero-labels", "0");
      document.documentElement.style.setProperty("--hero-exit", "0");
      return;
    }
    const section = wrapperRef.current;
    if (!section) return;

    const growAndReveal = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
      onUpdate: (self) => {
        const progress = self.progress;
        globeProgressRef.current = progress;
        const growProgress = Math.min(1, progress / GROW_END);
        const labelProgress = Math.max(0, Math.min(1, (progress - GROW_END) / (1 - GROW_END)));
        const root = document.documentElement.style;
        root.setProperty("--hero-globe", growProgress.toFixed(4));
        root.setProperty("--hero-labels", labelProgress.toFixed(4));
      },
    });

    // Handoff dissolve: exactly the leftover scroll between the pin
    // releasing and the countries section reaching the top of the viewport.
    const exitDissolve = ScrollTrigger.create({
      trigger: section,
      start: "bottom bottom",
      end: "bottom top",
      scrub: 0.4,
      onUpdate: (self) => {
        document.documentElement.style.setProperty("--hero-exit", self.progress.toFixed(4));
      },
    });

    return () => {
      growAndReveal.kill();
      exitDissolve.kill();
      document.documentElement.style.setProperty("--hero-globe", "0");
      document.documentElement.style.setProperty("--hero-labels", "0");
      document.documentElement.style.setProperty("--hero-exit", "0");
    };
  }, [reduced]);

  return (
    <section
      ref={wrapperRef}
      className={`relative w-full ${reduced ? "min-h-[100dvh]" : "h-[210vh] sm:h-[230vh]"}`}
    >
      <div
        className={`hero-exit-dissolve flex h-[100dvh] w-full items-center justify-center overflow-hidden ${
          reduced ? "relative" : "sticky top-0"
        }`}
        style={
          reduced
            ? undefined
            : {
                opacity: "calc(1 - var(--hero-exit, 0))",
                transform: "scale(calc(1 + var(--hero-exit, 0) * 0.06))",
                filter: "blur(calc(var(--hero-exit, 0) * 8px))",
              }
        }
      >
        {/* Layer 0: Parallax education image (subtle, behind everything) */}
        <ScrollParallax speed={0.4} className="absolute inset-0 z-0 opacity-15">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=45')",
            }}
            aria-hidden
          />
        </ScrollParallax>

        {/* Layer 1: Dark gradient overlay for readability */}
        <div
          className="absolute inset-0 z-0 bg-gradient-to-b from-background/60 via-background/80 to-background"
          aria-hidden
        />

        {/* Layer 2: WebGL plasma shader background — skipped entirely on
            reduced-motion so the three.js shader chunk is never fetched. */}
        <div className="absolute inset-0 z-0" aria-hidden>
          {reduced ? (
            <div className="hero-fallback-gradient h-full w-full" />
          ) : (
            <ShaderBackground className="h-full w-full" />
          )}
        </div>

        {/* Layer 3: 3D holographic globe — grows in real 3D as you scroll,
            then shows destination country markers (desktop). Skipped entirely
            on reduced-motion so the R3F/globe chunk is never fetched. */}
        <div
          className="pointer-events-none absolute inset-0 z-0 mix-blend-screen"
          style={{ opacity: reduced ? 0.4 : "calc(0.4 + var(--hero-globe, 0) * 0.6)" }}
          aria-hidden
        >
          {reduced ? (
            <div className="hero-fallback-gradient absolute inset-0" />
          ) : (
            <CanvasWrapper>
              <GlobeScene progressRef={globeProgressRef} />
            </CanvasWrapper>
          )}
        </div>

        {/* Layer 3b: CSS-only country labels for mobile / reduced-motion,
            where the WebGL globe isn't rendered (see CanvasWrapper). */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center md:hidden" aria-hidden>
          <div className="relative h-72 w-72 max-w-[80vw]">
            {HERO_COUNTRY_MARKERS.map((c, i) => {
              const pos = hero2DFallbackPosition(i, HERO_COUNTRY_MARKERS.length);
              return (
                <span
                  key={c.id}
                  className="hero-country-label absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-[#0b1326]/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"
                  style={{ top: pos.top, left: pos.left }}
                >
                  <span aria-hidden>{c.flag}</span>
                  <span>{tCountries(c.id)}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Layer 4: glass content — fades completely away while the globe grows */}
        <div
          className="hero-fade-content relative z-10 mx-auto max-w-4xl px-6 text-center"
          style={
            reduced
              ? undefined
              : {
                  opacity: "calc(1 - var(--hero-globe, 0))",
                  transform: "translateY(calc(var(--hero-globe, 0) * -32px)) scale(calc(1 - var(--hero-globe, 0) * 0.06))",
                  filter: "blur(calc(var(--hero-globe, 0) * 8px))",
                }
          }
        >
          <div className="glass-strong rounded-3xl p-8 sm:p-12">
            <TextReveal
              text={title ?? t("title")}
              as="h1"
              className="text-balance font-heading text-4xl font-extrabold tracking-tight-display text-on-surface sm:text-6xl"
            />
            <p className="mt-5 font-sans text-lg text-on-surface-variant">{subtitle ?? t("subtitle")}</p>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="glass rounded-lg p-4 text-center">
                  <div className="tabular-nums font-heading text-2xl font-bold text-primary-container sm:text-3xl">
                    <CounterAnimation end={s.end} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 text-xs text-on-surface-variant sm:text-sm">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <MagneticButton href={`/${locale}/xaricde-tehsil`} variant="primary">
                {tCta("chooseCountry")}
              </MagneticButton>
              <MagneticButton href={`/${locale}/xaricde-tehsil/muraciet`} variant="ghost">
                {tCta("apply")}
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Scroll down indicator — fades with the headline */}
        <div
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce"
          style={reduced ? undefined : { opacity: "calc(1 - var(--hero-globe, 0))" }}
        >
          <div className="h-6 w-4 rounded-full border-2 border-white/20">
            <div className="mx-auto mt-1 h-2 w-0.5 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
