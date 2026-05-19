import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

type UnfoldHandleProps = {
  progress: number;
  onChangeProgress: (progress: number) => void;
  onDragActiveChange: (active: boolean) => void;
};

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
    onChangeProgress(clamp01(progressRef.current + event.nativeEvent.movementX / 260));
  };

  const endDrag = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setDragging(false);
    onDragActiveChange(false);
  };

  return (
    <group position={[0, -0.42, 1.95]}>
      <mesh rotation={[0, 0, Math.PI / 2]} onPointerDown={startDrag} onPointerMove={drag} onPointerUp={endDrag} onPointerCancel={endDrag}>
        <cylinderGeometry args={[0.045, 0.045, 2.6, 24]} />
        <meshStandardMaterial color="#0891b2" emissive="#155e75" emissiveIntensity={0.6} roughness={0.35} />
      </mesh>

      <mesh
        position={[-1.3 + progress * 2.6, 0, 0]}
        onPointerDown={startDrag}
        onPointerMove={drag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial color={dragging ? "#facc15" : "#67e8f9"} emissive={dragging ? "#a16207" : "#0891b2"} emissiveIntensity={0.9} roughness={0.28} />
      </mesh>

      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[2.8, 0.035, 0.035]} />
        <meshStandardMaterial color="#e0f2fe" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}
