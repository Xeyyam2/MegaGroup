"use client";

export function Airplane({ visible = true }: { visible?: boolean }) {
  return (
    <group scale={0.085} visible={visible}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.18, 1.15, 5]} />
        <meshStandardMaterial color="#f8fbff" roughness={0.42} metalness={0.18} />
      </mesh>
      <mesh position={[-0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.08, 1.25, 0.055]} />
        <meshStandardMaterial color="#f8fbff" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[-0.52, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.055, 0.52, 0.05]} />
        <meshStandardMaterial color="#dbeafe" roughness={0.45} metalness={0.1} />
      </mesh>
      <pointLight color="#60A5FA" intensity={0.85} distance={0.85} />
    </group>
  );
}
