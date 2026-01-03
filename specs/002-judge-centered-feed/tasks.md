---

description: "Task list template for feature implementation"
---

# Tasks: 발제 중심 홈 피드 재정렬

**Input**: Design documents from `/specs/002-judge-centered-feed/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are optional; use manual verification and Hugo build validation.

## Phase 1: Foundational (Feed grouping baseline)

- [ ] T001 [US1] Update `layouts/_default/list.html` to paginate by judge posts and group Black/White cards by `match_id`.
- [ ] T002 [US1] Add placeholder rendering for missing Black/White posts in `layouts/_default/list.html`.
- [ ] T003 [US1] Add judge badge + class handling in `layouts/_default/single.html` for `judge: true`.

---

## Phase 2: User Story 1 - 발제 중심 레이아웃 (Priority: P1)

**Goal**: Judge card centered with Black/White cards below left/right.

- [ ] T010 [US1] Style grouped home feed in `assets/css/culinary-class-wars.css` (grid, spacing, axis, animation).
- [ ] T011 [US1] Add placeholder card styling in `assets/css/culinary-class-wars.css`.

---

## Phase 3: User Story 2 - 연결 키 관리 (Priority: P2)

**Goal**: Editors can link posts with `match_id` and judge flag.

- [ ] T020 [US2] Update sample posts in `content/posts/` with `match_id` and `judge` for validation.

---

## Phase 4: User Story 3 - 모바일 스택 유지 (Priority: P2)

**Goal**: Judge → Black → White stack on mobile without horizontal overflow.

- [ ] T030 [US3] Add responsive ordering rules in `assets/css/culinary-class-wars.css`.

---

## Phase 5: Polish & Validation

- [ ] T040 Run `hugo --minify` and resolve build errors.
