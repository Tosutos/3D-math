import type { Mission } from "@/types/geometry";

export const missions: Mission[] = [
  {
    id: "visible-faces",
    title: "미션 1. 보이는 면 찾기",
    prompt: "겨냥도에서 보이는 면을 모두 선택하세요.",
    answer: ["front", "right", "top"],
    allowMultiple: true,
  },
  {
    id: "opposite-front",
    title: "미션 2. 마주 보는 면 찾기",
    prompt: "기준 옆면과 평행한 면을 전개도에서 선택하세요.",
    answer: ["back"],
    allowMultiple: false,
  },
  {
    id: "hidden-edge-related",
    title: "미션 3. 숨은 부분 생각하기",
    prompt: "기본 겨냥도에서 보이지 않는 면 중 하나를 선택하세요.",
    answer: ["back", "left", "bottom"],
    allowMultiple: false,
  },
  {
    id: "top-adjacent",
    title: "미션 4. 접었을 때 만나는 면 찾기",
    prompt: "전개도를 접었을 때 윗면과 만나는 면을 모두 고르세요.",
    answer: ["front", "back", "left", "right"],
    allowMultiple: true,
  },
  {
    id: "hidden-faces",
    title: "미션 5. 겨냥도와 전개도 연결하기",
    prompt: "겨냥도에서 보이지 않는 면을 전개도에서 모두 찾아보세요.",
    answer: ["back", "left", "bottom"],
    allowMultiple: true,
  },
];
