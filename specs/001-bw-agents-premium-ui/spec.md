# Feature Specification: 흑백에이전트 프리미엄 UI 리파인

**Created**: 2026-01-03  
**Status**: Draft  
**Input**: User description: "dev/handover/20260103-1328-handover-branding-transformation.md 를 읽고, 우리의 전체 페이지를 조금 더 개선해 주세요. 25년차 프론트엔드 개발자와 UI 디자이너가 만든 것처럼 바꿔주세요. Spec driven dev을 적극 이용해주세요."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 홈에서 콘텐츠를 빠르게 ‘스캔’한다 (Priority: P1)

방문자는 홈에서 흑/백 진영 구도를 즉시 이해하고, 카드의 정보 위계를 통해 어떤 글을 읽을지 빠르게 결정한다.

**Why this priority**: 첫 인상과 탐색 속도가 체류/전환을 좌우한다.  
**Independent Test**: 홈(`/`)에서 카드 10개를 스크롤하며 제목/요약/메타가 명확히 읽히고, 흑/백/판정(승자) 상태가 시각적으로 즉시 구분된다.

**Acceptance Scenarios**:
1. **Given** 홈에 `side` 메타가 없는 글이 섞여 있을 때, **When** 목록을 본다, **Then** 기본 카드 스타일로 일관되게 표시되고 레이아웃이 무너지지 않는다.
2. **Given** `side: Black|White` 글이 있을 때, **When** 목록을 본다, **Then** 좌/우 진영 스타일이 명확히 구분되고 모바일에서도 가독성이 유지된다.
3. **Given** `winner: "true"` 글이 있을 때, **When** 목록을 본다, **Then** “Judge’s Pick”로 강조되지만 과도한 광원/번쩍임 없이 프리미엄 톤을 유지한다.

---

### User Story 2 - 글(싱글)에서 ‘읽기 경험’을 방해 없이 몰입한다 (Priority: P1)

방문자는 긴 글을 읽는 동안 타이포그래피/여백/콜아웃이 정돈되어 피로도가 낮고, 블록/표/코드/인용이 일관되게 표현된다.

**Why this priority**: 블로그의 핵심 가치는 ‘읽기’이며, 읽기 경험 품질이 재방문을 만든다.  
**Independent Test**: 임의의 글 페이지에서 3분 이상 읽을 때, 줄길이/행간/헤딩 계층/인용/리스트가 눈에 거슬리지 않는다.

**Acceptance Scenarios**:
1. **Given** 본문에 블록인용(투자 유의사항/3줄 요약)이 존재할 때, **When** 렌더링된다, **Then** 콜아웃처럼 구분되며 대비가 충분하고 모바일에서 줄바꿈이 자연스럽다.
2. **Given** `side` 메타가 있는 글일 때, **When** 싱글 페이지를 본다, **Then** 해당 진영의 톤(배경/보더/포인트)이 과하지 않게 적용된다.

---

### User Story 3 - 헤더/내비/검색/태그에서 ‘제품 같은 완성도’를 느낀다 (Priority: P2)

방문자는 헤더가 안정적으로 고정되고, 메뉴 상태/포커스/호버가 선명하며, 검색 입력/결과/태그가 카드 톤과 일관된다.

**Why this priority**: 페이지 전반의 마감(디테일)이 “프로덕트” 인상을 만든다.  
**Independent Test**: `/search/`, `/tags/` 등 기본 페이지에서 입력/포커스/활성 상태가 명확하고 스타일이 일관된다.

**Acceptance Scenarios**:
1. **Given** 키보드로 메뉴/검색을 탐색할 때, **When** 탭 이동한다, **Then** 포커스 링이 명확히 보인다.
2. **Given** 다크/라이트 토글을 사용할 때, **When** 테마 전환한다, **Then** 커스텀 브랜딩 요소가 PaperMod 변수 체계와 충돌하지 않는다.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 시스템 MUST 홈에서 “흑백에이전트(Black & White Agents)” 브랜드를 즉시 인지할 수 있는 배경/워터마크/축(central axis) 구성을 제공한다.
- **FR-002**: 시스템 MUST `side: Black|White` 및 `winner: "true"` 메타에 따라 목록/싱글의 시각적 상태를 자동으로 표현한다.
- **FR-003**: 시스템 MUST `side` 메타가 없는 글도 기본 카드로 정상 표시한다. (현재 UI 결함 방지)
- **FR-004**: 시스템 MUST 모바일(≤768px)에서 3D/기울기 효과를 완화 또는 제거하고, 여백/타이포 스케일을 조정한다.
- **FR-005**: 시스템 MUST `prefers-reduced-motion` 사용자를 고려해 애니메이션/트랜지션을 최소화한다.
- **FR-006**: 시스템 MUST PaperMod의 CSS 변수(`--theme`, `--entry`, `--primary` 등)와 충돌 없이 커스텀 토큰을 정의한다.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 홈 목록에서 “카드 기본 스타일(비-진영 글)”이 깨지지 않고 10개 이상 연속으로 안정적으로 렌더링된다.
- **SC-002**: 모바일 뷰(≤768px)에서 수평 스크롤(overflow-x)이 발생하지 않는다.
- **SC-003**: 다크/라이트 전환 시 텍스트 대비가 충분하며(주요 텍스트/링크/버튼), 주요 브랜드 요소(골드 축/배지)가 유지된다.
- **SC-004**: `hugo --minify` 빌드가 경고/에러 없이 완료된다.

