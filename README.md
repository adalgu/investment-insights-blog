# Investment Insights Blog

AI가 생성하는 글로벌 투자 인사이트 블로그

## 🚀 Quick Start

```bash
# 로컬 개발 서버
hugo server -D

# 프로덕션 빌드
hugo --minify
```

## 📁 Structure

```
.
├── archetypes/         # 포스트 템플릿
├── content/
│   └── posts/          # 블로그 포스트 (자동 동기화)
├── static/             # 정적 파일
├── themes/             # Hugo 테마
├── docs/               # 설정 가이드
├── hugo.toml           # Hugo 설정
└── vercel.json         # Vercel 설정
```

## 🔄 자동 배포

1. **소스 저장소** (`gemini-cli-git`)에서 블로그 포스트 생성
2. **Sync Workflow**가 변경된 포스트를 이 저장소로 동기화
3. **Vercel**이 main 브랜치 푸시 감지 후 자동 배포

## 📝 설정 가이드

토큰 발급 및 연동 방법은 [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md) 참조.

## 📝 License

MIT
