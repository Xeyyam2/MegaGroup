"use client";

/* eslint-disable react-hooks/refs */

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { JourneyLocation } from "./data";
import { buildFlightCurve } from "./data";
import { Airplane } from "./Airplane";

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

export function FlightPath({
  from,
  to,
  progress,
}: {
  from: JourneyLocation;
  to: JourneyLocation;
  progress: number;
}) {
  const lineRef = useRef<THREE.BufferGeometry>(null);
  const planeRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const particlePositionsRef = useRef(new Float32Array(18 * 3));
  const curve = useMemo(() => buildFlightCurve(from, to), [from, to]);
  const points = useMemo(() => curve.getPoints(150), [curve]);
  const positions = useMemo(() => new Float32Array(points.flatMap((p) => [p.x, p.y, p.z])), [points]);
  const particlePositions = particlePositionsRef.current;

  // R3F frame loops intentionally mutate Three.js objects and typed buffers.
  useFrame(({ clock }) => {
    const drawn = clamp01(progress);
    lineRef.current?.setDrawRange(0, Math.max(2, Math.floor(points.length * drawn)));

    if (planeRef.current) {
      const planeProgress = clamp01(drawn);
      const pos = curve.getPoint(planeProgress);
      const tangent = curve.getTangent(planeProgress).normalize();
      const lookAt = pos.clone().add(tangent);
      planeRef.current.position.copy(pos);
      planeRef.current.lookAt(lookAt);
      planeRef.current.rotateZ(Math.sin(planeProgress * Math.PI) * -0.55);
      planeRef.current.visible = drawn > 0.035 && drawn < 0.96;
    }

    if (particlesRef.current && drawn > 0.98) {
      const array = particlePositions;
      for (let i = 0; i < 18; i += 1) {
        const p = (clock.elapsedTime * 0.045 + i / 18) % 1;
        const pos = curve.getPoint(p);
        array[i * 3] = pos.x;
        array[i * 3 + 1] = pos.y;
        array[i * 3 + 2] = pos.z;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <line>
        <bufferGeometry ref={lineRef}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#60A5FA" transparent opacity={0.74} linewidth={1} />
      </line>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#bfdbfe" size={0.027} transparent opacity={progress > 0.98 ? 0.78 : 0} sizeAttenuation />
      </points>

      <group ref={planeRef}>
        <Airplane />
      </group>
    </group>
  );
}
