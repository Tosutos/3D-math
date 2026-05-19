import { Edges } from "@react-three/drei";
import { useMemo } from "react";
import { CanvasTexture, DoubleSide, LinearFilter } from "three";
import {
  adjacentFaceColor,
  baseFaceColor,
  cubeFaces,
  oppositeFaceColor,
  selectedFaceColor,
} from "@/data/cube";
import type { FaceId } from "@/types/geometry";

type CubeFaceProps = {
  faceId: FaceId;
  position: [number, number, number];
  rotation: [number, number, number];
  selectedFace: FaceId | null;
  transparentMode: boolean;
  onSelectFace: (face: FaceId) => void;
};

const faceLabels: Record<FaceId, string> = {
  front: "가",
  right: "나",
  back: "다",
  left: "라",
  top: "마",
  bottom: "바",
};

function createLabelTexture(label: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d")!;

  context.clearRect(0, 0, 256, 256);
  context.fillStyle = "rgba(255, 255, 255, 0.88)";
  context.beginPath();
  context.roundRect(44, 44, 168, 168, 48);
  context.fill();
  context.lineWidth = 10;
  context.strokeStyle = "rgba(15, 23, 42, 0.9)";
  context.stroke();

  context.fillStyle = "#0f172a";
  context.font = "900 118px Apple SD Gothic Neo, Noto Sans KR, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(label, 128, 132);

  const texture = new CanvasTexture(canvas);
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

export function CubeFace({ faceId, position, rotation, selectedFace, transparentMode, onSelectFace }: CubeFaceProps) {
  const isSelected = selectedFace === faceId;
  const selectedRelation = selectedFace ? cubeFaces[selectedFace] : null;
  const isOpposite = selectedRelation?.opposite === faceId;
  const isAdjacent = selectedRelation?.adjacent.includes(faceId) ?? false;
  const faceColor = isOpposite ? oppositeFaceColor : isSelected ? selectedFaceColor : isAdjacent ? adjacentFaceColor : baseFaceColor;
  const edgeColor = "#111827";
  const labelTexture = useMemo(() => createLabelTexture(faceLabels[faceId]), [faceId]);

  return (
    <group position={position} rotation={rotation}>
      <mesh
        castShadow
        receiveShadow
        onClick={(event) => {
          event.stopPropagation();
          onSelectFace(faceId);
        }}
      >
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial
          color={faceColor}
          emissive={isOpposite ? oppositeFaceColor : isSelected ? selectedFaceColor : "#000000"}
          emissiveIntensity={isOpposite ? 0.25 : isSelected ? 0.18 : 0}
          roughness={0.42}
          metalness={0.05}
          side={DoubleSide}
          transparent
          opacity={transparentMode ? (isSelected || isOpposite ? 0.72 : 0.34) : isSelected || isOpposite ? 1 : 0.82}
          depthWrite={!transparentMode}
        />
        {!transparentMode && <Edges color={edgeColor} linewidth={2} />}
      </mesh>
      <mesh
        position={[0, 0, 0.032]}
        onClick={(event) => {
          event.stopPropagation();
          onSelectFace(faceId);
        }}
      >
        <planeGeometry args={[0.68, 0.68]} />
        <meshBasicMaterial map={labelTexture} transparent opacity={transparentMode ? 0.72 : 0.95} depthWrite={false} side={DoubleSide} />
      </mesh>
      <mesh
        position={[0, 0, -0.032]}
        rotation={[0, Math.PI, 0]}
        onClick={(event) => {
          event.stopPropagation();
          onSelectFace(faceId);
        }}
      >
        <planeGeometry args={[0.68, 0.68]} />
        <meshBasicMaterial map={labelTexture} transparent opacity={transparentMode ? 0.72 : 0.95} depthWrite={false} side={DoubleSide} />
      </mesh>
    </group>
  );
}
