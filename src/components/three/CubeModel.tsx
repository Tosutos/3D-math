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

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mixVector(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function getUnfoldTransforms(progress: number): FaceTransform[] {
  const t = smoothstep(progress);
  const netByFace = new Map(netFaceTransforms.map((face) => [face.faceId, face]));

  return foldedFaceTransforms.map((foldedFace) => {
    const netFace = netByFace.get(foldedFace.faceId)!;
    return {
      faceId: foldedFace.faceId,
      position: mixVector(foldedFace.position, netFace.position, t),
      rotation: mixVector(foldedFace.rotation, netFace.rotation, t),
    };
  });
}

export function CubeModel({ selectedFace, onSelectFace, viewMode, transparentMode, unfoldProgress }: CubeModelProps) {
  const isNet = viewMode === "net";
  const isUnfold = viewMode === "unfold";
  const transforms = isNet ? netFaceTransforms : isUnfold ? getUnfoldTransforms(unfoldProgress) : foldedFaceTransforms;
  const position: [number, number, number] = isNet || isUnfold ? [-1.05, 0, 0.35] : [0, -0.28, 0];
  const scale = isNet || isUnfold ? 0.86 : 1;

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
