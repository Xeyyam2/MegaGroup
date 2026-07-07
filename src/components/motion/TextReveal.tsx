"use client";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function TextReveal({
  text,
  className,
  as = "h2",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4";
}) {
  const Tag = as;
  const containerRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) return;
    const el = containerRef.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLSpanElement>(".tr-word");
    if (!words.length) return;
    const ctx = gsap.context(() => {
      gsap.from(words, {
        y: 30,
        opacity: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [text, reduced]);

  return (
    <Tag ref={containerRef} className={className} aria-label={text}>
      {reduced
        ? text
        : text.split(" ").map((word, i) => (
            <span key={i} className="tr-word inline-block">
              {word}
              {i < text.split(" ").length - 1 ? "\u00A0" : ""}
            </span>
          ))}
    </Tag>
  );
}
