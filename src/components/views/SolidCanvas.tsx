"use client";

import { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Grid, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { CubeModel } from "@/components/three/CubeModel";
import type { FaceId, GeometryViewMode } from "@/types/geometry";

type SolidCanvasProps = {
  selectedFace: FaceId | null;
  viewMode: GeometryViewMode;
  transparentMode: boolean;
  onSelectFace: (face: FaceId) => void;
};

function CameraRig({ viewMode }: { viewMode: GeometryViewMode }) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  useEffect(() => {
    const target: [number, number, number] = viewMode === "net" ? [0.6, -1.18, 0.2] : [0, -0.28, 0];
    const position: [number, number, number] =
      viewMode === "net" ? [0.6, 5.9, 5.2] : viewMode === "isometric" ? [4.6, 3.4, 4.6] : [4.4, 2.8, 5.4];

    camera.position.set(...position);
    camera.lookAt(...target);
    controlsRef.current?.target.set(...target);
    controlsRef.current?.update();
  }, [camera, viewMode]);

  return <OrbitControls ref={controlsRef} enablePan enableZoom minDistance={3.2} maxDistance={10} makeDefault />;
}

function Floor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.285, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#e7dcc6" roughness={0.94} metalness={0} />
      </mesh>
      <Grid
        position={[0, -1.252, 0]}
        args={[18, 18]}
        cellSize={0.5}
        cellThickness={0.55}
        cellColor="#b7aa92"
        sectionSize={2}
        sectionThickness={1.25}
        sectionColor="#8c7d65"
        fadeDistance={13}
        fadeStrength={1.4}
        infiniteGrid={false}
      />
    </group>
  );
}

export function SolidCanvas({ selectedFace, viewMode, transparentMode, onSelectFace }: SolidCanvasProps) {
  return (
    <Canvas shadows camera={{ position: [4.4, 3.4, 5.4], fov: 38 }}>
      <color attach="background" args={["#eaf8ff"]} />
      <fog attach="fog" args={["#eaf8ff", 18, 35]} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 8, 4]} intensity={2.8} castShadow />
      <pointLight position={[-4, 2, -4]} intensity={1.1} color="#7dd3fc" />
      <pointLight position={[4, -1, 3]} intensity={0.65} color="#bae6fd" />
      <CubeModel selectedFace={selectedFace} onSelectFace={onSelectFace} viewMode={viewMode} transparentMode={transparentMode} />
      <Floor />
      <ContactShadows position={[0, -1.23, 0]} opacity={0.42} scale={9} blur={2.8} />
      <CameraRig viewMode={viewMode} />
    </Canvas>
  );
}
