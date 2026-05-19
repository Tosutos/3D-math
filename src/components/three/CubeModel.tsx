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

function Face({ faceId, selectedFace, transparentMode, onSelectFace }: Omit<CubeModelProps, "viewMode" | "unfoldProgress"> & { faceId: FaceId }) {
  return (
    <CubeFace
      faceId={faceId}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      selectedFace={selectedFace}
      transparentMode={transparentMode}
      onSelectFace={onSelectFace}
    />
  );
}

function FloorUnfoldCube({ selectedFace, transparentMode, onSelectFace, unfoldProgress }: Omit<CubeModelProps, "viewMode">) {
  const t = smoothstep(unfoldProgress);
  const sideAngle = (Math.PI / 2) * t;

  return (
    <group>
      <group position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <Face faceId="bottom" selectedFace={selectedFace} transparentMode={transparentMode} onSelectFace={onSelectFace} />
      </group>

      <group position={[0, -1, 1]} rotation={[sideAngle, 0, 0]}>
        <group position={[0, 1, 0]}>
          <Face faceId="front" selectedFace={selectedFace} transparentMode={transparentMode} onSelectFace={onSelectFace} />
        </group>
        <group position={[0, 2, 0]} rotation={[sideAngle, 0, 0]}>
          <group position={[0, 0, -1]} rotation={[-Math.PI / 2, 0, 0]}>
            <Face faceId="top" selectedFace={selectedFace} transparentMode={transparentMode} onSelectFace={onSelectFace} />
          </group>
        </group>
      </group>

      <group position={[0, -1, -1]} rotation={[-sideAngle, 0, 0]}>
        <group position={[0, 1, 0]} rotation={[0, Math.PI, 0]}>
          <Face faceId="back" selectedFace={selectedFace} transparentMode={transparentMode} onSelectFace={onSelectFace} />
        </group>
      </group>

      <group position={[1, -1, 0]} rotation={[0, 0, -sideAngle]}>
        <group position={[0, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
          <Face faceId="right" selectedFace={selectedFace} transparentMode={transparentMode} onSelectFace={onSelectFace} />
        </group>
      </group>

      <group position={[-1, -1, 0]} rotation={[0, 0, sideAngle]}>
        <group position={[0, 1, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <Face faceId="left" selectedFace={selectedFace} transparentMode={transparentMode} onSelectFace={onSelectFace} />
        </group>
      </group>
    </group>
  );
}

export function CubeModel({ selectedFace, onSelectFace, viewMode, transparentMode, unfoldProgress }: CubeModelProps) {
  const isNet = viewMode === "net";
  const isUnfold = viewMode === "unfold";
  const transforms = isNet ? netFaceTransforms : foldedFaceTransforms;
  const position: [number, number, number] = isNet ? [-1.05, 0, 0.35] : [0, -0.28, 0];
  const scale = isNet ? 0.86 : isUnfold ? 0.82 : 1;

  return (
    <group position={position} scale={scale}>
      {isUnfold ? (
        <FloorUnfoldCube selectedFace={selectedFace} onSelectFace={onSelectFace} transparentMode={transparentMode} unfoldProgress={unfoldProgress} />
      ) : (
        <>
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
        </>
      )}
    </group>
  );
}
