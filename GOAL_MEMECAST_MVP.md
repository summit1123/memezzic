# GOAL_MEMECAST_MVP.md

## Mission

Build a polished MVP web app called "나 지금 잡혔다" / "MemeCast":
A fun AI image app where a user uploads one selfie or character photo, chooses a viral meme-broadcast scenario, and receives shareable "AI broadcast capture" images plus a reusable reaction sticker sheet.

The app should feel like a playful Korean viral meme tool, not a generic image generator.

Core product sentence:
"셀카 한 장으로 내 인생을 방송 중계/뉴스 속보/레드카펫/야근 생중계/비행기 옆자리 밈/리액션 이모티콘으로 만들어주는 앱."

## Operating Mode

Act as a coordinated product-engineering team.

Spawn one subagent per workstream, wait for all agents, then implement the consolidated best plan:

1. Product/UX agent
   - Define the smallest lovable MVP.
   - Check user flow, onboarding copy, empty states, result states, and share loop.
   - Prioritize viral sharing and "make another one" behavior.

2. Frontend agent
   - Build a polished responsive UI.
   - Focus on delightful interactions, preview cards, upload flow, preset selection, loading state, result grid, and download/share actions.

3. Backend/API agent
   - Implement secure server-side OpenAI image generation/editing.
   - Never expose `OPENAI_API_KEY` to the client.
   - Validate file size/type, scenario, tone, and text inputs.
   - Return generated images as base64 data URLs or saved local/public URLs depending on project conventions.

4. Prompt/Image agent
   - Design robust prompt templates for consistent multi-image outputs.
   - Preserve the user's face/character identity as much as the model allows.
   - Use structured prompt sections: purpose, identity preservation, output spec, layout, scene, text, style, constraints, negative instructions.
   - Prefer creating one strong 2x2 or 4x4 grid image when character consistency matters.
   - Also support `n=4` candidate generation when the API/model supports multiple images in one request.

5. QA/Safety agent
   - Add tests or validation scripts where practical.
   - Check lint/type/build.
   - Review the diff for secrets, unsafe file handling, prompt injection via user text, and obvious regressions.
   - Add basic content safety copy and user consent language for face/photo uploads.

Do not stop after planning. Implement the MVP unless blocked by missing dependencies or missing credentials. If blocked by `OPENAI_API_KEY`, still build everything with a mock mode and clear `.env.example` instructions.

## Tech Assumptions

Inspect the repository first.

If this is an existing app:
- Adapt to the existing framework, package manager, styling system, and conventions.
- Do not rewrite unrelated architecture.

If the repo is empty or lacks a web app:
- Create a Next.js App Router + TypeScript app.
- Use Tailwind CSS if available or install/configure it if package installation is possible.
- Prefer simple components over heavy UI libraries unless already installed.
- Use the official OpenAI Node SDK.
- Add scripts for dev, build, lint, and typecheck if not present.

## Product Scope

MVP must include:

### 1. Landing section

- App name: "나 지금 잡혔다"
- Subtitle: "셀카 한 장으로 만드는 AI 중계샷 & 리액션 밈"
- CTA: "내 중계샷 만들기"
- Short explanation: upload photo -> choose scene -> generate -> share.

### 2. Photo upload

- Accept jpg, jpeg, png, webp.
- Show image preview.
- Validate max size; use a reasonable default such as 10MB.
- Display privacy note:
  "업로드한 이미지는 결과 생성을 위해서만 사용됩니다. 운영 환경에서는 보관/삭제 정책을 명확히 설정하세요."

### 3. Meme scenario presets

Required presets:
- 야근 생중계
- 야구장 전광판
- 뉴스 속보
- 레드카펫
- F1 피트월
- 장시간 비행 옆자리 고르기
- 시험장 생존 리포트
- 퇴근길 다큐

Each preset should include:
- label
- short description
- default captions
- visual style direction
- recommended output mode: `broadcast_2x2`, `sticker_4x4`, `seatmap`, `single_poster`

### 4. Tone selector

Required tones:
- 과몰입
- 짠함
- 럭키비키
- 직장인 생존
- 냐냐냥
- 스트롱스트롱
- 조용한 광기

### 5. Optional custom caption

- User can enter one short Korean phrase.
- Sanitize and constrain it.
- Do not let user text override developer/system/API behavior.
- Treat user text only as image caption content.

### 6. Generation modes

