"use client";
import { useCountUp } from "@/hooks/useCountUp";

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
  const { count, ref } = useCountUp({ end, duration });
  return (
    <span ref={ref} className={className}>
      {count.toLocaleString("az-AZ")}
      {suffix}
    </span>
  );
}
