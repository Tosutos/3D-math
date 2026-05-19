import { cubeFaces } from "@/data/cube";
import { missions } from "@/data/missions";
import { getMissionFeedback, isMissionCorrect } from "@/lib/feedback";
import type { FaceId } from "@/types/geometry";

type MissionBarProps = {
  activeMissionIndex: number;
  selectedFaces: FaceId[];
  result: "correct" | "wrong" | null;
  onChangeMission: (index: number) => void;
  onCheck: (result: "correct" | "wrong") => void;
  onReset: () => void;
};

export function MissionBar({ activeMissionIndex, selectedFaces, result, onChangeMission, onCheck, onReset }: MissionBarProps) {
  const mission = missions[activeMissionIndex];

  return (
    <section className="absolute bottom-4 right-4 z-30 w-[min(720px,calc(100vw-2rem))] rounded-3xl border border-amber-200/70 bg-amber-50/92 p-4 text-slate-950 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-black tracking-[0.22em] text-amber-700">MISSION</p>
          <h2 className="text-lg font-black">{mission.title}</h2>
          <p className="mt-1 text-sm font-bold text-slate-700">{mission.prompt}</p>
          <p className="mt-1 text-xs text-slate-500">
            선택: {selectedFaces.length ? selectedFaces.map((faceId) => cubeFaces[faceId].label).join(" · ") : "없음"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:justify-end">
          {missions.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeMission(index)}
              className={`h-9 w-9 rounded-xl text-xs font-black ${activeMissionIndex === index ? "bg-slate-950 text-white" : "bg-white text-slate-700 ring-1 ring-amber-200"}`}
            >
              {index + 1}
            </button>
          ))}
          <button type="button" onClick={onReset} className="rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-700 ring-1 ring-amber-200">
            초기화
          </button>
          <button
            type="button"
            onClick={() => onCheck(isMissionCorrect(activeMissionIndex, selectedFaces) ? "correct" : "wrong")}
            className="rounded-xl bg-amber-400 px-3 py-2 text-xs font-black text-slate-950"
          >
            정답 확인
          </button>
        </div>
      </div>
      {result && (
        <p className={`mt-3 rounded-2xl p-3 text-sm font-black ${result === "correct" ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900"}`}>
          {getMissionFeedback(activeMissionIndex, selectedFaces)}
        </p>
      )}
    </section>
  );
}
