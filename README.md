# meme zzic / 밈찍

셀카 한 장으로 방송 중계샷, 뉴스 속보, 좌석표 밈, 리액션 스티커를 찍어주는 한국어 AI 이미지 웹앱 MVP입니다.

## Setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

`.env`에는 실제 키를 넣습니다.

```env
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_IMAGE_MODEL=gpt-image-2
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`.env`는 커밋하지 않습니다.

## Commands

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

## Image Generation

- API endpoint: `POST /api/generate`
- Real mode: server-side OpenAI Image API
- Default model: `OPENAI_IMAGE_MODEL` or `gpt-image-2`
- Mock mode: if `OPENAI_API_KEY` is missing, the API returns SVG mock images.
- Development-only forced mock smoke test: send `x-memezzic-mock: 1`.

## Safety

- 본인에게 권리가 있는 이미지만 업로드하세요.
- 타인의 얼굴을 허락 없이 업로드하지 마세요.
- 유명인, 공인, 브랜드, 저작권 캐릭터를 사칭하거나 직접 모방하지 마세요.
- 이 앱은 패러디/밈 스타일의 생성 이미지를 만드는 도구입니다.
- MVP는 업로드 이미지를 영구 저장하지 않습니다.

## Design Direction

밈찍은 native app이 아니라 browser에서 실행되는 responsive web app입니다. UI는 Apple-like premium web product 감각을 참고하지만, Apple 로고/상표/제품명/실제 UI 자산은 사용하지 않습니다.
