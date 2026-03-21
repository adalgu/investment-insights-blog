# CLAUDE.md — Investment Insights Blog

## 프로젝트 개요

이 저장소(`adalgu/investment-insights-blog`)는 **Hugo 기반 투자 토론 블로그**의 배포 저장소다.
소스 저장소(`grrulssa/gemini-cli-git`)의 AI 파이프라인이 자동 생성한 포스트를 받아 Vercel로 배포한다.

## 저장소 관계

```
grrulssa/gemini-cli-git  (소스/파이프라인)
        │
        │  blog-pipeline.yml (3시간마다 실행)
        │  Step 6: GH_PAT로 content/posts/ 에 push
        ▼
adalgu/investment-insights-blog  (이 저장소, Hugo 콘텐츠)
        │
        │  Vercel 자동 감지 (main 브랜치 push 시 트리거)
        ▼
https://investment-insights-blog.vercel.app/
```

- **소스 저장소 로컬 경로:** `/Users/macmini/study/01-active/gemini-cli-git`
- **배포 저장소 로컬 경로:** `/Users/macmini/study/01-active/investment-insights-blog` (이 저장소)

## 기술 스택

| 항목 | 값 |
|------|----|
| 정적 사이트 생성기 | Hugo |
| 테마 | PaperMod (서브모듈: `themes/PaperMod/`) |
| 배포 | Vercel (main 브랜치 push 시 자동 트리거) |
| 빌드 커맨드 | `hugo --minify` |
| 출력 디렉토리 | `public/` |
| 언어 | 한국어(`ko-KR`), CJK 지원 활성화 |
| 사이트 제목 | "🚀 흑백에이전트: 투자 계급 전쟁" |
| 라이브 URL | `https://investment-insights-blog.vercel.app/` |

## 디렉토리 구조

```
adalgu/investment-insights-blog/
├── content/
│   └── posts/          ← 블로그 포스트 (소스 저장소에서 자동 동기화)
├── layouts/
│   ├── _default/
│   │   ├── baseof.html     ← 커스텀 베이스 레이아웃
│   │   ├── single.html     ← 포스트 개별 페이지 (흑/백 배지 로직)
│   │   └── list.html       ← 목록 페이지
│   └── partials/
│       ├── author.html
│       ├── extend_head.html
│       └── home_info.html
├── assets/css/
│   └── culinary-class-wars.css   ← 커스텀 CSS (흑백 테마)
├── themes/PaperMod/    ← git 서브모듈
├── hugo.toml           ← Hugo 사이트 설정
├── vercel.json         ← Vercel 배포 설정
└── dev/handover/       ← 세션 간 핸드오프 문서
```

## 포스트 포맷 (frontmatter)

소스 저장소 파이프라인이 생성하는 debate 포스트 기준:

```yaml
---
title: "제목 - 흑백 투자 토론"
date: 2026-02-19T15:00:00+09:00
lastmod: 2026-02-19T15:00:00+09:00
draft: false
type: "post"

author:
  name: "Black & White Agents"
  role: "AI Investment Combatants"

categories:
  - "Market Debate"
  - "Investment Strategy"
  - "시황분석"

tags:
  - "Black vs White"
  - ...

description: "..."
readingTime: 10
toc: true
comments: true
disclaimer: true
---
```

**포스트 파일명 규칙:** `YYYY-MM-DD-HH-debate.md`

**포스트 본문 구조:**
```
# 📢 오늘의 발제  ← 토론 주제
---
# 🌑 흑 에이전트 (Black Agent)
## 소제목
본문...
---
# ⚪ 백 에이전트 (White Agent)
## 소제목
본문...
```

## 배포 파이프라인 흐름

1. `grrulssa/gemini-cli-git`의 `blog-pipeline.yml`이 3시간마다 포스트 생성
2. Step 6에서 `GH_PAT` 시크릿을 사용해 이 저장소의 `content/posts/`에 push
3. Vercel이 main 브랜치 변경 감지 → `hugo --minify` 빌드 → 자동 배포

## 알려진 이슈

### 배포 중단 증상 (2026-02-19 이후)
- 최신 포스트가 2026-02-19 이후 업데이트되지 않음
- 원인 후보:
  - 소스 저장소의 self-hosted runner 오프라인
  - `GH_PAT` 시크릿 만료 또는 권한 오류
  - 파이프라인 자체 에러 (소스 저장소 Actions 로그 확인 필요)
  - Hugo frontmatter 유효성 오류로 인한 빌드 실패

### frontmatter 오류
- 최근 커밋(`356e08e`)에서 `2026-02-16-03-debate.md` frontmatter 수동 수정 이력 있음
- AI 생성 포스트에서 YAML 구문 오류 발생 가능 → Vercel 빌드 실패로 이어짐

## 트러블슈팅

### 배포 상태 확인

```bash
# 최근 Vercel 배포 확인 (GitHub Deployments API)
gh api "repos/adalgu/investment-insights-blog/deployments" --jq '.[0] | {env: .environment, created: .created_at, state: .statuses_url}'

# 소스 저장소 파이프라인 실행 상태
gh run list --repo grrulssa/gemini-cli-git --workflow=blog-pipeline.yml --limit 10
```

### 로컬 빌드 테스트

```bash
cd /Users/macmini/study/01-active/investment-insights-blog
git submodule update --init --recursive  # PaperMod 테마 초기화
hugo server -D                           # 개발 서버 (http://localhost:1313)
hugo --minify                            # 프로덕션 빌드 테스트
```

### frontmatter 오류 진단

```bash
# Hugo 빌드 시 오류 포스트 확인
hugo --minify 2>&1 | grep -i "error\|warn"

# 특정 포스트 YAML 구문 검사
hugo list all 2>&1 | grep -i "error"
```

### 소스 저장소 runner 확인

소스 저장소(`/Users/macmini/study/01-active/gemini-cli-git`)의 CLAUDE.md 참조.

```bash
# 러너 상태 확인
launchctl list | grep runner
ps aux | grep Runner.Listener

# 파이프라인 수동 실행
gh workflow run blog-pipeline.yml --repo grrulssa/gemini-cli-git
```

## 수정 시 주의사항

- **Hugo 설정 변경** → `hugo.toml` 수정 후 반드시 로컬 `hugo server`로 확인
- **레이아웃 수정** → `layouts/` 하위 파일 수정, 로컬 확인 후 main 브랜치에 push → Vercel 자동 재배포
- **포스트 포맷 변경** → 소스 저장소의 프롬프트 파일 수정 필요: `/Users/macmini/study/01-active/gemini-cli-git/memory/demands/blog_pipeline/`
- **테마 서브모듈** → `themes/PaperMod/`는 직접 수정하지 말 것. 커스터마이즈는 `layouts/`와 `assets/`에서 오버라이드
- `public/` 디렉토리는 빌드 결과물로, git에 커밋하지 않음

## 관련 문서

| 문서 | 경로 |
|------|------|
| 소스 저장소 가이드 | `/Users/macmini/study/01-active/gemini-cli-git/CLAUDE.md` |
| Hugo 블로그 설계 진단 | `dev/handover/14-hugo-blog-design-diagnosis.md` |
| 브랜딩 전환 핸드오프 | `dev/handover/20260103-1328-handover-branding-transformation.md` |
