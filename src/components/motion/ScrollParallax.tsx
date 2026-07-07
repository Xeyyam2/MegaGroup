"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface ScrollParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function ScrollParallax({ children, speed = 0.3, className }: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -speed * 30 },
        {
          yPercent: speed * 30,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section") ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced, speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}