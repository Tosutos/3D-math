import { CubeFace } from "@/components/three/CubeFace";
import { DynamicCubeEdges } from "@/components/three/DynamicCubeEdges";
import type { FaceId, GeometryViewMode, UnfoldEdgeId } from "@/types/geometry";

type CubeModelProps = {
  selectedFace: FaceId | null;
  onSelectFace: (face: FaceId) => void;
  viewMode: GeometryViewMode;
  transparentMode: boolean;
  unfoldProgress: number;
  activeUnfoldEdge: UnfoldEdgeId;
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

function Face({ faceId, selectedFace, transparentMode, onSelectFace }: Omit<CubeModelProps, "viewMode" | "unfoldProgress" | "activeUnfoldEdge"> & { faceId: FaceId }) {
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

type SideConfig = {
  edge: UnfoldEdgeId;
  faceId: FaceId;
  hingePosition: [number, number, number];
  hingeRotation: [number, number, number];
  faceRotation: [number, number, number];
  topRotation: [number, number, number];
};

function SideWithOptionalTop({
  config,
  sideAngle,
  activeUnfoldEdge,
  selectedFace,
  transparentMode,
  onSelectFace,
}: {
  config: SideConfig;
  sideAngle: number;
  activeUnfoldEdge: UnfoldEdgeId;
  selectedFace: FaceId | null;
  transparentMode: boolean;
  onSelectFace: (face: FaceId) => void;
}) {
  const hingeRotation = config.hingeRotation.map((value) => value * sideAngle) as [number, number, number];
  const topHingeRotation = config.hingeRotation.map((value) => value * sideAngle) as [number, number, number];
  const topAttached = config.edge === activeUnfoldEdge;

  return (
    <group position={config.hingePosition} rotation={hingeRotation}>
      <group position={[0, 1, 0]} rotation={config.faceRotation}>
        <Face faceId={config.faceId} selectedFace={selectedFace} transparentMode={transparentMode} onSelectFace={onSelectFace} />
      </group>
      {topAttached && (
        <group position={[0, 2, 0]} rotation={topHingeRotation}>
          <group position={[0, 0, -1]} rotation={config.topRotation}>
            <Face faceId="top" selectedFace={selectedFace} transparentMode={transparentMode} onSelectFace={onSelectFace} />
          </group>
        </group>
      )}
    </group>
  );
}

const sideConfigs: SideConfig[] = [
  {
    edge: "bottom-front",
    faceId: "front",
    hingePosition: [0, -1, 1],
    hingeRotation: [1, 0, 0],
    faceRotation: [0, 0, 0],
    topRotation: [-Math.PI / 2, 0, 0],
  },
  {
    edge: "bottom-back",
    faceId: "back",
    hingePosition: [0, -1, -1],
    hingeRotation: [-1, 0, 0],
    faceRotation: [0, Math.PI, 0],
    topRotation: [Math.PI / 2, Math.PI, 0],
  },
  {
    edge: "bottom-right",
    faceId: "right",
    hingePosition: [1, -1, 0],
    hingeRotation: [0, 0, -1],
    faceRotation: [0, Math.PI / 2, 0],
    topRotation: [-Math.PI / 2, 0, -Math.PI / 2],
  },
  {
    edge: "bottom-left",
    faceId: "left",
    hingePosition: [-1, -1, 0],
    hingeRotation: [0, 0, 1],
    faceRotation: [0, -Math.PI / 2, 0],
    topRotation: [-Math.PI / 2, 0, Math.PI / 2],
  },
];

function FloorUnfoldCube({ selectedFace, transparentMode, onSelectFace, unfoldProgress, activeUnfoldEdge }: Omit<CubeModelProps, "viewMode">) {
  const sideAngle = (Math.PI / 2) * smoothstep(unfoldProgress);

  return (
    <group>
      <group position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <Face faceId="bottom" selectedFace={selectedFace} transparentMode={transparentMode} onSelectFace={onSelectFace} />
      </group>

      {sideConfigs.map((config) => (
        <SideWithOptionalTop
          key={config.edge}
          config={config}
          sideAngle={sideAngle}
          activeUnfoldEdge={activeUnfoldEdge}
          selectedFace={selectedFace}
          transparentMode={transparentMode}
          onSelectFace={onSelectFace}
        />
      ))}
    </group>
  );
}

export function CubeModel({ selectedFace, onSelectFace, viewMode, transparentMode, unfoldProgress, activeUnfoldEdge }: CubeModelProps) {
  const isNet = viewMode === "net";
  const isUnfold = viewMode === "unfold";
  const transforms = isNet ? netFaceTransforms : foldedFaceTransforms;
  const position: [number, number, number] = isNet ? [-1.05, 0, 0.35] : [0, -0.28, 0];
  const scale = isNet ? 0.86 : isUnfold ? 0.82 : 1;

  return (
    <group position={position} scale={scale}>
      {isUnfold ? (
        <FloorUnfoldCube
          selectedFace={selectedFace}
          onSelectFace={onSelectFace}
          transparentMode={transparentMode}
          unfoldProgress={unfoldProgress}
          activeUnfoldEdge={activeUnfoldEdge}
        />
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
