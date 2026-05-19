import { Html, Line } from "@react-three/drei";

type UnfoldHandleProps = {
  progress: number;
  onChangeProgress: (progress: number) => void;
};

export function UnfoldHandle({ progress, onChangeProgress }: UnfoldHandleProps) {
  return (
    <group position={[0, -0.18, 1.55]}>
      <Line
        points={[
          [-1.1, 0, 0],
          [1.1, 0, 0],
        ]}
        color="#0891b2"
        lineWidth={7}
      />
      <mesh position={[-1.18 + progress * 2.36, 0, 0]}>
        <sphereGeometry args={[0.1, 24, 24]} />
        <meshStandardMaterial color="#67e8f9" emissive="#0891b2" emissiveIntensity={0.8} />
      </mesh>
      <Html position={[0, 0.26, 0]} center distanceFactor={8} transform={false}>
        <div className="w-64 rounded-2xl border border-cyan-200/70 bg-slate-950/82 px-3 py-2 text-white shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
          <div className="mb-1 flex items-center justify-between text-[10px] font-black">
            <span className="text-cyan-200">아랫면 모서리 핸들</span>
            <span className="rounded-full bg-cyan-200 px-2 py-0.5 text-slate-950">{Math.round(progress * 100)}%</span>
          </div>
          <input
            aria-label="아랫면 기준 전개 핸들"
            type="range"
            min="0"
            max="100"
            value={Math.round(progress * 100)}
            onChange={(event) => onChangeProgress(Number(event.target.value) / 100)}
            className="h-2 w-full accent-cyan-300"
          />
          <div className="mt-1 flex justify-between text-[10px] font-bold text-slate-300">
            <span>접힌 주사위</span>
            <span>바닥 전개</span>
          </div>
        </div>
      </Html>
    </group>
  );
}
