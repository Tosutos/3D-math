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

function getHingedUnfoldTransforms(progress: number): FaceTransform[] {
  const t = smoothstep(progress);
  const sideAngle = (Math.PI / 2) * (1 - t);
  const backAngle = Math.PI * (1 - t);

  const frontRightEdge: [number, number, number] = [1, 0, 1];
  const frontLeftEdge: [number, number, number] = [-1, 0, 1];
  const frontTopEdge: [number, number, number] = [0, 1, 1];
  const frontBottomEdge: [number, number, number] = [0, -1, 1];
  const rightBackEdge: [number, number, number] = [
    frontRightEdge[0] + 2 * Math.cos(sideAngle),
    0,
    frontRightEdge[2] - 2 * Math.sin(sideAngle),
  ];

  return [
    { faceId: "front", position: [0, 0, 1], rotation: [0, 0, 0] },
    {
      faceId: "right",
      position: [frontRightEdge[0] + Math.cos(sideAngle), 0, frontRightEdge[2] - Math.sin(sideAngle)],
      rotation: [0, sideAngle, 0],
    },
    {
      faceId: "left",
      position: [frontLeftEdge[0] - Math.cos(sideAngle), 0, frontLeftEdge[2] - Math.sin(sideAngle)],
      rotation: [0, -sideAngle, 0],
    },
    {
      faceId: "top",
      position: [0, frontTopEdge[1] + Math.cos(sideAngle), frontTopEdge[2] - Math.sin(sideAngle)],
      rotation: [-sideAngle, 0, 0],
    },
    {
      faceId: "bottom",
      position: [0, frontBottomEdge[1] - Math.cos(sideAngle), frontBottomEdge[2] - Math.sin(sideAngle)],
      rotation: [sideAngle, 0, 0],
    },
    {
      faceId: "back",
      position: [rightBackEdge[0] + Math.cos(backAngle), 0, rightBackEdge[2] - Math.sin(backAngle)],
      rotation: [0, backAngle, 0],
    },
  ];
}

export function CubeModel({ selectedFace, onSelectFace, viewMode, transparentMode, unfoldProgress }: CubeModelProps) {
  const isNet = viewMode === "net";
  const isUnfold = viewMode === "unfold";
  const transforms = isNet ? netFaceTransforms : isUnfold ? getHingedUnfoldTransforms(unfoldProgress) : foldedFaceTransforms;
  const position: [number, number, number] = isNet ? [-1.05, 0, 0.35] : isUnfold ? [-1.2, -0.28, 0] : [0, -0.28, 0];
  const scale = isNet ? 0.86 : isUnfold ? 0.78 : 1;

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
