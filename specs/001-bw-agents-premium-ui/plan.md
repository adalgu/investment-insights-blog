# Implementation Plan: 흑백에이전트 프리미엄 UI 리파인

**Date**: 2026-01-03  
**Spec**: `specs/001-bw-agents-premium-ui/spec.md`

## Summary

PaperMod(Hugo) 기반 블로그 UI를 “흑백에이전트” 브랜딩 컨셉에 맞춰 정돈한다. 핵심은 (1) 홈에서의 브랜드 인지(축/VS/진영) 강화, (2) 목록 카드의 안정성(메타 없는 글도 깨지지 않음), (3) 싱글 읽기 경험의 타이포/여백/콜아웃 리파인, (4) 헤더/검색/태그 등 주변 페이지의 일관성 확보다.

## Technical Context

**Static Site Generator**: Hugo (PaperMod theme)  
**Customizations**: `layouts/_default/list.html`, `layouts/partials/extend_head.html`, `assets/css/culinary-class-wars.css`  
**Target Platform**: Vercel (build: `hugo --minify`)  
**Constraints**: 외부 JS 프레임워크 추가 없이(기존 PaperMod 유지) CSS/템플릿 오버라이드로 해결

## Approach

1. **Base Template**: `layouts/_default/baseof.html` 오버라이드로 홈에서 body 클래스(`home`) 등 필요한 hook을 제공한다.
2. **Design Tokens**: `assets/css/culinary-class-wars.css`를 토큰/레이아웃/컴포넌트 섹션으로 재구성하고 PaperMod 변수와 안전하게 결합한다.
3. **Home Hero**: `layouts/partials/home_info.html` 오버라이드로 “Agent Pipeline(Watcher → Black → White → Judge)”를 간단한 컴포넌트로 노출한다.
4. **List Layout**: `layouts/_default/list.html`에 wrapper를 추가해 홈 리스트에서만 zig-zag/3D를 적용하고, 기본 포스트는 안정적인 카드로 표시한다.
5. **Single Page**: `layouts/_default/single.html`로 테마 파일 수정 의존을 제거하고, side/winner 배지 및 읽기 타이포를 개선한다.
6. **Verification**: `hugo --minify` 및 `hugo server`로 렌더링/레이아웃/반응형을 확인한다.

