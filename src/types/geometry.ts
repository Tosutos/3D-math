export type FaceId = "front" | "back" | "left" | "right" | "top" | "bottom";

export type LearningMode = "explore" | "mission";

export type GeometryViewMode = "solid" | "isometric" | "net";

export type FaceRelation = {
  id: FaceId;
  label: string;
  opposite: FaceId;
  adjacent: FaceId[];
  visibleInDefaultView: boolean;
};

export type SolidState = {
  selectedFace: FaceId | null;
  highlightedEdges: string[];
  visibleFaces: FaceId[];
  hiddenFaces: FaceId[];
  mode: LearningMode;
};

export type Mission = {
  id: string;
  title: string;
  prompt: string;
  answer: FaceId[];
  allowMultiple: boolean;
};
