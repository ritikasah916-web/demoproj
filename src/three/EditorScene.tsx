import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, ContactShadows, TransformControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import * as THREE from 'three';
import { SceneObject } from '../types';

interface EditorSceneProps {
  objects: SceneObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string | null) => void;
  transformMode: 'translate' | 'rotate' | 'scale';
  showGrid: boolean;
  showAxes: boolean;
  wireframeMode: boolean;
}

function SceneMesh({ obj, isSelected, onSelect, wireframeMode }: {
  obj: SceneObject;
  isSelected: boolean;
  onSelect: () => void;
  wireframeMode: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometryNode = useMemo(() => {
    switch (obj.type) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.7, 32, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.5, 0.5, 1.2, 32]} />;
      case 'cone':
        return <coneGeometry args={[0.6, 1.2, 32]} />;
      case 'torus':
        return <torusGeometry args={[0.6, 0.25, 16, 48]} />;
      case 'torusKnot':
        return <torusKnotGeometry args={[0.5, 0.2, 64, 16]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[0.7, 0]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  }, [obj.type]);

  if (!obj.visible) return null;

  return (
    <mesh
      ref={meshRef}
      position={obj.transform.position}
      rotation={obj.transform.rotation}
      scale={obj.transform.scale}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      castShadow
      receiveShadow
    >
      {geometryNode}
      <meshStandardMaterial
        color={isSelected ? '#fbbf24' : obj.material.color}
        roughness={obj.material.roughness}
        metalness={obj.material.metalness}
        wireframe={wireframeMode || obj.material.wireframe}
        opacity={obj.material.opacity}
        transparent={obj.material.opacity < 1}
      />
    </mesh>
  );
}

export default function EditorScene({
  objects,
  selectedObjectId,
  onSelectObject,
  transformMode,
  showGrid,
  showAxes,
  wireframeMode,
}: EditorSceneProps) {
  const selectedObject = objects.find((o) => o.id === selectedObjectId);

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [5, 4, 5], fov: 50 }}
        gl={{ antialias: true }}
        onPointerMissed={() => onSelectObject(null)}
      >
        <color attach="background" args={['#111827']} />

        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-5, 3, -5]} intensity={0.4} color="#8b5cf6" />
        <pointLight position={[5, -2, 5]} intensity={0.3} color="#06b6d4" />

        {objects.map((obj) => (
          <SceneMesh
            key={obj.id}
            obj={obj}
            isSelected={obj.id === selectedObjectId}
            onSelect={() => onSelectObject(obj.id)}
            wireframeMode={wireframeMode}
          />
        ))}

        {selectedObject && (
          <TransformControls
            mode={transformMode}
            position={selectedObject.transform.position}
            rotation={selectedObject.transform.rotation}
            scale={selectedObject.transform.scale}
          />
        )}

        {showGrid && (
          <Grid
            position={[0, -1.5, 0]}
            args={[30, 30]}
            cellSize={0.5}
            cellThickness={0.5}
            cellColor="#1f2937"
            sectionSize={2}
            sectionThickness={1}
            sectionColor="#374151"
            fadeDistance={20}
            infiniteGrid
          />
        )}

        {showAxes && <axesHelper args={[5]} />}

        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.4}
          scale={15}
          blur={2}
          far={5}
        />

        <Environment preset="city" />

        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport labelColor="white" axisHeadScale={1} />
        </GizmoHelper>

        <OrbitControls makeDefault enableDamping dampingFactor={0.1} />
      </Canvas>
    </div>
  );
}
