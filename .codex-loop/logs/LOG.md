# 루프 로그

실행 이력이 여기에 누적됩니다.

## 2026-05-26

- `meme zzic / 밈찍` 브랜드명과 Apple-like premium web design 방향을 반영했다.
- Next.js App Router + TypeScript 웹앱을 구현했다.
- `POST /api/generate` 서버 API, OpenAI Image API 연결, prompt builder, validation, mock fallback을 구현했다.
- dev server에서 첫 화면 렌더링을 브라우저로 확인했다.
- 실제 OpenAI API 경로를 `.env` 키로 1회 시도했다. 서버 로그 기준 `POST /api/generate 200`으로 종료됐으나 2분 이상 걸려 클라이언트 응답 본문은 회수하지 못했다.
- development-only `x-memezzic-mock: 1` 헤더로 mock API smoke test를 수행했고 `ok=true`, `usedMock=true`, `imageCount=1`을 확인했다.
- `pnpm typecheck`, `pnpm lint`, `pnpm build`가 통과했다.
- `feature/memecast-mvp`에 구현 커밋을 남겼고 최종 push를 준비한다.

## 2026-05-31

- Git remote `origin`을 `https://github.com/summit1123/memezzic.git`로 연결하고 `feature/memecast-mvp`를 checkout했다.
- 기존 작업공간 `/Users/gimdonghyeon/Desktop/live2d/nnnnnrrrrrin`에서 필요한 OpenAI env만 `.env`에 반영했다. 값은 출력하지 않았다.
- 수요조사와 밈 활용 적절성 리서치를 `.codex-loop/research/`에 갱신했다.
- `single_poster` 추천 모드를 실제 생성 모드에 연결했다.
- 클라이언트 업로드 validation, caption 길이/용도 안내, 자기풍자형 safety copy를 보강했다.
- `pnpm lint`, `pnpm typecheck`, `pnpm build`, `python3 scripts/preflight.py run`을 통과했다.
- 강제 mock API smoke: `POST /api/generate` with `x-memezzic-mock: 1` returned `ok=true`, `mode=single_poster`, `usedMock=true`, `images=1`.
- 실제 OpenAI API smoke: `.env`의 `OPENAI_API_KEY`와 `OPENAI_IMAGE_MODEL=gpt-image-2`로 `POST /api/generate`가 `ok=true`, `usedMock=false`, `images=1`, `mimeType=image/png`를 반환했다.
- 브라우저 smoke: `http://127.0.0.1:3000`에서 desktop 1280x720과 mobile 390x844 렌더링을 확인했다.
- Ralph precomplete evaluator가 first-screen generator-first 위반을 지적해 TASK-009/010/011을 생성했다.
- TASK-009 보정 후 첫 화면을 generator-first layout으로 재정렬했다. Desktop 첫 viewport는 upload/preset/tone/mode/generate CTA를 한 화면에 보여주고, mobile 390x844에서는 landing/story 없이 upload와 recipe 흐름이 바로 이어진다.
- 최신 `pnpm lint`, `pnpm typecheck`, `pnpm build`가 다시 통과했다.
- `feature/memecast-mvp` branch를 origin에 push했다.
