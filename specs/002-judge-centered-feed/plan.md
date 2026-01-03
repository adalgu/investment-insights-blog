# Implementation Plan: 발제 중심 홈 피드 재정렬

**Branch**: `002-judge-centered-feed` | **Date**: 2026-01-03 | **Spec**: `specs/002-judge-centered-feed/spec.md`
**Input**: Feature specification from `/specs/002-judge-centered-feed/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.claude/commands/speckit.plan.md` for the execution workflow.

## Summary

홈 피드를 발제(심사자) 포스트 중심으로 재정렬하고, 동일 `match_id`로 연결된 흑/백 포스트를 하위 좌우 카드로 배치한다. 홈에서만 그룹 레이아웃을 적용하고, 태그/카테고리/아카이브 리스트는 기존 리스트를 유지한다. 누락된 흑/백 포스트는 빈 슬롯 카드로 표시해 레이아웃 붕괴를 방지한다.

## Technical Context

**Language/Version**: Hugo 0.128.0 (Go templates) + CSS  
**Primary Dependencies**: PaperMod theme, Hugo assets pipeline  
**Storage**: Markdown files in `content/posts/`  
**Testing**: Manual: `hugo --minify`, `hugo server -D`  
**Target Platform**: Vercel static hosting  
**Project Type**: web (static site)  
**Performance Goals**: No horizontal overflow on <=768px; preserve existing animation timing  
**Constraints**: Home list grouped by judge; use PaperMod variables; avoid theme internals  
**Scale/Scope**: 200+ posts, paginated home feed

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Gate 1: Sync-first content source: any `content/posts/` edits are
  emergency-only with an upstream fix plan.
- Gate 2: Hugo build integrity: `hugo --minify` passes without errors.
- Gate 3: Theme compatibility: PaperMod variables respected and responsive
  check at <=768px passes.
- Gate 4: Pipeline stability: changes to `hugo.toml`, `vercel.json`, or theme
  submodules are documented and validated.
- Gate 5: Spec-driven workflow: spec/plan/tasks exist for non-trivial changes.

## Project Structure

### Documentation (this feature)

```text
specs/002-judge-centered-feed/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md
```

### Source Code (repository root)

```text
layouts/
├── _default/list.html
└── _default/single.html

assets/css/culinary-class-wars.css
content/posts/
```

**Structure Decision**: Hugo theme override files under `layouts/` and
`assets/` handle the home feed layout; no backend code paths.

## Complexity Tracking

No constitution gate violations.