A. Broadcast 2x2
- One generated image containing 4 panels.
- Each panel has the same person/character in a different scene expression.
- Include fake broadcast UI: LIVE, MEMECAST, subtitle bar.
- Avoid real broadcaster logos or brand logos.

B. Sticker 4x4
- One generated image containing 16 reaction stickers.
- Transparent or clean background if supported; otherwise white/light background.
- Korean short captions.
- Same character identity across all cells.

C. Candidate set
- Generate up to 4 separate image candidates in one request when supported.
- Provide graceful fallback to 1 image if the SDK/model rejects `n > 1`.

### 7. Result page/section

- Show generated image(s).
- Buttons:
  - Download PNG/WebP
  - Copy prompt
  - Generate sticker pack from this concept
  - Make another one
- Include "댓글로 다음 상황 추천받기" copy to encourage virality.

### 8. Mock mode

- If `OPENAI_API_KEY` is missing, app must still run.
- Generate mock result cards using local placeholders, gradients, or simple SVG/canvas cards.
- Clearly show "Mock mode: add OPENAI_API_KEY to generate real images."

## OpenAI Image API Requirements

Use server-side API route/server action only.

Prefer the current GPT Image model if available in docs/environment. Make the model configurable:

```env
OPENAI_IMAGE_MODEL=gpt-image-2
```

Fallback candidates in code comments/config:
- `gpt-image-1.5`
- `gpt-image-1`
- `gpt-image-1-mini`

The implementation should support:
- Image generation from text prompts.
- Image editing/reference input using the uploaded user image when available.
- Quality, size, and output format options.
- Multiple images per request through `n` when supported.
- Graceful fallback when model/API does not support a parameter.

Required environment variables:
- `OPENAI_API_KEY`
- `OPENAI_IMAGE_MODEL`
- `NEXT_PUBLIC_APP_URL` optional

Add `.env.example`.

Never log the API key.
Never send the API key to the client.
Avoid storing uploaded face images permanently in MVP unless required by the framework. If writing temp files, clean them up.

## Prompt Builder Requirements

Create a dedicated prompt builder module, for example:

```text
src/lib/prompt-builder.ts
```

It should export functions like:
- `buildBroadcastPrompt(input)`
- `buildStickerPrompt(input)`
- `buildSeatmapPrompt(input)`
- `buildPrompt(input)`

Prompt structure must be explicit:

```text
[목적]
[참조 이미지/인물 유지]
[출력 사양]
[레이아웃]
[장면 구성]
[텍스트 규칙]
[스타일]
[금지 사항]
```

Identity preservation text:
"첨부 사진 속 인물/캐릭터의 얼굴형, 눈·코·입 비율, 헤어스타일, 피부톤, 전체 인상은 최대한 유지한다. 정체성이 다른 사람처럼 바뀌면 안 된다. 표정, 포즈, 의상, 배경만 장면에 맞게 바꾼다."

Text rendering rule:
"이미지 안의 한글 텍스트는 아래 [자막]에 있는 문구만 사용한다. 임의의 긴 문장, 실제 브랜드명, 실제 방송사명, 워터마크를 추가하지 않는다. 짧고 굵은 한글 자막 스타일."

Brand/logo safety:
- Use fake brand/channel names only: MEMECAST, LIVE, TODAY ME.
- Do not generate real broadcaster logos, sports league logos, company logos, celebrity likenesses, or copyrighted character names.

Sticker 4x4 required captions:
- "퇴근?"
- "아직"
- "커피수혈"
- "해냄"
- "멘탈복구"
- "회의중"
- "읽씹아님"
- "집중모드"
- "간바레"
- "럭키비키"
- "냐냐냥"
- "강한자"
- "살아남음"
- "대기중"
- "에러남"
- "다시감"

Broadcast 2x2 default captions for 야근 생중계:
1. "퇴근 5분 전, 추가 업무 포착"
2. "오늘도 카페인 전략 성공"
3. "실시간 이슈 대응 중"
4. "그래도 난 해냄"

Seatmap preset:
Generate a funny airplane seatmap image with 6 versions of the same person/character:
1. 1A "말 안 걸면 착함"
2. 2B "간식 나눠줌"
3. 3C "럭키비키 긍정러"
4. 4D "냐냐냥 해야 대답함"
5. 5E "기내식 세 번 물어봄"
6. 6F "도착 전부터 퇴근하고 싶음"

## API Design

Create an endpoint such as:

```http
POST /api/generate
```

