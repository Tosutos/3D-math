import { Edges } from "@react-three/drei";
import { DoubleSide } from "three";
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

export function CubeFace({ faceId, position, rotation, selectedFace, transparentMode, onSelectFace }: CubeFaceProps) {
  const isSelected = selectedFace === faceId;
  const selectedRelation = selectedFace ? cubeFaces[selectedFace] : null;
  const isOpposite = selectedRelation?.opposite === faceId;
  const isAdjacent = selectedRelation?.adjacent.includes(faceId) ?? false;
  const faceColor = isOpposite ? oppositeFaceColor : isSelected ? selectedFaceColor : isAdjacent ? adjacentFaceColor : baseFaceColor;
  const edgeColor = "#111827";

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
    </group>
  );
}
