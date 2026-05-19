# 3D 도형 변환 실험실

초등학생이 **겨냥도–입체도형–전개도**를 연결해 정육면체의 구조를 탐구하는 웹 기반 3D 수학 학습 도구입니다.

현재 구현은 초기 README의 3분할 패널 방식이 아니라, 수정 과정에서 전환한 **풀스크린 3D 모델링 툴형 워크스페이스**입니다.

---

## 현재 앱 상태

- 프레임워크: Next.js App Router
- 언어: TypeScript
- UI: React + Tailwind CSS
- 3D 렌더링: Three.js, React Three Fiber, @react-three/drei
- 현재 도형: 정육면체
- 현재 화면: 하나의 3D 캔버스를 중심으로 툴바, 정보 패널, 미션 패널이 겹쳐지는 구조

---

## 실행 방법

```bash
npm install
npm run dev
```

기본 주소:

```txt
http://localhost:3000
```

검증 명령:

```bash
npm run lint
npm run build
```

---

## 실제 코드 구조

```txt
src/
  app/
    layout.tsx          # 한국어 metadata / root layout
    page.tsx            # ModelingWorkspace 진입점
    globals.css         # 전역 스타일

  components/
    workspace/
      ModelingWorkspace.tsx  # 앱 상태와 전체 UI 조립
      FloatingToolbar.tsx    # 좌측 도구 패널
      InspectorPanel.tsx     # 우측 선택 정보 패널
      MissionBar.tsx         # 하단 미션 패널

    views/
      SolidCanvas.tsx        # R3F Canvas, 카메라, 조명, 바닥/grid

    three/
      CubeModel.tsx          # 입체/겨냥도/전개도 모드별 면 배치
      CubeFace.tsx           # 클릭 가능한 정육면체 면
      DynamicCubeEdges.tsx   # 투명화 모드의 실선/점선 모서리

  data/
    cube.ts             # 면 관계, 색상, 보이는 면/숨은 면 데이터
    missions.ts         # 미션 5개

  lib/
    feedback.ts         # 정답 판정과 오답 피드백

  types/
    geometry.ts         # FaceId, LearningMode, GeometryViewMode 등
```

참고용 프로토타입은 `docs/prototypes/`에 따로 보관했습니다.

---

## 사용자 흐름

1. 앱을 열면 풀스크린 3D 정육면체 워크스페이스가 표시됩니다.
2. 좌측 툴바에서 보기 방식을 전환합니다.
   - `입체`: 자유 회전 가능한 정육면체
   - `겨냥도`: 정해진 시점에서 보는 입체 표현
   - `전개`: 정육면체 전개도 형태로 면을 펼친 표현
3. 정육면체의 면을 클릭하면 선택 상태가 바뀝니다.
4. 선택한 면과 관계 있는 면이 함께 강조됩니다.
   - 선택한 면: 파란색 강조
   - 마주 보는 면: 초록색 강조
   - 만나는 면: 연한 하늘색 강조
5. 우측 Inspector에서 선택한 면의 성질을 확인합니다.
6. 미션 모드에서 문제를 풀고 정답/오답 피드백을 확인합니다.

---

## 구현된 기능

### 보기 모드

- `solid`: 일반 3D 입체 보기
- `isometric`: 겨냥도에 가까운 카메라 시점
- `unfold`: 3D 장면의 아랫면 모서리 핸들바를 드래그해 아랫면을 기준으로 나머지 면이 바닥에 종이처럼 펴지는 과정 보기
- `net`: 완성된 전개도처럼 면을 펼친 보기

### 조작 기능

- 마우스/트랙패드 드래그로 회전
- 확대/축소
- 면 클릭 선택
- 선택 초기화
- 투명화 모드 ON/OFF
- 펼치기 모드에서 3D 핸들바 드래그

### 학습 기능

- 정육면체의 면 6개, 모서리 12개, 꼭짓점 8개 표시
- 선택한 면이 기본 겨냥도에서 보이는 면인지/숨은 면인지 안내
- 마주 보는 면 안내
- 만나는 면 안내
- 미션 5개 제공
- 선택 결과에 따른 진단 피드백 제공

---

## 현재 미션 목록

1. 보이는 면 찾기
2. 마주 보는 면 찾기
3. 숨은 부분 생각하기
4. 접었을 때 만나는 면 찾기
5. 겨냥도와 전개도 연결하기

미션 데이터는 `src/data/missions.ts`에서 관리합니다.

---

## 핵심 데이터 모델

```ts
type FaceId = "front" | "back" | "left" | "right" | "top" | "bottom";

type LearningMode = "explore" | "mission";

type GeometryViewMode = "solid" | "isometric" | "unfold" | "net";
```

면 관계 데이터는 `src/data/cube.ts`에 있습니다.

---

## 정리된 내용

초기 3분할 패널 구조에서 사용하던 구형 컴포넌트는 현재 워크스페이스 구조와 맞지 않아 제거했습니다.

제거된 구형 구조 예시:

- `ThreePanelLayout`
- `Header`
- `IsometricView`
- `NetView`
- `PropertyPanel`
- `MissionPanel`
- `FaceBadge`
- `ToggleButton`
- 빈 파일이었던 `CubeEdgeHandle`

현재 앱은 `ModelingWorkspace` 중심 구조만 유지합니다.

---

## 알려진 이슈 / 다음 작업 후보

### 바로 정리할 수 있는 것

- 핸들바를 HTML range가 아니라 순수 3D 오브젝트 드래그로 고도화
- 여러 모서리 중 어느 선을 자를지 선택해 서로 다른 전개도 만들기
- UI 문구를 초등학생 눈높이에 맞게 더 부드럽게 다듬기
- Inspector가 작은 화면에서도 보이도록 모바일 패널 설계
- 미션 선택 상태가 더 명확하게 보이도록 버튼/면 표시 개선

### 기능 확장 후보

- 전개도 접기 애니메이션
- 잘못된 전개도 판별 활동
- 직육면체 추가
- 면/모서리/꼭짓점 표시 토글
- 학생이 직접 설명을 입력하는 활동

### 기술 메모

- `npm run lint`와 `npm run build`는 통과합니다.
- Next 내부 PostCSS 관련 `npm audit` moderate 경고가 있습니다.
- `npm audit fix --force`는 breaking change를 유발하므로 현재는 실행하지 않습니다.
- 개발 서버 로그에 Three.js deprecation warning이 일부 뜹니다. 앱 실행을 막지는 않지만 추후 라이브러리 업데이트 시 확인이 필요합니다.

---

## 현재 목표

이 프로젝트의 현재 목표는 학생이 정육면체를 단순히 돌려보는 데 그치지 않고,

```txt
이 면은 보이는 면일까, 숨은 면일까?
이 면과 마주 보는 면은 무엇일까?
전개도에서 떨어져 있는 면이 입체도형에서는 어떻게 만날까?
겨냥도와 전개도는 같은 도형을 어떻게 다르게 보여줄까?
```

를 직접 클릭하고 비교하며 이해하도록 돕는 것입니다.
