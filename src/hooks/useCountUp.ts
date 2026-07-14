"use client";
import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  end: number;
  duration?: number;
  start?: number;
  startOnView?: boolean;
}

export function useCountUp({
  end,
  duration = 2000,
  start = 0,
  startOnView = true,
}: UseCountUpOptions) {
  // `end` ilə işə düşür — SSR / no-JS / animasiyadan əvvəl real rəqəm
  // görünür (SEO üçün kritik: Google ilk crawl-da "0" deyil, real ədədi oxuyur).
  const [count, setCount] = useState(end);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const animate = () => {
      if (started.current) return;
      started.current = true;
      // Animasiya başlayanda `start` dəyərinə qayıt, sonra `end`-ə doğru yüksəl.
      setCount(start);
      const startTime = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(start + (end - start) * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!startOnView) {
      animate();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && animate()),
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, start, startOnView]);

  return { count, ref };
}
