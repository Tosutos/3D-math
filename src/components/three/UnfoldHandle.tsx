import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

type UnfoldHandleProps = {
  progress: number;
  onChangeProgress: (progress: number) => void;
  onDragActiveChange: (active: boolean) => void;
};

const handleLength = 1.48;
const halfHandleLength = handleLength / 2;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function UnfoldHandle({ progress, onChangeProgress, onDragActiveChange }: UnfoldHandleProps) {
  const [dragging, setDragging] = useState(false);
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const startDrag = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setDragging(true);
    onDragActiveChange(true);
  };

  const drag = (event: ThreeEvent<PointerEvent>) => {
    if (!dragging) return;
    event.stopPropagation();
    onChangeProgress(clamp01(progressRef.current + event.nativeEvent.movementX / 320));
  };

  const endDrag = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setDragging(false);
    onDragActiveChange(false);
  };

  return (
    <group position={[0, -0.34, 1.58]}>
      <mesh position={[0, 0, -0.012]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.026, 0.026, handleLength + 0.18, 24]} />
        <meshStandardMaterial color="#dbeafe" transparent opacity={0.58} roughness={0.2} />
      </mesh>

      <mesh rotation={[0, 0, Math.PI / 2]} onPointerDown={startDrag} onPointerMove={drag} onPointerUp={endDrag} onPointerCancel={endDrag}>
        <cylinderGeometry args={[0.018, 0.018, handleLength, 32]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0369a1" emissiveIntensity={0.5} roughness={0.22} metalness={0.08} />
      </mesh>

      {[-halfHandleLength, halfHandleLength].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <sphereGeometry args={[0.045, 20, 20]} />
          <meshStandardMaterial color="#e0f2fe" emissive="#0ea5e9" emissiveIntensity={0.25} roughness={0.3} />
        </mesh>
      ))}

      <mesh
        position={[-halfHandleLength + progress * handleLength, 0, 0]}
        onPointerDown={startDrag}
        onPointerMove={drag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <sphereGeometry args={[dragging ? 0.105 : 0.09, 32, 32]} />
        <meshStandardMaterial
          color={dragging ? "#fde68a" : "#67e8f9"}
          emissive={dragging ? "#ca8a04" : "#0891b2"}
          emissiveIntensity={dragging ? 0.95 : 0.72}
          roughness={0.18}
          metalness={0.1}
        />
      </mesh>

      <mesh position={[-halfHandleLength + progress * handleLength, 0, 0]}>
        <torusGeometry args={[dragging ? 0.15 : 0.13, 0.009, 10, 32]} />
        <meshStandardMaterial color={dragging ? "#fef3c7" : "#bae6fd"} transparent opacity={0.7} emissive="#0284c7" emissiveIntensity={0.28} />
      </mesh>
    </group>
  );
}
