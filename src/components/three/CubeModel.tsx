import { CubeFace } from "@/components/three/CubeFace";
import { DynamicCubeEdges } from "@/components/three/DynamicCubeEdges";
import type { FaceId, GeometryViewMode } from "@/types/geometry";

type CubeModelProps = {
  selectedFace: FaceId | null;
  onSelectFace: (face: FaceId) => void;
  viewMode: GeometryViewMode;
  transparentMode: boolean;
  unfoldProgress: number;
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

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function getFloorUnfoldTransforms(progress: number): FaceTransform[] {
  const t = smoothstep(progress);
  const sideAngle = (Math.PI / 2) * (1 - t);
  const topAngle = Math.PI * (1 - t);
  const floorY = -1;

  const frontOuterEdgeY = floorY + 2 * Math.sin(sideAngle);
  const frontOuterEdgeZ = 1 + 2 * Math.cos(sideAngle);

  return [
    {
      faceId: "bottom",
      position: [0, floorY, 0],
      rotation: [Math.PI / 2, 0, 0],
    },
    {
      faceId: "front",
      position: [0, floorY + Math.sin(sideAngle), 1 + Math.cos(sideAngle)],
      rotation: [sideAngle - Math.PI / 2, 0, 0],
    },
    {
      faceId: "back",
      position: [0, floorY + Math.sin(sideAngle), -1 - Math.cos(sideAngle)],
      rotation: [Math.PI / 2 - sideAngle, Math.PI, 0],
    },
    {
      faceId: "right",
      position: [1 + Math.cos(sideAngle), floorY + Math.sin(sideAngle), 0],
      rotation: [Math.PI / 2, 0, Math.PI / 2 - sideAngle],
    },
    {
      faceId: "left",
      position: [-1 - Math.cos(sideAngle), floorY + Math.sin(sideAngle), 0],
      rotation: [Math.PI / 2, 0, sideAngle - Math.PI / 2],
    },
    {
      faceId: "top",
      position: [0, frontOuterEdgeY + Math.sin(topAngle), frontOuterEdgeZ + Math.cos(topAngle)],
      rotation: [Math.PI / 2 - topAngle, 0, 0],
    },
  ];
}

export function CubeModel({ selectedFace, onSelectFace, viewMode, transparentMode, unfoldProgress }: CubeModelProps) {
  const isNet = viewMode === "net";
  const isUnfold = viewMode === "unfold";
  const transforms = isNet ? netFaceTransforms : isUnfold ? getFloorUnfoldTransforms(unfoldProgress) : foldedFaceTransforms;
  const position: [number, number, number] = isNet ? [-1.05, 0, 0.35] : isUnfold ? [0, -0.28, 0] : [0, -0.28, 0];
  const scale = isNet ? 0.86 : isUnfold ? 0.82 : 1;

  return (
    <group position={position} scale={scale}>
      {!isNet && !isUnfold && <DynamicCubeEdges visible={transparentMode} />}
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
