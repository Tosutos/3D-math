import type { ThreeEvent } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const pendingProgressRef = useRef(progress);
  const startProgressRef = useRef(progress);
  const startClientXRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const stopDrag = useCallback(() => {
    setDragging(false);
    onDragActiveChange(false);
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, [onDragActiveChange]);

  useEffect(() => {
    progressRef.current = progress;
    pendingProgressRef.current = progress;
    if (!dragging) startProgressRef.current = progress;
  }, [dragging, progress]);

  const flushProgress = useCallback(() => {
    rafRef.current = null;
    const next = pendingProgressRef.current;
    if (Math.abs(next - progressRef.current) < 0.001) return;
    progressRef.current = next;
    onChangeProgress(next);
  }, [onChangeProgress]);

  useEffect(() => {
    if (!dragging) return;

    const handlePointerMove = (event: PointerEvent) => {
      pendingProgressRef.current = clamp01(startProgressRef.current + (event.clientX - startClientXRef.current) / 360);
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(flushProgress);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", stopDrag);
    window.addEventListener("pointercancel", stopDrag);
    window.addEventListener("blur", stopDrag);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDrag);
      window.removeEventListener("pointercancel", stopDrag);
      window.removeEventListener("blur", stopDrag);
    };
  }, [dragging, flushProgress, stopDrag]);

  const startDrag = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    startClientXRef.current = event.nativeEvent.clientX;
    startProgressRef.current = progressRef.current;
    pendingProgressRef.current = progressRef.current;
    setDragging(true);
    onDragActiveChange(true);
  };

  const endDrag = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    stopDrag();
  };

  return (
    <group position={[0, -0.34, 1.58]}>
      <mesh position={[0, 0, -0.012]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.026, 0.026, handleLength + 0.18, 20]} />
        <meshStandardMaterial color="#dbeafe" transparent opacity={0.58} roughness={0.2} />
      </mesh>

      <mesh rotation={[0, 0, Math.PI / 2]} onPointerDown={startDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
        <cylinderGeometry args={[0.018, 0.018, handleLength, 24]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0369a1" emissiveIntensity={0.5} roughness={0.22} metalness={0.08} />
      </mesh>

      {[-halfHandleLength, halfHandleLength].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#e0f2fe" emissive="#0ea5e9" emissiveIntensity={0.25} roughness={0.3} />
        </mesh>
      ))}

      <mesh position={[-halfHandleLength + progress * handleLength, 0, 0]} onPointerDown={startDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
        <sphereGeometry args={[dragging ? 0.105 : 0.09, 24, 24]} />
        <meshStandardMaterial
          color={dragging ? "#fde68a" : "#67e8f9"}
          emissive={dragging ? "#ca8a04" : "#0891b2"}
          emissiveIntensity={dragging ? 0.95 : 0.72}
          roughness={0.18}
          metalness={0.1}
        />
      </mesh>

      <mesh position={[-halfHandleLength + progress * handleLength, 0, 0]}>
        <torusGeometry args={[dragging ? 0.15 : 0.13, 0.009, 8, 24]} />
        <meshStandardMaterial color={dragging ? "#fef3c7" : "#bae6fd"} transparent opacity={0.7} emissive="#0284c7" emissiveIntensity={0.28} />
      </mesh>
    </group>
  );
}
