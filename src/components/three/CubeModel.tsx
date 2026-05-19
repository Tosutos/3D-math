import { CubeFace } from "@/components/three/CubeFace";
import { DynamicCubeEdges } from "@/components/three/DynamicCubeEdges";
import type { FaceId, GeometryViewMode, LearningMode } from "@/types/geometry";

type CubeModelProps = {
  selectedFace: FaceId | null;
  selectedFaces?: FaceId[];
  onSelectFace: (face: FaceId) => void;
  viewMode: GeometryViewMode;
  transparentMode: boolean;
  unfoldProgress: number;
  showFaceLabels: boolean;
  showFaceEdges?: boolean;
  mode: LearningMode;
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

function Face({ faceId, selectedFace, selectedFaces, transparentMode, onSelectFace, showFaceLabels, showFaceEdges, mode }: Omit<CubeModelProps, "viewMode" | "unfoldProgress"> & { faceId: FaceId }) {
  return (
    <CubeFace
      faceId={faceId}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      selectedFace={selectedFace}
      selectedFaces={selectedFaces}
      transparentMode={transparentMode}
      onSelectFace={onSelectFace}
      showLabel={showFaceLabels}
      showEdges={showFaceEdges}
      isMissionMode={mode === "mission"}
    />
  );
}

function FloorUnfoldCube({ selectedFace, selectedFaces, transparentMode, onSelectFace, unfoldProgress, showFaceLabels, showFaceEdges, mode }: Omit<CubeModelProps, "viewMode">) {
  const t = smoothstep(unfoldProgress);
  const sideAngle = (Math.PI / 2) * t;

  return (
    <group>
      <group position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <Face faceId="bottom" selectedFace={selectedFace} selectedFaces={selectedFaces} transparentMode={transparentMode} onSelectFace={onSelectFace} showFaceLabels={showFaceLabels} showFaceEdges={showFaceEdges} mode={mode} />
      </group>

      <group position={[0, -1, 1]} rotation={[sideAngle, 0, 0]}>
        <group position={[0, 1, 0]}>
          <Face faceId="front" selectedFace={selectedFace} selectedFaces={selectedFaces} transparentMode={transparentMode} onSelectFace={onSelectFace} showFaceLabels={showFaceLabels} showFaceEdges={showFaceEdges} mode={mode} />
        </group>
        <group position={[0, 2, 0]} rotation={[sideAngle, 0, 0]}>
          <group position={[0, 0, -1]} rotation={[-Math.PI / 2, 0, 0]}>
            <Face faceId="top" selectedFace={selectedFace} selectedFaces={selectedFaces} transparentMode={transparentMode} onSelectFace={onSelectFace} showFaceLabels={showFaceLabels} showFaceEdges={showFaceEdges} mode={mode} />
          </group>
        </group>
      </group>

      <group position={[0, -1, -1]} rotation={[-sideAngle, 0, 0]}>
        <group position={[0, 1, 0]} rotation={[0, Math.PI, 0]}>
          <Face faceId="back" selectedFace={selectedFace} selectedFaces={selectedFaces} transparentMode={transparentMode} onSelectFace={onSelectFace} showFaceLabels={showFaceLabels} showFaceEdges={showFaceEdges} mode={mode} />
        </group>
      </group>

      <group position={[1, -1, 0]} rotation={[0, 0, -sideAngle]}>
        <group position={[0, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
          <Face faceId="right" selectedFace={selectedFace} selectedFaces={selectedFaces} transparentMode={transparentMode} onSelectFace={onSelectFace} showFaceLabels={showFaceLabels} showFaceEdges={showFaceEdges} mode={mode} />
        </group>
      </group>

      <group position={[-1, -1, 0]} rotation={[0, 0, sideAngle]}>
        <group position={[0, 1, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <Face faceId="left" selectedFace={selectedFace} selectedFaces={selectedFaces} transparentMode={transparentMode} onSelectFace={onSelectFace} showFaceLabels={showFaceLabels} showFaceEdges={showFaceEdges} mode={mode} />
        </group>
      </group>
    </group>
  );
}

export function CubeModel({ selectedFace, selectedFaces, onSelectFace, viewMode, transparentMode, unfoldProgress, showFaceLabels, showFaceEdges, mode }: CubeModelProps) {
  const isNet = viewMode === "net";
  const isUnfold = viewMode === "unfold";
  const transforms = isNet ? netFaceTransforms : foldedFaceTransforms;
  const position: [number, number, number] = isNet ? [-1.05, 0, 0.35] : [0, -0.28, 0];
  const scale = isNet ? 0.86 : isUnfold ? 0.82 : 1;

  return (
    <group position={position} scale={scale}>
      {(isUnfold || isNet) ? (
        <FloorUnfoldCube selectedFace={selectedFace} selectedFaces={selectedFaces} onSelectFace={onSelectFace} transparentMode={transparentMode} unfoldProgress={isNet ? 1 : unfoldProgress} showFaceLabels={showFaceLabels} showFaceEdges={showFaceEdges} mode={mode} />
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
              selectedFaces={selectedFaces}
              transparentMode={transparentMode}
              onSelectFace={onSelectFace}
              showLabel={showFaceLabels}
              showEdges={showFaceEdges}
              isMissionMode={mode === "mission"}
            />
          ))}
        </>
      )}
    </group>
  );
}
