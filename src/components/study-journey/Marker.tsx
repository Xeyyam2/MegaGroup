"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { JourneyLocation } from "./data";
import { latLonToVector3 } from "./data";

export function Marker({
  location,
  active,
}: {
  location: JourneyLocation;
  active: boolean;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const position = latLonToVector3(location.lat, location.lon, 2.085);
  const normal = position.clone().normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ringRef.current) {
      const scale = active ? 1 + Math.sin(t * 2.2) * 0.18 : 0.78;
      ringRef.current.scale.setScalar(scale);
      ringRef.current.rotation.z += 0.012;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(active ? 1 + Math.sin(t * 2.8) * 0.08 : 0.72);
    }
  });

  return (
    <group position={position} quaternion={quaternion}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.055, 24, 24]} />
        <meshBasicMaterial color="#60A5FA" transparent opacity={active ? 0.92 : 0.32} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.145, 0.008, 12, 64]} />
        <meshBasicMaterial color="#3B82F6" transparent opacity={active ? 0.78 : 0.22} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.012, 0.012, active ? 0.55 : 0.32, 10]} />
        <meshBasicMaterial color="#60A5FA" transparent opacity={active ? 0.35 : 0.12} />
      </mesh>
    </group>
  );
}
