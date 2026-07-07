"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  onClick?: () => void;
}

export function MagneticButton({
  href,
  children,
  variant = "primary",
  className,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const isCoarse =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;
  const disabled = reduced || isCoarse;

  const onMouseMove = (e: React.MouseEvent) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 24;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 24;
    gsap.to(ref.current, { x, y, duration: 0.3, ease: "power2.out" });
  };
  const onMouseLeave = () => {
    if (disabled || !ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: "elastic.out(1, 0.3)",
    });
  };

  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl px-7 py-3.5 font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
        variant === "primary"
          ? "bg-brand-primary text-white glow-primary hover:bg-red-700"
          : "glass text-foreground hover:bg-white/10",
        className,
      )}
    >
      {children}
    </a>
  );
}
