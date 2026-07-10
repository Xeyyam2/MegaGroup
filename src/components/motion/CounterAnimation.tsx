"use client";
import { useCountUp } from "@/hooks/useCountUp";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CounterAnimationProps {
  end: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function CounterAnimation({
  end,
  suffix = "",
  duration = 2000,
  className,
}: CounterAnimationProps) {
  const reduced = useReducedMotion();
  const { count, ref } = useCountUp({ end, duration });
  return (
    <span ref={ref} className={className}>
      {(reduced ? end : count).toLocaleString("az-AZ")}
      {suffix}
    </span>
  );
}
