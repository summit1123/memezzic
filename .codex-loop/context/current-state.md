# 작업 컨텍스트

## 프로젝트 요약
meme zzic / 밈찍은 사용자가 셀카 또는 캐릭터 사진을 업로드하고 밈 시나리오, 톤, 생성 모드를 선택하면 OpenAI Image API 또는 mock fallback으로 방송 캡처형 AI 밈 이미지와 리액션 스티커를 찍어주는 한국어 웹앱 MVP다.

## 현재 UX 계약
- `/`는 메인페이지다. 서비스 소개, 예시 이미지, 톤 설명, 생성 모드 설명, 시나리오 프리셋 설명, `/create` CTA를 제공한다.
- `/create`는 제작 페이지다. 사진 업로드, 프리셋, 톤, 생성 모드, 자막 입력, 생성 CTA를 제공한다.
- 생성 성공 후 결과는 아래 섹션으로 스크롤하지 않고 `/create?view=result` 상태의 별도 result view로 전환한다.
- 활성 팔레트는 lime/coral/black/off-white이며 blue hover/focus 계열은 쓰지 않는다.

## 현재 실행 상태
- 현재 task: TASK-012 메인페이지와 제작 페이지 분리.
- 검증: `pnpm lint`, `pnpm typecheck`, `pnpm build` PASS.
- 브라우저 smoke: `http://127.0.0.1:3009/`와 `http://127.0.0.1:3009/create` 렌더링 확인.
- mock API smoke: `/api/generate` with `x-memezzic-mock: 1` PASS.
- 로컬 서버: `http://127.0.0.1:3009`.

## 열린 태스크
- 없음. TASK-012는 구현과 검증이 완료됐다.

## 최근 진행 상황
- `src/components/memezzic-home.tsx`를 추가해 홈을 메인페이지로 재구성했다.
- `src/app/create/page.tsx`를 추가해 기존 생성기를 `/create`로 분리했다.
- `src/app/page.tsx`는 홈 컴포넌트를 렌더링한다.
- `src/components/memezzic-app.tsx`는 결과 view 전환 URL을 `/create?view=result`로 조정했다.
- `.codex-loop/tasks.json`, TASK-012, design contract, handoff, release review/eval을 최신 UX 계약에 맞췄다.
