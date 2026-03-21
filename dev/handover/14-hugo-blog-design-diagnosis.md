# 14. Hugo 블로그 디자인 진단 핸드오프

> **목적:** `adalgu/investment-insights-blog` Hugo 블로그의 디자인 현황을 파악하고, 개선이 필요한 문제점을 진단·수정한다.
> **이어받는 작업:** 이 문서를 새 대화 세션의 시작 프롬프트로 사용한다.

---

## 1. 프로젝트 전체 구조 요약

### 저장소 관계

```
grrulssa/gemini-cli-git  (소스/파이프라인)
        │
        │  blog-pipeline.yml (3시간마다 실행)
        │  Step 6: GH_PAT로 push
        ▼
adalgu/investment-insights-blog  (Hugo 블로그 콘텐츠)
        │
        │  Vercel 자동 감지 (main 브랜치 push 시 트리거)
        ▼
https://investment-insights-blog.vercel.app/
```

### 소스 저장소 (`grrulssa/gemini-cli-git`)

- **로컬 경로:** `/Users/macmini/study/01-active/gemini-cli-git`
- **러너:** 맥미니 self-hosted (`[self-hosted, macOS, ARM64]`)
- **파이프라인:** `.github/workflows/blog-pipeline.yml`
- 5단계 AI 파이프라인으로 흑백 토론 포스트를 생성 → `memory/skills/debate_assembler/output/*.md` 에 최종 마크다운 생성
- Step 6에서 `adalgu/investment-insights-blog`의 `content/posts/`에 자동 push

---

## 2. 블로그 저장소 (`adalgu/investment-insights-blog`) 상세

### 기술 스택

| 항목 | 값 |
|------|----|
| 정적 사이트 생성기 | Hugo |
| 테마 | **PaperMod** (서브모듈) |
| 배포 | **Vercel** (자동 배포, `main` 브랜치 push 시 트리거) |
| 빌드 커맨드 | `hugo --minify` |
| 출력 디렉토리 | `public/` |
| 언어 | 한국어(`ko-KR`), CJK 지원 활성화 |
| 사이트 제목 | "🚀 흑백에이전트: 투자 계급 전쟁" |
| 라이브 URL | `https://investment-insights-blog.vercel.app/` |

### 저장소 디렉토리 구조

```
adalgu/investment-insights-blog/
├── content/
│   └── posts/          ← 311개 포스트 (자동 생성)
│       ├── 2026-03-22-00-debate.md
│       ├── 2026-03-21-22-debate.md
│       ├── 2025-12-02-06-market-insight.md  ← 구형 포맷
│       ├── test-winner.md                    ← 테스트 파일
│       ├── test-white.md
│       └── test-black.md
├── layouts/
│   ├── _default/
│   │   ├── baseof.html     ← 커스텀 베이스 레이아웃
│   │   ├── single.html     ← 포스트 개별 페이지 (흑/백 배지 로직)
│   │   └── list.html       ← 목록 페이지
│   └── partials/
│       ├── author.html
│       ├── extend_head.html
│       └── home_info.html
├── assets/
│   └── css/
│       └── culinary-class-wars.css   ← 커스텀 CSS
├── static/             ← 정적 파일
├── themes/
│   └── PaperMod/       ← 서브모듈
├── hugo.toml           ← 사이트 설정
└── vercel.json         ← Vercel 배포 설정
```

### `hugo.toml` 핵심 설정

```toml
baseURL = 'https://investment-insights-blog.vercel.app/'
languageCode = 'ko-KR'
defaultContentLanguage = 'ko'
hasCJKLanguage = true
title = '🚀 흑백에이전트: 투자 계급 전쟁'
theme = 'PaperMod'

[pagination]
  pagerSize = 10   # 311개 포스트 → 31페이지

[params]
  defaultTheme = "auto"  # 다크/라이트 자동 전환
  ShowReadingTime = true
  ShowShareButtons = true
  ShowPostNavLinks = true
  ShowBreadCrumbs = true
  ShowCodeCopyButtons = true
  ShowWordCount = true
  UseHugoToc = true

[params.homeInfoParams]
  Title = "🚀 AI 기반 투자 인사이트"
  Content = "글로벌 시장 동향을 AI가 분석하여 균형 잡힌 투자 인사이트를 제공합니다."
```

