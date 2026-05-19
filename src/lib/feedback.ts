import { cubeFaces } from "@/data/cube";
import { missions } from "@/data/missions";
import type { FaceId } from "@/types/geometry";

export function sameFaceSet(a: FaceId[], b: FaceId[]) {
  return a.length === b.length && a.every((faceId) => b.includes(faceId));
}

export function isMissionCorrect(missionIndex: number, selectedFaces: FaceId[]) {
  return sameFaceSet(selectedFaces, missions[missionIndex].answer);
}

export function getFaceFeedback(selected: FaceId, answer: FaceId): string {
  if (selected === answer) {
    return "맞아요. 선택한 면이 정답입니다.";
  }

  if (cubeFaces[answer].opposite === selected) {
    return "이 면은 정답 면과 마주 보는 면입니다.";
  }

  if (cubeFaces[answer].adjacent.includes(selected)) {
    return "이 면은 정답 면과 만나는 면입니다.";
  }

  if (cubeFaces[selected].visibleInDefaultView !== cubeFaces[answer].visibleInDefaultView) {
    return cubeFaces[selected].visibleInDefaultView
      ? "선택한 면은 겨냥도에서 보이는 면입니다. 숨은 면인지 보이는 면인지 다시 확인해 보세요."
      : "선택한 면은 겨냥도에서 보이지 않는 면입니다. 문제에서 보이는 면을 묻는지 확인해 보세요.";
  }

  return "선택한 면의 위치 관계를 다시 확인해 보세요.";
}

export function getMissionFeedback(missionIndex: number, selectedFaces: FaceId[]): string {
  const mission = missions[missionIndex];

  if (sameFaceSet(selectedFaces, mission.answer)) {
    return "맞아요! 겨냥도, 입체도형, 전개도를 잘 연결했어요.";
  }

  if (selectedFaces.length === 0) {
    return "먼저 정답이라고 생각하는 면을 선택해 보세요.";
  }

  const missing = mission.answer.filter((faceId) => !selectedFaces.includes(faceId));
  const extra = selectedFaces.filter((faceId) => !mission.answer.includes(faceId));
  const firstSelected = selectedFaces[0];
  const firstAnswer = mission.answer[0];

  if (mission.id === "visible-faces") {
    const hiddenSelected = selectedFaces.filter((faceId) => !cubeFaces[faceId].visibleInDefaultView);
    if (hiddenSelected.length > 0) {
      return `${hiddenSelected.map((faceId) => cubeFaces[faceId].label).join(", ")}은 기본 겨냥도에서 보이지 않는 면이에요. 보이는 두 옆면과 윗면을 다시 찾아보세요.`;
    }
  }

  if (mission.id === "hidden-faces" || mission.id === "hidden-edge-related") {
    const visibleSelected = selectedFaces.filter((faceId) => cubeFaces[faceId].visibleInDefaultView);
    if (visibleSelected.length > 0) {
      return `${visibleSelected.map((faceId) => cubeFaces[faceId].label).join(", ")}은 기본 겨냥도에서 보이는 면이에요. 보이지 않는 면을 찾아야 해요.`;
    }
  }

  if (mission.id === "opposite-front" && firstSelected) {
    if (cubeFaces.front.adjacent.includes(firstSelected)) {
      return "그 면은 기준 옆면과 만나는 면이에요. 평행한 면은 접었을 때 서로 만나지 않아요.";
    }
    return getFaceFeedback(firstSelected, firstAnswer);
  }

  if (mission.id === "top-adjacent") {
    const oppositeTop = selectedFaces.includes("bottom");
    if (oppositeTop) {
      return "아랫면은 윗면과 마주 보는 면이에요. 윗면과 만나는 면은 네 개의 옆면입니다.";
    }
  }

  if (extra.length > 0) {
    return `${extra.map((faceId) => cubeFaces[faceId].label).join(", ")}은 이번 문제의 정답에 포함되지 않아요. 면의 관계를 다시 확인해 보세요.`;
  }

  if (missing.length > 0) {
    return `아직 ${missing.length}개의 면이 더 필요해요. 빠진 면이 어디에 있는지 전개도와 3D 도형에서 찾아보세요.`;
  }

  return "선택한 면의 위치 관계를 다시 확인해 보세요.";
}
