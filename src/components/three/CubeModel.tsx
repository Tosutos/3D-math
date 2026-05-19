import { CubeFace } from "@/components/three/CubeFace";
import { DynamicCubeEdges } from "@/components/three/DynamicCubeEdges";
import type { FaceId, GeometryViewMode } from "@/types/geometry";

type CubeModelProps = {
  selectedFace: FaceId | null;
  onSelectFace: (face: FaceId) => void;
  viewMode: GeometryViewMode;
  transparentMode: boolean;
};

type FaceTransform = {
  faceId: FaceId;
  position: [number, number, number];
  rotation: [number, number, number];
};

const foldedFaceTransforms: FaceTransform[] = [
  { faceId: "front", position: [0, 0, 1], rotation: [0, 0, 0] },
  { faceId: "back", position: [0, 0, -1], rotation: [0, Math.PI, 0] },
  { faceId: "right", position: [1, 0, 0], rotation: [0, Math.PI / 2, 0] },
  { faceId: "left", position: [-1, 0, 0], rotation: [0, -Math.PI / 2, 0] },
  { faceId: "top", position: [0, 1, 0], rotation: [-Math.PI / 2, 0, 0] },
  { faceId: "bottom", position: [0, -1, 0], rotation: [Math.PI / 2, 0, 0] },
];

const netFaceTransforms: FaceTransform[] = [
  { faceId: "top", position: [0, -1.23, -2], rotation: [-Math.PI / 2, 0, 0] },
  { faceId: "left", position: [-2, -1.23, 0], rotation: [-Math.PI / 2, 0, 0] },
  { faceId: "front", position: [0, -1.23, 0], rotation: [-Math.PI / 2, 0, 0] },
  { faceId: "right", position: [2, -1.23, 0], rotation: [-Math.PI / 2, 0, 0] },
  { faceId: "back", position: [4, -1.23, 0], rotation: [-Math.PI / 2, 0, 0] },
  { faceId: "bottom", position: [0, -1.23, 2], rotation: [-Math.PI / 2, 0, 0] },
];

export function CubeModel({ selectedFace, onSelectFace, viewMode, transparentMode }: CubeModelProps) {
  const isNet = viewMode === "net";
  const transforms = isNet ? netFaceTransforms : foldedFaceTransforms;
  const position: [number, number, number] = isNet ? [-1.05, 0, 0.35] : [0, -0.28, 0];
  const scale = isNet ? 0.86 : 1;

  return (
    <group position={position} scale={scale}>
      {!isNet && <DynamicCubeEdges visible={transparentMode} />}
      {transforms.map((face) => (
        <CubeFace
          key={face.faceId}
          faceId={face.faceId}
          position={face.position}
          rotation={face.rotation}
          selectedFace={selectedFace}
          transparentMode={transparentMode}
          onSelectFace={onSelectFace}
        />
      ))}
    </group>
  );
}