---

## 3. 포스트 구조 (frontmatter)

최신 포스트(`2026-03-22-00-debate.md`) 예시:

```yaml
---
title: "US 시장 약세 속 KOSDAQ 강세: 글로벌 불확실성 속 투자 전략 - 흑백 투자 토론"
date: 2026-03-21T15:38:03+09:00
description: "..."
categories: ["Market Debate", "Investment Strategy"]
tags: ["Black vs White", "가치 투자", "미국 시장", ...]
author:
  name: "Black & White Agents"
  role: "AI Investment Combatants"
draft: false
toc: true
comments: true
---
```

> **주의:** 현재 debate 포스트는 `side` / `winner` / `judge` 파라미터를 사용하지 않는다.
> 이 파라미터들은 `layouts/_default/single.html`에서 팀별 배지(Team Black / Team White / Judge's Pick) 렌더링에 사용되도록 설계되어 있으나, 실제 생성 포스트에는 해당 frontmatter가 없다.

### 포스트 본문 구조

```
# 📢 오늘의 발제   ← 토론 주제
---
# 🌑 흑 에이전트 (Black Agent)
## 소제목
본문...
---
# ⚪ 백 에이전트 (White Agent)
## 소제목
본문...
```

---

## 4. 커스텀 레이아웃 (`layouts/_default/single.html`)

PaperMod 기본 single.html을 확장하여 흑백 에이전트 테마에 맞는 배지 시스템을 구현하고 있다:

```html
{{- $side := .Params.side | default "" -}}
{{- $isWinner := eq .Params.winner "true" -}}
{{- $isJudge := eq .Params.judge true -}}

<!-- 배지 렌더링 -->
<div class="agent-post-badges">
  <span class="side-indicator indicator-judge">Judge</span>
  <span class="side-indicator indicator-black">Team Black</span>
  <span class="side-indicator indicator-white">Team White</span>
  <span class="side-indicator indicator-judge">Judge's Pick</span>
</div>
```

**CSS 파일:** `assets/css/culinary-class-wars.css`
(이름이 "컬리너리 클래스 워즈"로, 흑백 토론 테마에 맞춘 커스텀 스타일)

---

## 5. Vercel 배포 설정 (`vercel.json`)

```json
{
  "buildCommand": "hugo --minify",
  "outputDirectory": "public",
  "framework": "hugo",
  "headers": [
    { "source": "/(.*)", "headers": ["X-Content-Type-Options", "X-Frame-Options", "X-XSS-Protection"] },
    { "source": "/images/(.*)", "headers": ["Cache-Control: public, max-age=31536000, immutable"] }
  ]
}
```

---

## 6. 메뉴 구조

| 메뉴 | URL |
|------|-----|
| 검색 | `/search/` |
| 태그 | `/tags/` |
| 카테고리 | `/categories/` |
| 아카이브 | `/archives/` |

---

## 7. 알려진 이슈 및 진단 포인트

아래 항목들을 중심으로 진단하고 개선 방안을 도출한다.

### 7-1. 포스트 구조와 레이아웃 불일치

현재 AI 파이프라인이 생성하는 포스트(`*-debate.md`)는 **단일 파일에 흑·백 양쪽 논지를 모두 포함**하는 구조다. 그러나 `layouts/_default/single.html`은 `side`, `winner`, `judge` frontmatter 파라미터로 각 포스트가 흑 또는 백 중 하나임을 전제하고 배지를 표시하도록 설계되어 있다.
- **예상 결과:** 실제 포스트에는 배지가 하나도 표시되지 않음
- **진단 필요:** 레이아웃이 실제 포스트 구조와 맞는지 확인

### 7-2. 커스텀 CSS 적용 여부

`assets/css/culinary-class-wars.css`의 스타일이 실제로 적용되고 있는지 불분명하다.
- `extend_head.html` 파셜이 이 CSS를 제대로 로드하는지 확인 필요
- 다크모드/라이트모드 전환 시 흑백 테마 색상이 의도대로 보이는지 확인 필요

### 7-3. 포스트 수 증가에 따른 성능

현재 311개 포스트, 매 3시간마다 1개씩 증가 중.
- 빌드 시간: Vercel 빌드 로그 확인 필요
- 페이지네이션 10개 → 31페이지로 UX 저하 가능성
- Hugo 빌드 캐시 설정 최적화 필요 여부

### 7-4. 검색 기능

PaperMod의 퓨즈(Fuse.js) 기반 검색이 올바르게 동작하는지 확인 필요.
- `outputs.home = ["HTML", "RSS", "JSON"]` 설정은 있으나, `content/search/_index.md`가 존재하는지 확인 필요
- 311개 포스트의 JSON 인덱스 크기가 검색 성능에 미치는 영향

### 7-5. 포스트 파일명 규칙 혼재

```
2026-03-22-00-debate.md        ← 신형 (흑백 토론)
2025-12-02-06-market-insight.md ← 구형 (마켓 인사이트)
test-winner.md / test-black.md  ← 테스트 파일 (삭제 필요?)
```
카테고리·태그 분류 체계도 확인 필요.

### 7-6. 한국어 지원

- PaperMod 한국어 번역 파일 존재 여부
- 날짜 포맷이 한국어로 표시되는지 (예: "2026년 3월 22일")
- `hasCJKLanguage = true` 설정으로 단어 수 계산이 올바른지

### 7-7. Open Graph / SEO

AI 생성 콘텐츠의 SEO 메타데이터가 올바르게 생성되는지 확인.
- `description` frontmatter가 OG description으로 이어지는지
- 포스트별 이미지 없음 → OG 이미지 fallback 설정 여부

---

## 8. 진단 작업 진행 방법

### 접근 방법 A: 로컬 클론 후 직접 진단

```bash
# 블로그 저장소 클론
git clone https://github.com/adalgu/investment-insights-blog.git
cd investment-insights-blog
git submodule update --init --recursive  # PaperMod 테마 초기화

# Hugo 로컬 서버 실행
hugo server -D --bind 0.0.0.0

# 브라우저에서 확인
open http://localhost:1313
```

### 접근 방법 B: GitHub에서 직접 파일 조회

```bash
# 주요 파일 조회
gh api "repos/adalgu/investment-insights-blog/contents/layouts/_default/single.html" --jq '.content' | base64 -d
gh api "repos/adalgu/investment-insights-blog/contents/assets/css/culinary-class-wars.css" --jq '.content' | base64 -d
gh api "repos/adalgu/investment-insights-blog/contents/layouts/partials/extend_head.html" --jq '.content' | base64 -d

# 최신 Vercel 배포 상태
gh api "repos/adalgu/investment-insights-blog/deployments" --jq '.[0] | {env: .environment, created: .created_at}'
```

### 라이브 사이트 확인

- **사이트:** https://investment-insights-blog.vercel.app/
- **최신 포스트 확인:** 목록 첫 번째 항목이 가장 최근 생성 포스트인지 확인
- **다크모드 전환:** 헤더 토글 버튼 동작 확인
- **검색:** `/search/` 페이지에서 한국어 검색 테스트
- **아카이브:** `/archives/` 페이지에서 311개 포스트 분류 확인

---

## 9. 진단 후 수정 시 주의사항

- **블로그 저장소** (`adalgu/investment-insights-blog`)에서 작업
- 소스 저장소 (`grrulssa/gemini-cli-git`)의 파이프라인 프롬프트 파일 수정이 필요한 경우 `/Users/macmini/study/01-active/gemini-cli-git/memory/demands/blog_pipeline/` 하위 `.md` 파일 수정
- 레이아웃 수정 후 로컬 `hugo server`로 반드시 확인
- 변경사항은 `adalgu/investment-insights-blog` main 브랜치에 push → Vercel 자동 재배포

---

## 10. 관련 문서

| 문서 | 경로 |
|------|------|
| Hugo 포매터 개선 계획 | `dev/docs/10-HUGO_FORMATTER_IMPROVEMENTS.md` |
| 블로그 전체 플랜 | `dev/docs/00-blog_plan.md` |
| 시스템 아키텍처 | `dev/docs/01-system_architecture_blog.md` |
| CLAUDE.md (이 저장소 가이드) | `CLAUDE.md` (프로젝트 루트) |
