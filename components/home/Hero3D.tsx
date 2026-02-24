"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function FloatingDonut({ position, color }: { position: [number, number, number], color: string }) {
    const mesh = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        mesh.current.rotation.x = Math.cos(t / 4) / 2;
        mesh.current.rotation.y = Math.sin(t / 4) / 2;
        mesh.current.position.y = position[1] + Math.sin(t / 2) / 2;
    });

    return (
        <mesh ref={mesh} position={position}>
            <torusGeometry args={[0.5, 0.2, 16, 100]} />
            <meshStandardMaterial color={color} roughness={0.1} metalness={0.1} />
        </mesh>
    );
}

function FloatingGlobe({ position, color, speed = 1, distort = 0.4 }: { position: [number, number, number], color: string, speed?: number, distort?: number }) {
    return (
        <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
            <Sphere args={[1, 64, 64]} position={position}>
                <MeshDistortMaterial
                    color={color}
                    speed={speed * 2}
                    distort={distort}
                    radius={0.8}
                />
            </Sphere>
        </Float>
    );
}

export default function Hero3D() {
    return (
        <div className="hero-3d-container">
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />

                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ecc6d9" />

                {/* Abstract "Sweet" shapes */}
                <FloatingDonut position={[2, 1, 0]} color="#D4AF37" />
                <FloatingDonut position={[-2, -1.5, -1]} color="#800020" />

                <FloatingGlobe position={[1.5, -1, -2]} color="#ecc6d9" speed={1.5} distort={0.3} />
                <FloatingGlobe position={[-1.5, 1.2, -1]} color="#fdf2f2" speed={1.2} distort={0.5} />

                {/* Background Particles or Glow */}
                <mesh position={[0, 0, -5]}>
                    <planeGeometry args={[20, 20]} />
                    <meshBasicMaterial color="#faf9f6" opacity={0} transparent />
                </mesh>
            </Canvas>
        </div>
    );
}
