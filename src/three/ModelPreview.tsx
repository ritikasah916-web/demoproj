import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';

interface ModelPreviewProps {
  geometry?: string;
  color?: string;
  material?: string;
  roughness?: number;
  metalness?: number;
  wireframe?: boolean;
  autoRotate?: boolean;
  scale?: number;
  className?: string;
}

function GeneratedGeometry({ geometry, color, roughness, metalness, wireframe, scale }: {
  geometry: string;
  color: string;
  roughness: number;
  metalness: number;
  wireframe: boolean;
  scale: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const geometryNode = useMemo(() => {
    switch (geometry) {
      case 'torus':
        return <torusKnotGeometry args={[1, 0.35, 128, 32]} />;
      case 'sphere':
        return <sphereGeometry args={[1.2, 64, 64]} />;
      case 'cube':
        return <boxGeometry args={[1.8, 1.8, 1.8]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.8, 1.2, 2, 32]} />;
      case 'cone':
        return <coneGeometry args={[1.2, 2, 32]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[1.3, 0]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[1.3, 0]} />;
      case 'octahedron':
        return <octahedronGeometry args={[1.3, 0]} />;
      case 'ring':
        return <torusGeometry args={[1, 0.4, 32, 64]} />;
      default:
        return <torusKnotGeometry args={[1, 0.35, 128, 32]} />;
    }
  }, [geometry]);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={scale} castShadow>
        {geometryNode}
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
          wireframe={wireframe}
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  );
}

export default function ModelPreview({
  geometry = 'torus',
  color = '#6366f1',
  roughness = 0.3,
  metalness = 0.7,
  wireframe = false,
  autoRotate = true,
  scale = 1,
  className = '',
}: ModelPreviewProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        shadows
        camera={{ position: [4, 3, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#0f0f1a']} />
        <fog attach="fog" args={['#0f0f1a', 8, 20]} />

        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, 3, -5]} intensity={0.5} color="#8b5cf6" />
        <pointLight position={[5, -3, 5]} intensity={0.3} color="#06b6d4" />

        <GeneratedGeometry
          geometry={geometry}
          color={color}
          roughness={roughness}
          metalness={metalness}
          wireframe={wireframe}
          scale={scale}
        />

        <ContactShadows
          position={[0, -1.8, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
          far={4}
        />

        <Grid
          position={[0, -1.8, 0]}
          args={[20, 20]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#1e1b4b"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#312e81"
          fadeDistance={15}
          fadeStrength={1}
          infiniteGrid
        />

        <Environment preset="city" />

        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={1}
          enablePan={true}
          enableZoom={true}
          minDistance={2}
          maxDistance={15}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2 + 0.3}
        />
      </Canvas>
    </div>
  );
}
