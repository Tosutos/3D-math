"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Grid, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { CubeModel } from "@/components/three/CubeModel";
import { UnfoldHandle } from "@/components/three/UnfoldHandle";
import type { FaceId, GeometryViewMode } from "@/types/geometry";

type SolidCanvasProps = {
  selectedFace: FaceId | null;
  viewMode: GeometryViewMode;
  transparentMode: boolean;
  unfoldProgress: number;
  onSelectFace: (face: FaceId) => void;
  onChangeUnfoldProgress: (progress: number) => void;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mixVector(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function CameraRig({ viewMode, unfoldProgress, controlsEnabled }: { viewMode: GeometryViewMode; unfoldProgress: number; controlsEnabled: boolean }) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  useEffect(() => {
    const foldedTarget: [number, number, number] = [0, -0.28, 0];
    const foldedPosition: [number, number, number] = [4.4, 2.8, 5.4];
    const unfoldTarget: [number, number, number] = [0, -0.85, 0.95];
    const unfoldPosition: [number, number, number] = [0, 3.8, 7.4];
    const netTarget: [number, number, number] = [0.6, -1.18, 0.2];
    const netPosition: [number, number, number] = [0.6, 5.9, 5.2];
    const progress = viewMode === "unfold" ? unfoldProgress : 0;
    const target: [number, number, number] = viewMode === "net" ? netTarget : viewMode === "unfold" ? mixVector(foldedTarget, unfoldTarget, progress) : foldedTarget;
    const position: [number, number, number] =
      viewMode === "net" ? netPosition : viewMode === "unfold" ? mixVector(foldedPosition, unfoldPosition, progress) : viewMode === "isometric" ? [4.6, 3.4, 4.6] : foldedPosition;

    camera.position.set(...position);
    camera.lookAt(...target);
    controlsRef.current?.target.set(...target);
    controlsRef.current?.update();
  }, [camera, viewMode, unfoldProgress]);

  return <OrbitControls ref={controlsRef} enabled={controlsEnabled} enablePan enableZoom minDistance={3.2} maxDistance={10} makeDefault />;
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

export function SolidCanvas({ selectedFace, viewMode, transparentMode, unfoldProgress, onSelectFace, onChangeUnfoldProgress }: SolidCanvasProps) {
  const [handleDragging, setHandleDragging] = useState(false);
  const [handleCancelToken, setHandleCancelToken] = useState(0);

  return (
    <Canvas
      shadows
      camera={{ position: [4.4, 3.4, 5.4], fov: 38 }}
      onPointerMissed={() => {
        setHandleDragging(false);
        setHandleCancelToken((token) => token + 1);
      }}
    >
      <color attach="background" args={["#eaf8ff"]} />
      <fog attach="fog" args={["#eaf8ff", 18, 35]} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 8, 4]} intensity={2.8} castShadow />
      <pointLight position={[-4, 2, -4]} intensity={1.1} color="#7dd3fc" />
      <pointLight position={[4, -1, 3]} intensity={0.65} color="#bae6fd" />
      <CubeModel selectedFace={selectedFace} onSelectFace={onSelectFace} viewMode={viewMode} transparentMode={transparentMode} unfoldProgress={unfoldProgress} />
      {viewMode === "unfold" && (
        <UnfoldHandle
          key={handleCancelToken}
          progress={unfoldProgress}
          onChangeProgress={onChangeUnfoldProgress}
          onDragActiveChange={setHandleDragging}
        />
      )}
      <Floor />
      <ContactShadows position={[0, -1.23, 0]} opacity={0.42} scale={9} blur={2.8} />
      <CameraRig viewMode={viewMode} unfoldProgress={unfoldProgress} controlsEnabled={!handleDragging} />
    </Canvas>
  );
}