Input:
- `image`: uploaded file
- `scenario`: string enum
- `tone`: string enum
- `mode`: `broadcast_2x2 | sticker_4x4 | seatmap | candidates`
- `customCaption?: string`
- `count?: number`

Output:

```json
{
  "ok": true,
  "mode": "broadcast_2x2",
  "images": [
    {
      "id": "string",
      "dataUrl": "string",
      "mimeType": "image/png",
      "prompt": "string"
    }
  ],
  "usedMock": false,
  "error": "string"
}
```

Validation:
- File type allowlist.
- File size max.
- scenario allowlist.
- tone allowlist.
- mode allowlist.
- count min/max.
- customCaption length max 40 Korean chars or 80 total chars.

Error behavior:
- Client should show friendly Korean error.
- API should return safe messages, not raw secrets or full stack traces.

## Frontend UX Details

Design style:
- Fun Korean meme aesthetic.
- Clean modern SaaS layout.
- Big preview cards.
- Rounded cards, punchy headings, mobile-first.
- Use playful microcopy.

Required sections:
1. Hero
2. Upload panel
3. Scenario cards
4. Tone chips
5. Mode selector
6. Generate button
7. Loading state with rotating funny lines
8. Results grid
9. Prompt details accordion
10. Footer with safety/privacy note

Loading lines:
- "중계 카메라 찾는 중..."
- "자막팀 과몰입 중..."
- "오늘의 표정 분석 중..."
- "밈으로 쓸 수 있게 살짝 MSG 치는 중..."

Generate button states:
- Disabled until image + scenario selected.
- Loading text: "생중계 준비 중..."

Result share copy:
- "다음 중계 장소 댓글로 추천해줘"
- "내 옆자리 몇 번 고를래?"
- "다음 편 원하면 냐냐냥 입력"

## Safety, Privacy, and Abuse Prevention

Add visible user-facing copy:
- Only upload images you have the right to use.
- Do not upload someone else's face without permission.
- Do not impersonate celebrities, public figures, or private individuals without consent.
- This app creates parody/meme-style generated images.

Server-side:
- Basic input validation.
- Avoid persistent storage by default.
- Keep generated images in memory response for MVP, or use temporary files only if needed.
- Do not log uploaded image contents or base64 payloads.

Prompt-level:
- Refuse or sanitize scenarios involving sexual content, harassment, hate, political persuasion, real person impersonation, or illegal activity.
- Do not include real broadcaster/company logos.

## Deliverables

Implement the app and leave the repo in a working state.

Required files/artifacts:
- Working web app pages/components.
- Server-side image generation endpoint.
- Prompt builder module.
- Scenario/tone config module.
- `.env.example`
- README section explaining setup and commands.
- Basic tests or validation utilities where practical.
- TypeScript types for request/response.
- Mock mode for missing API key.

## Validation Commands

Before finishing, run the project's available checks. Prefer:

- package manager install if needed
- lint
- typecheck
- build
- relevant tests

Use the repo's actual package manager:
- pnpm if `pnpm-lock.yaml` exists
- npm if `package-lock.json` exists
- yarn if `yarn.lock` exists
- bun if `bun.lockb` or `bun.lock` exists

If a command fails:
- Fix the issue and rerun.
- If impossible because of environment limitations, document exactly what failed and why.

## Stop Conditions

Stop only when:
1. The app builds or the remaining blocker is clearly external, such as missing API key or unavailable network.
2. The upload -> preset -> generate/mock -> results flow works.
3. There is a clear README/.env.example explaining how to run real generation.
4. The final response includes:
   - What was built
   - Files changed
   - Commands run and results
   - Known limitations
   - Next recommended improvements

Do not stop after only creating a plan.
Do not ask for clarification unless the repo lacks enough information to proceed safely.
Make reasonable product decisions and document them.

## Recommended `/goal` Prompt

Use this after the document is in the repository root:

```text
/goal Build the MemeCast MVP described in GOAL_MEMECAST_MVP.md. First read that file and inspect the repo. Then run this as a coordinated team workflow: spawn subagents for Product/UX, Frontend, Backend/API, Prompt/Image, and QA/Safety; wait for all of them; consolidate their recommendations; implement the MVP; run lint/typecheck/build/tests where available; fix failures; and stop only when the upload -> preset -> generate/mock -> results flow works or the only blocker is external. Preserve existing repo conventions, never expose OPENAI_API_KEY, include mock mode if no key exists, and finish with a concise report of files changed, commands run, results, limitations, and next improvements.
```
