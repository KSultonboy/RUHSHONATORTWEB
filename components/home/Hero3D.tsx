"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, PerspectiveCamera, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

type Sprinkle = {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
};

function CakeModel() {
  const groupRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Mesh>(null);
  const rimRef = useRef<THREE.Mesh>(null);

  const sprinkles = useMemo<Sprinkle[]>(
    () =>
      Array.from({ length: 32 }, (_, index) => ({
        position: [
          (Math.random() - 0.5) * 2.8,
          1.45 + Math.random() * 0.16,
          (Math.random() - 0.5) * 2.8,
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        color: ["#f87171", "#fb7185", "#f59e0b", "#22c55e", "#38bdf8", "#a78bfa"][index % 6],
      })),
    []
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.35) * 0.26;
      groupRef.current.position.y = Math.sin(t * 1.4) * 0.08;
    }
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(t * 9) * 0.2;
    }
    if (rimRef.current) {
      rimRef.current.rotation.z = t * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* plate */}
      <mesh position={[0, -1.2, 0]} receiveShadow>
        <cylinderGeometry args={[3.2, 3.3, 0.22, 64]} />
        <meshStandardMaterial color="#f6e7d2" metalness={0.15} roughness={0.25} />
      </mesh>

      {/* bottom layer */}
      <mesh castShadow receiveShadow position={[0, -0.4, 0]}>
        <cylinderGeometry args={[2.4, 2.55, 1.15, 64]} />
        <meshStandardMaterial color="#f8d7bc" roughness={0.55} metalness={0.03} />
      </mesh>

      {/* middle cream */}
      <mesh castShadow position={[0, 0.18, 0]}>
        <torusGeometry args={[2.2, 0.16, 16, 96]} />
        <meshStandardMaterial color="#fff8ef" roughness={0.35} metalness={0.05} />
      </mesh>

      {/* upper layer */}
      <mesh castShadow receiveShadow position={[0, 0.72, 0]}>
        <cylinderGeometry args={[1.9, 2, 0.9, 64]} />
        <meshStandardMaterial color="#ffd8da" roughness={0.5} metalness={0.04} />
      </mesh>

      {/* top glaze */}
      <mesh castShadow position={[0, 1.24, 0]}>
        <cylinderGeometry args={[1.95, 1.92, 0.16, 64]} />
        <meshStandardMaterial color="#fff2d9" roughness={0.25} metalness={0.12} />
      </mesh>

      {/* rotating ribbon */}
      <mesh ref={rimRef} castShadow position={[0, 0.75, 0]}>
        <torusGeometry args={[2.03, 0.07, 16, 120]} />
        <meshStandardMaterial color="#7a1123" roughness={0.28} metalness={0.22} />
      </mesh>

      {/* candle */}
      <mesh castShadow position={[0, 1.74, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 24]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.2} />
      </mesh>
      <mesh ref={flameRef} position={[0, 2.05, 0]}>
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshStandardMaterial emissive="#ff9f1c" emissiveIntensity={2.5} color="#ffcc66" />
      </mesh>
      <pointLight position={[0, 2.05, 0]} intensity={1.4} color="#ff9f1c" distance={4.5} />

      {/* berries */}
      <mesh castShadow position={[0.72, 1.32, 0.62]}>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.4} />
      </mesh>
      <mesh castShadow position={[-0.68, 1.32, -0.42]}>
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshStandardMaterial color="#be123c" roughness={0.38} />
      </mesh>

      {sprinkles.map((sprinkle, index) => (
        <RoundedBox
          key={index}
          args={[0.08, 0.03, 0.02]}
          radius={0.005}
          smoothness={4}
          position={sprinkle.position}
          rotation={sprinkle.rotation}
        >
          <meshStandardMaterial color={sprinkle.color} roughness={0.3} />
        </RoundedBox>
      ))}
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="hero-3d-container">
      <Canvas shadows dpr={[1, 1.8]}>
        <PerspectiveCamera makeDefault position={[0, 0.75, 7.2]} fov={32} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 5, 3]} intensity={1.1} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
        <pointLight position={[-3, 2, -1]} intensity={0.4} color="#fbcfe8" />
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.9}>
          <CakeModel />
        </Float>
        <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[7, 64]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}
