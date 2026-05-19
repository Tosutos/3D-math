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
        <div className="grid grid-cols-4 gap-2">
          {[
            ["solid", "입체"],
            ["isometric", "겨냥"],
            ["unfold", "펼치기"],
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
        <p className="mt-2 text-[11px] leading-4 text-slate-400">
          펼치기에서는 장면 안의 아랫면 모서리 핸들바를 끌어 종이 주사위처럼 바닥으로 펼칩니다.
        </p>
      </div>

      {viewMode === "unfold" && (
        <div className="mt-3 rounded-2xl border border-cyan-200/20 bg-cyan-300/10 p-3 text-[11px] font-bold leading-4 text-cyan-100/85">
          3D 화면의 파란 mesh 핸들바를 좌우로 드래그해 보세요. 아랫면은 바닥에 남고 나머지 면이 종이처럼 접혀 펴집니다.
        </div>
      )}

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
