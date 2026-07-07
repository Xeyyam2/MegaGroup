"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in seconds */
  delay?: number;
  /** Direction: "up" | "left" | "right" | "scale" */
  direction?: "up" | "left" | "right" | "scale";
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const el = ref.current;
    const from: Record<string, number> = { opacity: 0 };
    if (direction === "up") from.y = 60;
    if (direction === "left") from.x = -60;
    if (direction === "right") from.x = 60;
    if (direction === "scale") { from.scale = 0.92; from.y = 30; }

    const ctx = gsap.context(() => {
      gsap.fromTo(el, from, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        delay,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced, delay, direction]);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={cn(className)} style={{ willChange: "transform, opacity" }}>
      {children}
    </div>
  );
}