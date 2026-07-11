"use client";

/* eslint-disable react-hooks/immutability */

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Globe } from "./Globe";
import { FlightPath } from "./FlightPath";
import { Marker } from "./Marker";
import { destinations, origin, routeStops, latLonToVector3, seededRandom } from "./data";

function routeProgress(progress: number, index: number) {
  const start = 0.12 + index * 0.16;
  const end = start + 0.12;
  return Math.min(Math.max((progress - start) / (end - start), 0), 1);
}

function activeDestinationIndex(progress: number) {
  if (progress > 0.82) return destinations.length - 1;
  return Math.min(destinations.length - 1, Math.max(0, Math.floor((progress - 0.1) / 0.16)));
}

function Stars({ compact }: { compact: boolean }) {
  const positions = useMemo(() => {
    const count = compact ? 120 : 260;
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = 7 + seededRandom(i * 17 + 1) * 8;
      const theta = seededRandom(i * 31 + 2) * Math.PI * 2;
      const phi = Math.acos(2 * seededRandom(i * 47 + 3) - 1);
      data[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      data[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      data[i * 3 + 2] = r * Math.cos(phi);
    }
    return data;
  }, [compact]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#dbeafe" size={0.012} transparent opacity={0.42} sizeAttenuation />
    </points>
  );
}

export function Scene({
  progressRef,
  progress,
  compact,
  reduced,
}: {
  progressRef: React.MutableRefObject<number>;
  progress: number;
  compact: boolean;
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const camera = useThree((state) => state.camera);
  const targetQuaternions = useMemo(() => {
    const front = new THREE.Vector3(0.08, 0.02, 1).normalize();
    return routeStops.map((stop) => {
      const v = latLonToVector3(stop.lat, stop.lon).normalize();
      return new THREE.Quaternion().setFromUnitVectors(v, front);
    });
  }, []);

  // R3F frame loops intentionally mutate Three.js camera/group objects.
  useFrame((_, delta) => {
    const frameProgress = reduced ? 0.92 : progressRef.current;
    const group = groupRef.current;
    if (!group) return;

    const finalView = frameProgress > 0.84;
    const activeIndex = finalView ? 0 : activeDestinationIndex(frameProgress) + 1;
    const target = finalView ? new THREE.Quaternion() : targetQuaternions[activeIndex];

    group.quaternion.slerp(target, 1 - Math.pow(0.001, delta));
    if (frameProgress < 0.08 || finalView) {
      group.rotateY(delta * (finalView ? 0.075 : 0.045));
    }

    const desiredZ = compact ? 6.0 : finalView ? 5.85 : 4.95 - Math.min(frameProgress, 0.7) * 0.28;
    camera.position.z += (desiredZ - camera.position.z) * 0.04;
    camera.position.y += ((finalView ? 0.22 : 0.05) - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <color attach="background" args={["#05070B"]} />
      <ambientLight intensity={0.42} />
      <directionalLight position={[4, 3, 5]} intensity={2.2} color="#dbeafe" />
      <pointLight position={[-3.5, 1.5, 2.5]} intensity={1.25} color="#3B82F6" />
      <Stars compact={compact} />

      <group ref={groupRef}>
        <Globe />
        {routeStops.map((stop, index) => (
          <Marker key={stop.id} location={stop} active={index === 0 || progress > 0.2 + (index - 1) * 0.16} />
        ))}
        {destinations.map((destination, index) => (
          <FlightPath
            key={destination.id}
            from={origin}
            to={destination}
            progress={reduced ? 1 : routeProgress(progress, index)}
          />
        ))}
      </group>
    </>
  );
}
