# 트러블슈팅 가이드

## 🚨 알려진 이슈 및 해결 방법

### 1. YAML Frontmatter 오류

#### 증상
```
ERROR error building site: assemble: failed to create page from pageMetaSource
```

#### 원인
소스 저장소의 `hugo_formatter` 에이전트가 생성한 포스트에 유효하지 않은 YAML이 포함됨.

#### 일반적인 YAML 오류 패턴

| 오류 유형 | 예시 | 해결 방법 |
|---------|------|----------|
| 다중 라인 description | `description: 첫째줄\n둘째줄` | 따옴표로 감싸기: `description: "한 줄로"` |
| 콜론 escape 오류 | `subtitle: "제목\: 부제목"` | `\:` 대신 `:` 사용하거나 따옴표 처리 |
| 중복 키 | `title:` 이 두 번 등장 | 중복 키 제거 |
| 중첩 구조 오류 | `author:\nname: ...` (들여쓰기 없음) | 적절한 들여쓰기 추가 |

#### 문제 파일 찾기
```bash
# Hugo 빌드 오류에서 파일명 확인
hugo --minify 2>&1 | grep -E "content/posts/.*\.md"
```

#### 일괄 수정 방법
```bash
# 오류 파일 반복 제거 (응급 처치)
while hugo --minify 2>&1 | grep -q "^ERROR"; do
  file=$(hugo --minify 2>&1 | grep -oE 'content/posts/[^:\"]+\.md' | head -1)
  [ -n "$file" ] && rm -f "$file" && echo "Removed: $file"
done
```

---

### 2. Shortcode 누락 오류

#### 증상
```
ERROR: template for shortcode "callout" not found
```

#### 원인
포스트에서 사용하는 shortcode가 Hugo 테마에 없음.

#### 해결
```bash
# shortcode 템플릿 생성
mkdir -p layouts/shortcodes
# callout.html 파일 생성 (이미 포함됨)
```

#### 현재 지원 shortcode
- `callout` - 경고/정보 박스 (warning, danger, success, info)

---

### 3. Vercel 빌드 실패

#### 증상
Vercel 대시보드에서 빌드 실패

#### 체크리스트
1. **Hugo 버전 확인**
   - Vercel 환경변수: `HUGO_VERSION=0.128.0`
   
2. **테마 서브모듈 확인**
   ```bash
   git submodule status
   # themes/PaperMod 이 정상적으로 보여야 함
   ```

3. **로컬 빌드 테스트**
   ```bash
   hugo --minify
   # 오류 없이 완료되어야 함
   ```

---

### 4. 동기화 워크플로우 실패

#### 증상
`sync-blog-deploy.yml` 워크플로우 실패

#### 체크리스트

1. **토큰 권한 확인**
   - `BLOG_DEPLOY_TOKEN` 시크릿에 `Contents: Read and write` 권한 필요
   
2. **저장소 이름 확인**
   - `BLOG_DEPLOY_REPO` 변수가 정확한 형식인지 확인
   - 형식: `username/repository-name`

3. **Git 히스토리 확인**
   ```bash
   # gemini-cli-git에서
   git log --oneline -5 -- memory/skills/hugo_formatter/output/
   ```

---

### 5. 포스트가 표시되지 않음

#### 체크리스트

1. **draft 상태 확인**
   ```bash
   grep "^draft:" content/posts/*.md | grep -v "false"
   # draft: true 인 파일은 표시되지 않음
   ```

2. **날짜 확인**
   - 미래 날짜의 포스트는 기본적으로 표시되지 않음
   - `buildFuture: true` 설정 필요 시 hugo.toml 수정

3. **frontmatter 유효성**
   ```bash
   # 필수 필드 확인
   head -20 content/posts/FILENAME.md
   # title, date 필드 필수
   ```

---

## 🔧 유지보수 명령어

### 로컬 빌드 테스트
```bash
cd /Users/macmini/study/01-active/investment-insights-blog
hugo server -D  # 드래프트 포함 로컬 서버
```

### Vercel 수동 배포
```bash
vercel --prod
```

### 포스트 수 확인
```bash
ls content/posts/*.md | wc -l
```

### 빌드 캐시 정리
```bash
rm -rf public/ resources/
hugo --minify
```
