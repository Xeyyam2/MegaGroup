"use client";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CanvasWrapper({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);
  const [inView, setInView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Pause the WebGL render loop entirely once the hero has scrolled well out
  // of view. R3F keeps rendering every animation frame forever by default
  // ("frameloop=always") even while completely invisible — wasted GPU/
  // battery, and a real source of scroll jank further down the page since
  // it keeps competing for frame budget with Lenis and GSAP ScrollTrigger
  // for as long as the tab stays open.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "200px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!isDesktop || reduced) {
    return <div className="hero-fallback-gradient absolute inset-0" aria-hidden />;
  }

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={inView ? "always" : "never"}
        className="absolute inset-0"
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
