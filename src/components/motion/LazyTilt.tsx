"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// react-parallax-tilt yalniz kart hover mikro-interaksiyasinda lazimdir
// (hero / olke scroll animasiyalarinda YOX). Onu esas bundle-dan cixarib
// yalniz desktop + idle vaxti (requestIdleCallback) yukleyirik; mobil/
// reduced-motion hec vaxt chunk yuklemir, kartlar oldugu kimi qalir.
type TiltCmp = React.ComponentType<{
  glareEnable?: boolean;
  scale?: number;
  tiltMaxAngleX?: number;
  tiltMaxAngleY?: number;
  children?: ReactNode;
}>;

export function LazyTilt({
  children,
  glareEnable,
  scale,
  tiltMaxAngleX,
  tiltMaxAngleY,
}: {
  children: ReactNode;
  glareEnable?: boolean;
  scale?: number;
  tiltMaxAngleX?: number;
  tiltMaxAngleY?: number;
}) {
  const reduced = useReducedMotion();
  const isCoarse =
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  const [Tilt, setTilt] = useState<TiltCmp | null>(null);

  useEffect(() => {
    if (reduced || isCoarse) return;
    let active = true;
    const run = () => {
      import("react-parallax-tilt").then((m) => {
        if (active) setTilt(() => (m as { default: TiltCmp }).default);
      });
    };
    // Ilk paint / hero LCP ile reqabet etmesin deye idle-a qeder gecikdir.
    const ric = (window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback;
    if (ric) ric(run, { timeout: 2000 });
    else setTimeout(run, 1500);
    return () => {
      active = false;
    };
  }, [reduced, isCoarse]);

  if (reduced || isCoarse || !Tilt) return <>{children}</>;
  return (
    <Tilt
      glareEnable={glareEnable}
      scale={scale}
      tiltMaxAngleX={tiltMaxAngleX}
      tiltMaxAngleY={tiltMaxAngleY}
    >
      {children}
    </Tilt>
  );
}

