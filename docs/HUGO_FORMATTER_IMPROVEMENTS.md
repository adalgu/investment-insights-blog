# Hugo Formatter 개선 요청사항

## 📋 개요

`gemini-cli-git` 저장소의 `hugo_formatter` 에이전트가 생성하는 포스트에서 발견된 YAML frontmatter 오류 패턴과 개선 요청사항을 정리합니다.

---

## 🚨 발견된 문제점

### 2026-01-03 배포 시 삭제된 파일 목록

| 파일명 | 오류 유형 |
|--------|----------|
| `2025-12-08-18-market-insight.md` | 중복 title 키 |
| `2025-12-09-02-market-insight.md` | escape 문자 오류 (`\:`) |
| `2025-12-13-05-market-insight.md` | 중복 title 키 |
| `2025-12-20-06-market-insight.md` | YAML 구문 오류 |
| `2025-12-20-15-market-insight.md` | YAML 구문 오류 |
| `2025-12-23-15-market-insight.md` | YAML 구문 오류 |
| `2025-12-24-10-market-insight.md` | YAML 구문 오류 |
| `2025-12-25-05-market-insight.md` | YAML 구문 오류 |
| `2025-12-25-11-market-insight.md` | 중복 title 키 |
| `2025-12-30-22-market-insight.md` | YAML 구문 오류 |

총 **11개** 파일 삭제 (217개 중 206개 유효)

---

## 🔧 개선 요청사항

### 1. description 필드 처리

**현재 문제:**
```yaml
description: 첫 번째 줄의 설명입니다. 이 설명은 매우 길어서
두 번째 줄로 넘어갑니다.
```

**요청 사항:**
```yaml
description: "첫 번째 줄의 설명입니다. 이 설명은 매우 길어서 두 번째 줄로 넘어갑니다."
```

- 항상 따옴표(`"`)로 감싸기
- 줄바꿈 없이 한 줄로 작성
- 150자 이상 시 요약 버전 사용

---

### 2. author 블록 구조

**현재 문제:**
```yaml
author:
name: Synthesis Expert
title: Senior Investment Columnist  # ← 최상위 title과 충돌
```

**요청 사항:**
```yaml
author:
  name: "Synthesis Expert"
  role: "Senior Investment Columnist"  # title 대신 role 사용
```

- 2칸 들여쓰기 필수
- `title` 키 대신 `role` 또는 `authorTitle` 사용

---

### 3. 특수문자 처리

**현재 문제:**
```yaml
subtitle: "제목\: 부제목"  # escape 문자 오류
```

**요청 사항:**
```yaml
subtitle: "제목: 부제목"  # 따옴표 내에서는 escape 불필요
```

- YAML 문자열이 따옴표로 감싸진 경우 콜론(`:`) escape 불필요
- 백슬래시(`\`) 사용 금지

---

### 4. 중첩 구조 들여쓰기

**현재 문제:**
```yaml
cover:
image: /path/to/image.jpg  # 들여쓰기 없음
alt: 이미지 설명
```

**요청 사항:**
```yaml
cover:
  image: "/path/to/image.jpg"
  alt: "이미지 설명"
```

- 모든 중첩 필드에 2칸 들여쓰기 적용
- `cover`, `socialShare`, `author` 등 모든 객체 타입에 적용

---

## ✅ 권장 Frontmatter 템플릿

```yaml
---
title: "포스트 제목"
date: 2025-12-07T13:00:00+09:00
lastmod: 2025-12-07T13:00:00+09:00
draft: false
slug: "url-friendly-slug"
description: "150자 이내의 간결한 설명. 줄바꿈 없이 한 줄로 작성."
categories:
  - "카테고리1"
tags:
  - "태그1"
  - "태그2"
author:
  name: "Synthesis Expert"
  role: "Senior Investment Columnist"
---
```

---

## 📁 관련 파일

- **프롬프트 위치**: `gemini-cli-git/memory/skills/hugo_formatter/knowledge/GUIDELINES.md`
- **출력 위치**: `gemini-cli-git/memory/skills/hugo_formatter/output/`

---

## 🔄 적용 방법

1. `GUIDELINES.md` 프롬프트 수정
2. Prompt Tuning PR 생성 및 머지
3. 다음 blog-pipeline 실행 시 개선된 포맷 적용 확인
