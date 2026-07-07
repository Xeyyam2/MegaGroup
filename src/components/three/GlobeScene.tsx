"use client";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useTranslations } from "next-intl";
import { ParticleField } from "./ParticleField";
import { EARTH_RADIUS, latLonToVector3, seededRandom } from "@/components/study-journey/data";
import { HERO_COUNTRY_MARKERS } from "./heroCountries";

// Lightweight Earth for the hero background. Kept deliberately low-poly
// (vs. the narrative globe in StudyJourneySection) since two WebGL globes
// can be mounted on the page at once — this one only needs to read well
// at small scale and behind a mix-blend-screen glass layer.
const LAND_ANCHORS: Array<[number, number]> = [
  [46, 2], [51, 10], [39, 35], [30, 78], [42, 105],
  [6, 20], [-3, 28], [-15, -60], [-35, -64], [38, -98], [56, -105], [-25, 135],
];

// How much of the total hero scroll is spent growing the globe before it
// stops (the remaining portion is spent revealing the country labels).
const GROW_END = 0.55;
const MIN_SCALE = 1.15;
const MAX_SCALE = 2.15; // kept below (camera distance / EARTH_RADIUS) so the camera never clips inside the sphere

function createLandPoints(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const perAnchor = Math.ceil(count / LAND_ANCHORS.length);
  let i = 0;
  LAND_ANCHORS.forEach(([lat, lon], anchorIndex) => {
    for (let j = 0; j < perAnchor && i < count; j++, i++) {
      const a = seededRandom(anchorIndex * 997 + j * 13);
      const b = seededRandom(anchorIndex * 499 + j * 29);
      const pointLat = lat + (a - 0.5) * 14;
      const pointLon = lon + (b - 0.5) * 20;
      const v = latLonToVector3(pointLat, pointLon, EARTH_RADIUS + 0.012);
      positions[i * 3] = v.x;
      positions[i * 3 + 1] = v.y;
      positions[i * 3 + 2] = v.z;
    }
  });
  return positions;
}

function CountryLabel({ id, flag, lat, lon }: { id: string; flag: string; lat: number; lon: number }) {
  const t = useTranslations("journey.countries");
  const position = useMemo(() => latLonToVector3(lat, lon, EARTH_RADIUS + 0.06), [lat, lon]);

  return (
    <Html position={position} center distanceFactor={7.5} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
      <div className="hero-country-label flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 bg-[#0b1326]/70 px-2.5 py-1 text-[11px] font-semibold text-white shadow-[0_0_12px_rgba(220,38,38,0.25)] backdrop-blur-sm">
        <span aria-hidden>{flag}</span>
        <span>{t(id)}</span>
      </div>
    </Html>
  );
}

export function GlobeScene({ progressRef }: { progressRef?: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const landPoints = useMemo(() => createLandPoints(320), []);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    group.rotation.y += delta * 0.1;
    group.rotation.x += (pointer.y * 0.22 - group.rotation.x) * 0.05;

    // Real 3D zoom: as the visitor scrolls, the globe itself grows (not a
    // CSS transform), so the country markers stay correctly proportioned.
    const rawProgress = progressRef?.current ?? 0;
    const growProgress = Math.min(1, rawProgress / GROW_END);
    const targetScale = THREE.MathUtils.lerp(MIN_SCALE, MAX_SCALE, growProgress);
    group.scale.setScalar(THREE.MathUtils.damp(group.scale.x, targetScale, 4, delta));
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 3, 5]} intensity={1.6} color="#dbeafe" />
      <pointLight position={[-3, -2, 4]} intensity={0.9} color="#3b82f6" />

      <group ref={groupRef} scale={MIN_SCALE}>
        {/* Earth core */}
        <mesh>
          <sphereGeometry args={[EARTH_RADIUS, 48, 48]} />
          <meshPhysicalMaterial
            color="#0a2540"
            roughness={0.78}
            metalness={0.08}
            clearcoat={0.3}
            emissive="#07192d"
            emissiveIntensity={0.18}
          />
        </mesh>

        {/* Land / university hubs point cloud */}
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[landPoints, 3]} />
          </bufferGeometry>
          <pointsMaterial color="#8fbdf8" size={0.014} transparent opacity={0.55} sizeAttenuation />
        </points>

        {/* Single soft atmosphere shell */}
        <mesh scale={1.045}>
          <sphereGeometry args={[EARTH_RADIUS, 48, 48]} />
          <meshBasicMaterial color="#dc2626" transparent opacity={0.06} side={THREE.BackSide} />
        </mesh>

        {/* Country markers — opacity fades in only after the globe has
            finished growing (see --hero-labels in HeroSection). */}
        {HERO_COUNTRY_MARKERS.map((c) => (
          <CountryLabel key={c.id} {...c} />
        ))}
      </group>

      <ParticleField />

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.35} enableDamping />
    </>
  );
}
