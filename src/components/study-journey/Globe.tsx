"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { EARTH_RADIUS, seededRandom } from "./data";

const continentAnchors = [
  [46, 2],
  [51, 10],
  [39, 35],
  [30, 78],
  [42, 105],
  [6, 20],
  [-3, 28],
  [-15, -60],
  [-35, -64],
  [38, -98],
  [56, -105],
  [-25, 135],
];

function landPointCloud() {
  const positions: number[] = [];

  continentAnchors.forEach(([lat, lon], anchorIndex) => {
    for (let i = 0; i < 76; i += 1) {
      const a = seededRandom(anchorIndex * 997 + i * 13);
      const b = seededRandom(anchorIndex * 499 + i * 29);
      const spreadLat = anchorIndex > 7 ? 16 : 12;
      const spreadLon = anchorIndex > 7 ? 24 : 18;
      const pointLat = lat + (a - 0.5) * spreadLat;
      const pointLon = lon + (b - 0.5) * spreadLon;
      const phi = THREE.MathUtils.degToRad(90 - pointLat);
      const theta = THREE.MathUtils.degToRad(pointLon + 180);
      const radius = EARTH_RADIUS + 0.012;

      positions.push(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      );
    }
  });

  return new Float32Array(positions);
}

export function Globe() {
  const points = useMemo(() => landPointCloud(), []);

  return (
    <group>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
        <meshPhysicalMaterial
          color="#0A2540"
          roughness={0.78}
          metalness={0.08}
          clearcoat={0.35}
          clearcoatRoughness={0.6}
          emissive="#07192d"
          emissiveIntensity={0.16}
        />
      </mesh>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[points, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#8fbdf8" size={0.012} transparent opacity={0.28} sizeAttenuation />
      </points>

      <mesh scale={1.028}>
        <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.055} side={THREE.BackSide} />
      </mesh>

      <mesh scale={1.085}>
        <sphereGeometry args={[EARTH_RADIUS, 96, 96]} />
        <meshBasicMaterial color="#60A5FA" transparent opacity={0.035} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}
