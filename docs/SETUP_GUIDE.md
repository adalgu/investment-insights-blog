# 블로그 배포 설정 가이드

이 문서는 `investment-insights-blog` 저장소와 `gemini-cli-git` 저장소 간 연동 설정 방법을 안내합니다.

## 🌐 현재 배포 상태

- **Production URL**: https://investment-insights-blog.vercel.app
- **GitHub Repository**: https://github.com/adalgu/investment-insights-blog
- **포스트 수**: 206개 (2026-01-03 기준)

## 📚 관련 문서

- [ARCHITECTURE.md](ARCHITECTURE.md) - 시스템 구성도 및 데이터 흐름
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - 문제 해결 가이드
- [HUGO_FORMATTER_IMPROVEMENTS.md](HUGO_FORMATTER_IMPROVEMENTS.md) - 소스 에이전트 개선 요청

---

## 📋 목차

1. [GitHub Personal Access Token 발급](#1-github-personal-access-token-발급)
2. [gemini-cli-git에 Secrets 설정](#2-gemini-cli-git에-secrets-설정)
3. [Vercel 연동](#3-vercel-연동)
4. [초기 동기화 실행](#4-초기-동기화-실행)
5. [문제 해결](#5-문제-해결)

---

## 1. GitHub Personal Access Token 발급

### 1.1 토큰 생성 페이지 접속

1. GitHub 로그인
2. 우측 상단 프로필 클릭 → **Settings**
3. 좌측 메뉴 최하단 **Developer settings** 클릭
4. **Personal access tokens** → **Fine-grained tokens** 클릭
5. **Generate new token** 클릭

> **직접 링크**: https://github.com/settings/tokens?type=beta

### 1.2 토큰 설정

| 항목 | 값 |
|-----|-----|
| **Token name** | `blog-deploy-token` |
| **Expiration** | 90 days (또는 원하는 기간) |
| **Resource owner** | 본인 계정 선택 |
| **Repository access** | "Only select repositories" → `investment-insights-blog` 선택 |

### 1.3 권한 설정 (Permissions)

**Repository permissions:**

| 권한 | 레벨 |
|-----|-----|
| **Contents** | Read and write |
| **Metadata** | Read-only (자동 선택됨) |

> ⚠️ 다른 권한은 필요 없습니다. 최소 권한 원칙!

### 1.4 토큰 생성 및 복사

1. **Generate token** 클릭
2. `github_pat_...` 형식의 토큰이 표시됨
3. **지금 복사해서 안전한 곳에 저장** (다시 볼 수 없음!)

---

## 2. gemini-cli-git에 Secrets 설정

### 2.1 Secret 추가

1. `gemini-cli-git` 저장소로 이동
2. **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret** 클릭

| Name | Value |
|------|-------|
| `BLOG_DEPLOY_TOKEN` | 위에서 복사한 토큰 (`github_pat_...`) |

### 2.2 Variable 추가

1. 같은 페이지에서 **Variables** 탭 클릭
2. **New repository variable** 클릭

| Name | Value |
|------|-------|
| `BLOG_DEPLOY_REPO` | `grrulssa/investment-insights-blog` |

> ⚠️ 본인 GitHub 사용자명으로 변경하세요!

---

## 3. Vercel 연동

### 3.1 Vercel 프로젝트 생성

1. [Vercel](https://vercel.com) 접속 및 로그인
2. **Add New...** → **Project** 클릭
3. **Import Git Repository** → `investment-insights-blog` 선택
4. **Import** 클릭

### 3.2 빌드 설정

| 항목 | 값 |
|-----|-----|
| **Framework Preset** | Hugo |
| **Build Command** | `hugo --minify` |
| **Output Directory** | `public` |
| **Install Command** | (비워두기) |

### 3.3 환경 변수 추가

**Environment Variables** 섹션에서:

| Key | Value |
|-----|-------|
| `HUGO_VERSION` | `0.128.0` |

### 3.4 배포

**Deploy** 클릭 → 첫 빌드 시작

---

## 4. 초기 동기화 실행

`gemini-cli-git` 저장소에서 기존 포스트 전체 동기화:

```bash
# GitHub CLI로 워크플로우 실행
gh workflow run sync-blog-deploy.yml -f force_sync=true

# 실행 확인
gh run list --workflow=sync-blog-deploy.yml --limit 1
```

---

## 5. 문제 해결

### 토큰 관련 오류

```
remote: Permission to grrulssa/investment-insights-blog.git denied
```

**해결**: 
- 토큰에 `Contents: Read and write` 권한이 있는지 확인
- 토큰이 `investment-insights-blog` 저장소에 접근 가능한지 확인

### Vercel 빌드 오류

```
Error: module "PaperMod" not found
```

**해결**:
```bash
cd investment-insights-blog
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
git add . && git commit -m "Add PaperMod theme" && git push
```

### Hugo 버전 오류

```
Error: command error: Unable to locate config file
```

**해결**: Vercel 환경 변수에 `HUGO_VERSION=0.128.0` 추가

---

## 📞 추가 지원

문제가 지속되면 `gemini-cli-git` 저장소에 Issue를 생성해 주세요.
