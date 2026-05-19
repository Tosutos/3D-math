import { Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useState } from "react";
import { Vector3 } from "three";

type FaceKey = "front" | "back" | "left" | "right" | "top" | "bottom";

type CubeEdge = {
  id: string;
  points: [[number, number, number], [number, number, number]];
  faces: [FaceKey, FaceKey];
};

type DynamicCubeEdgesProps = {
  visible: boolean;
};

const faceInfo: Record<FaceKey, { center: Vector3; normal: Vector3 }> = {
  front: { center: new Vector3(0, 0, 1), normal: new Vector3(0, 0, 1) },
  back: { center: new Vector3(0, 0, -1), normal: new Vector3(0, 0, -1) },
  left: { center: new Vector3(-1, 0, 0), normal: new Vector3(-1, 0, 0) },
  right: { center: new Vector3(1, 0, 0), normal: new Vector3(1, 0, 0) },
  top: { center: new Vector3(0, 1, 0), normal: new Vector3(0, 1, 0) },
  bottom: { center: new Vector3(0, -1, 0), normal: new Vector3(0, -1, 0) },
};

const cubeEdges: CubeEdge[] = [
  { id: "front-top", points: [[-1, 1, 1], [1, 1, 1]], faces: ["front", "top"] },
  { id: "front-bottom", points: [[-1, -1, 1], [1, -1, 1]], faces: ["front", "bottom"] },
  { id: "front-left", points: [[-1, -1, 1], [-1, 1, 1]], faces: ["front", "left"] },
  { id: "front-right", points: [[1, -1, 1], [1, 1, 1]], faces: ["front", "right"] },
  { id: "back-top", points: [[-1, 1, -1], [1, 1, -1]], faces: ["back", "top"] },
  { id: "back-bottom", points: [[-1, -1, -1], [1, -1, -1]], faces: ["back", "bottom"] },
  { id: "back-left", points: [[-1, -1, -1], [-1, 1, -1]], faces: ["back", "left"] },
  { id: "back-right", points: [[1, -1, -1], [1, 1, -1]], faces: ["back", "right"] },
  { id: "left-top", points: [[-1, 1, -1], [-1, 1, 1]], faces: ["left", "top"] },
  { id: "left-bottom", points: [[-1, -1, -1], [-1, -1, 1]], faces: ["left", "bottom"] },
  { id: "right-top", points: [[1, 1, -1], [1, 1, 1]], faces: ["right", "top"] },
  { id: "right-bottom", points: [[1, -1, -1], [1, -1, 1]], faces: ["right", "bottom"] },
];

function getVisibleFaces(cameraPosition: Vector3) {
  const result = {} as Record<FaceKey, boolean>;

  (Object.keys(faceInfo) as FaceKey[]).forEach((face) => {
    const { center, normal } = faceInfo[face];
    const cameraDirection = cameraPosition.clone().sub(center).normalize();
    result[face] = normal.dot(cameraDirection) > 0;
  });

  return result;
}

export function DynamicCubeEdges({ visible }: DynamicCubeEdgesProps) {
  const { camera } = useThree();
  const [hiddenEdgeIds, setHiddenEdgeIds] = useState<Set<string>>(new Set());

  const edgePoints = useMemo(
    () =>
      cubeEdges.map((edge) => ({
        ...edge,
        points: edge.points.map((point) => new Vector3(...point)),
      })),
    [],
  );

  useFrame(() => {
    if (!visible) return;

    const visibleFaces = getVisibleFaces(camera.position);
    const nextHidden = new Set<string>();

    cubeEdges.forEach((edge) => {
      const [a, b] = edge.faces;
      if (!visibleFaces[a] && !visibleFaces[b]) {
        nextHidden.add(edge.id);
      }
    });

    setHiddenEdgeIds((current) => {
      if (current.size === nextHidden.size && [...current].every((id) => nextHidden.has(id))) return current;
      return nextHidden;
    });
  });

  if (!visible) return null;

  return (
    <group>
      {edgePoints.map((edge) => {
        const hidden = hiddenEdgeIds.has(edge.id);
        return (
          <Line
            key={`${edge.id}-${hidden ? "hidden" : "visible"}`}
            points={edge.points}
            color="#111827"
            lineWidth={hidden ? 2.2 : 2.6}
            dashed={hidden}
            dashSize={0.14}
            gapSize={0.1}
            transparent
            opacity={hidden ? 0.9 : 1}
            depthTest={!hidden}
          />
        );
      })}
    </group>
  );
}
