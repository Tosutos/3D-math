import type { GeometryViewMode, LearningMode } from "@/types/geometry";

type FloatingToolbarProps = {
  mode: LearningMode;
  viewMode: GeometryViewMode;
  transparentMode: boolean;
  onChangeMode: (mode: LearningMode) => void;
  onChangeViewMode: (viewMode: GeometryViewMode) => void;
  onToggleTransparent: () => void;
  onReset: () => void;
};

const buttonBase = "rounded-xl px-3 py-2 text-xs font-black transition";

export function FloatingToolbar({
  mode,
  viewMode,
  transparentMode,
  onChangeMode,
  onChangeViewMode,
  onToggleTransparent,
  onReset,
}: FloatingToolbarProps) {
  return (
    <aside className="absolute left-3 top-3 z-20 max-h-[calc(100vh-1.5rem)] w-[min(260px,calc(100vw-1.5rem))] overflow-y-auto rounded-3xl border border-white/15 bg-slate-950/78 p-4 text-white shadow-2xl shadow-black/40 backdrop-blur-xl md:left-4 md:top-4">
      <p className="text-[10px] font-black tracking-[0.24em] text-cyan-300">3D MATH TOOL</p>
      <h1 className="mt-1 text-xl font-black tracking-[-0.04em]">3D 도형 변환 실험실</h1>

      <div className="mt-4 rounded-2xl bg-white/8 p-3">
        <p className="mb-2 text-xs font-bold text-slate-300">도형</p>
        <button className={`${buttonBase} w-full bg-cyan-300 text-slate-950`} type="button">
          정육면체
        </button>
      </div>

      <div className="mt-3 rounded-2xl bg-white/8 p-3">
        <p className="mb-2 text-xs font-bold text-slate-300">보기 방식</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            ["solid", "입체"],
            ["isometric", "겨냥도"],
            ["net", "전개"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onChangeViewMode(value as GeometryViewMode)}
              className={`${buttonBase} ${viewMode === value ? "bg-white text-slate-950" : "bg-white/10 text-slate-200 hover:bg-white/20"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-4 text-slate-400">겨냥도와 전개도는 별도 창이 아니라 3D 공간 안에서 전환됩니다.</p>
      </div>

      <div className="mt-3 rounded-2xl bg-white/8 p-3">
        <p className="mb-2 text-xs font-bold text-slate-300">모드</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChangeMode("explore")}
            className={`${buttonBase} ${mode === "explore" ? "bg-sky-400 text-slate-950" : "bg-white/10 text-slate-200 hover:bg-white/20"}`}
          >
            탐구
          </button>
          <button
            type="button"
            onClick={() => onChangeMode("mission")}
            className={`${buttonBase} ${mode === "mission" ? "bg-amber-300 text-slate-950" : "bg-white/10 text-slate-200 hover:bg-white/20"}`}
          >
            미션
          </button>
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-white/8 p-3">
        <p className="mb-2 text-xs font-bold text-slate-300">관찰 도구</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onToggleTransparent}
            className={`${buttonBase} ${transparentMode ? "bg-violet-300 text-slate-950" : "bg-white/10 text-slate-200 hover:bg-white/20"}`}
          >
            투명화 {transparentMode ? "ON" : "OFF"}
          </button>
          <button type="button" onClick={onReset} className={`${buttonBase} bg-white/10 text-slate-200 hover:bg-white/20`}>
            선택 초기화
          </button>
        </div>
        <p className="mt-2 text-[11px] leading-4 text-slate-400">투명화를 켜면 보이는 면과 가려진 면의 차이를 비교하기 쉬워집니다.</p>
      </div>
    </aside>
  );
}
