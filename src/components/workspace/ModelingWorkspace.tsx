"use client";

import { useState } from "react";
import { FloatingToolbar } from "@/components/workspace/FloatingToolbar";
import { InspectorPanel } from "@/components/workspace/InspectorPanel";
import { MissionBar } from "@/components/workspace/MissionBar";
import { SolidCanvas } from "@/components/views/SolidCanvas";
import { missions } from "@/data/missions";
import type { FaceId, GeometryViewMode, LearningMode } from "@/types/geometry";

export function ModelingWorkspace() {
  const [selectedFace, setSelectedFace] = useState<FaceId | null>(null);
  const [mode, setMode] = useState<LearningMode>("explore");
  const [viewMode, setViewMode] = useState<GeometryViewMode>("solid");
  const [transparentMode, setTransparentMode] = useState(false);
  const [unfoldProgress, setUnfoldProgress] = useState(0);
  const [activeMissionIndex, setActiveMissionIndex] = useState(0);
  const [missionSelections, setMissionSelections] = useState<FaceId[]>([]);
  const [missionResult, setMissionResult] = useState<"correct" | "wrong" | null>(null);

  const handleSelectFace = (faceId: FaceId) => {
    const nextSelectedFace = selectedFace === faceId ? null : faceId;
    setSelectedFace(nextSelectedFace);
    if (mode !== "mission") return;

    const mission = missions[activeMissionIndex];
    setMissionResult(null);
    setMissionSelections((current) => {
      if (!mission.allowMultiple) return nextSelectedFace ? [nextSelectedFace] : [];
      return current.includes(faceId) ? current.filter((item) => item !== faceId) : [...current, faceId];
    });
  };

  const resetSelection = () => {
    setSelectedFace(null);
    setMissionSelections([]);
    setMissionResult(null);
  };

  const changeMission = (index: number) => {
    setActiveMissionIndex(index);
    resetSelection();
  };

  const changeMode = (nextMode: LearningMode) => {
    setMode(nextMode);
    setMissionSelections([]);
    setMissionResult(null);
  };

  const changeViewMode = (nextViewMode: GeometryViewMode) => {
    setViewMode(nextViewMode);
    if (nextViewMode === "solid" || nextViewMode === "isometric") setUnfoldProgress(0);
    if (nextViewMode === "net") setUnfoldProgress(1);
  };

  return (
    <main className="relative h-screen min-h-[720px] overflow-hidden bg-sky-100 text-white">
      <div className="absolute inset-0">
        <SolidCanvas
          selectedFace={selectedFace}
          viewMode={viewMode}
          transparentMode={transparentMode}
          unfoldProgress={unfoldProgress}
          onSelectFace={handleSelectFace}
          onChangeUnfoldProgress={setUnfoldProgress}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,transparent_45%,rgba(125,211,252,0.24)_100%)]" />

      <FloatingToolbar
        mode={mode}
        viewMode={viewMode}
        transparentMode={transparentMode}
        onChangeMode={changeMode}
        onChangeViewMode={changeViewMode}
        onToggleTransparent={() => setTransparentMode((value) => !value)}
        onReset={resetSelection}
      />
      <InspectorPanel selectedFace={selectedFace} viewMode={viewMode} />
      {mode === "mission" && (
        <MissionBar
          activeMissionIndex={activeMissionIndex}
          selectedFaces={missionSelections}
          result={missionResult}
          onChangeMission={changeMission}
          onCheck={setMissionResult}
          onReset={resetSelection}
        />
      )}

      <div className="absolute left-1/2 top-4 z-10 hidden -translate-x-1/2 rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-xs font-bold text-slate-300 backdrop-blur md:block">
        {viewMode === "solid" && "입체 보기 · 드래그: 회전 · 면 클릭: 선택"}
        {viewMode === "isometric" && "겨냥도 보기 · 같은 3D 도형을 정해진 시점에서 관찰"}
        {viewMode === "unfold" && "펼치기 보기 · 파란 핸들바를 끌면 아랫면을 기준으로 바닥에 펼쳐져요"}
        {viewMode === "net" && "전개 보기 · 위/아래는 기준을 어떻게 잡는지에 따라 바뀔 수 있어요"}
      </div>
    </main>
  );
}
