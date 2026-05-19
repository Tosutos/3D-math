import { cubeFaces, faceColors, oppositeFaceColor } from "@/data/cube";
import type { FaceId } from "@/types/geometry";

type InspectorPanelProps = {
  selectedFace: FaceId | null;
  viewMode?: "solid" | "isometric" | "net";
};

export function InspectorPanel({ selectedFace, viewMode = "solid" }: InspectorPanelProps) {
  const selected = selectedFace ? cubeFaces[selectedFace] : null;

  return (
    <aside className="absolute right-4 top-4 z-20 hidden w-[300px] rounded-3xl border border-white/15 bg-white/88 p-4 text-slate-950 shadow-2xl shadow-black/30 backdrop-blur-xl lg:block">
      <p className="text-[10px] font-black tracking-[0.24em] text-sky-600">INSPECTOR</p>
      <h2 className="mt-1 text-xl font-black tracking-[-0.04em]">선택 정보</h2>

      {selected ? (
        <div className="mt-4 space-y-4">
          <div className="rounded-2xl p-4 ring-2 ring-slate-900" style={{ backgroundColor: faceColors[selected.id] }}>
            <p className="text-xs font-bold text-slate-700">선택한 면</p>
            <p className="mt-1 text-2xl font-black">{selected.label}</p>
            <p className="mt-1 text-xs font-bold text-slate-700">
              기본 겨냥도에서 {selected.visibleInDefaultView ? "보이는 면" : "숨은 면"}
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
            <p className="text-xs font-black text-emerald-800">평행한 면</p>
            <p className="mt-1 font-black">{cubeFaces[selected.opposite].label}</p>
            <p className="mt-2 text-xs font-bold text-emerald-700">
              3D 도형에서는 이 면이 초록색으로 표시됩니다.
            </p>
            <span className="mt-2 inline-block h-3 w-10 rounded-full" style={{ backgroundColor: oppositeFaceColor }} />
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black text-emerald-800">만나는 면</p>
            <p className="mt-1 text-sm font-bold leading-6">
              {selected.adjacent.map((faceId) => cubeFaces[faceId].label).join(" · ")}
            </p>
          </div>
        </div>
      ) : (
        <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-600">
          3D 도형, 겨냥도, 전개도 중 하나에서 면을 선택하면 관계가 표시됩니다.
        </p>
      )}

      {viewMode === "net" && (
        <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-900 ring-1 ring-amber-200">
          전개도에서 ‘윗면’과 ‘아랫면’은 정육면체를 어떤 방향에서 기준으로 보느냐에 따라 바뀔 수 있어요. 여기서는 기준이 되는 옆면 위쪽에 붙은 면을 윗면으로 표시했어요.
        </p>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl bg-sky-50 p-3"><p className="text-xs font-bold text-sky-700">면</p><p className="font-black">6</p></div>
        <div className="rounded-2xl bg-sky-50 p-3"><p className="text-xs font-bold text-sky-700">모서리</p><p className="font-black">12</p></div>
        <div className="rounded-2xl bg-sky-50 p-3"><p className="text-xs font-bold text-sky-700">꼭짓점</p><p className="font-black">8</p></div>
      </div>
    </aside>
  );
}
