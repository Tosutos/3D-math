import type { ThreeEvent } from "@react-three/fiber";
import type { UnfoldEdgeId } from "@/types/geometry";

type UnfoldEdgeSelectorProps = {
  activeEdge: UnfoldEdgeId;
  onSelectEdge: (edge: UnfoldEdgeId) => void;
};

type EdgeConfig = {
  id: UnfoldEdgeId;
  position: [number, number, number];
  rotation: [number, number, number];
};

const edges: EdgeConfig[] = [
  { id: "bottom-front", position: [0, -0.97, 1], rotation: [0, 0, Math.PI / 2] },
  { id: "bottom-back", position: [0, -0.97, -1], rotation: [0, 0, Math.PI / 2] },
  { id: "bottom-right", position: [1, -0.97, 0], rotation: [Math.PI / 2, 0, 0] },
  { id: "bottom-left", position: [-1, -0.97, 0], rotation: [Math.PI / 2, 0, 0] },
];

export function UnfoldEdgeSelector({ activeEdge, onSelectEdge }: UnfoldEdgeSelectorProps) {
  const select = (edge: UnfoldEdgeId) => (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onSelectEdge(edge);
  };

  return (
    <group>
      {edges.map((edge) => {
        const active = edge.id === activeEdge;
        return (
          <group key={edge.id} position={edge.position} rotation={edge.rotation}>
            <mesh onPointerDown={select(edge.id)}>
              <cylinderGeometry args={[active ? 0.045 : 0.027, active ? 0.045 : 0.027, 2.05, 24]} />
              <meshStandardMaterial
                color={active ? "#facc15" : "#93c5fd"}
                emissive={active ? "#ca8a04" : "#1d4ed8"}
                emissiveIntensity={active ? 0.75 : 0.36}
                transparent
                opacity={active ? 0.98 : 0.72}
                roughness={0.24}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
