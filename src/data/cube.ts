import type { FaceId, FaceRelation } from "@/types/geometry";

export const baseFaceColor = "#7dd3fc";
export const selectedFaceColor = "#38bdf8";
export const oppositeFaceColor = "#22c55e";
export const adjacentFaceColor = "#bae6fd";

export const faceColors: Record<FaceId, string> = {
  front: baseFaceColor,
  back: baseFaceColor,
  left: baseFaceColor,
  right: baseFaceColor,
  top: baseFaceColor,
  bottom: baseFaceColor,
};

export const cubeFaces: Record<FaceId, FaceRelation> = {
  front: {
    id: "front",
    label: "옆면",
    opposite: "back",
    adjacent: ["top", "bottom", "left", "right"],
    visibleInDefaultView: true,
  },
  back: {
    id: "back",
    label: "옆면",
    opposite: "front",
    adjacent: ["top", "bottom", "left", "right"],
    visibleInDefaultView: false,
  },
  left: {
    id: "left",
    label: "옆면",
    opposite: "right",
    adjacent: ["top", "bottom", "front", "back"],
    visibleInDefaultView: false,
  },
  right: {
    id: "right",
    label: "옆면",
    opposite: "left",
    adjacent: ["top", "bottom", "front", "back"],
    visibleInDefaultView: true,
  },
  top: {
    id: "top",
    label: "윗면",
    opposite: "bottom",
    adjacent: ["front", "back", "left", "right"],
    visibleInDefaultView: true,
  },
  bottom: {
    id: "bottom",
    label: "아랫면",
    opposite: "top",
    adjacent: ["front", "back", "left", "right"],
    visibleInDefaultView: false,
  },
};

export const visibleFaces: FaceId[] = Object.values(cubeFaces)
  .filter((face) => face.visibleInDefaultView)
  .map((face) => face.id);

export const hiddenFaces: FaceId[] = Object.values(cubeFaces)
  .filter((face) => !face.visibleInDefaultView)
  .map((face) => face.id);
