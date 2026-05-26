# Summit 워크플로우 온보딩

프로필: build-direct
프로필-라벨: 즉시 개발
목표: MemeCast MVP를 실제 작동하는 Apple-like premium 웹앱으로 구현한다.
상태: 승인

이 문서는 `ralph start` 이후 사용자가 승인한 상위 온보딩 결정입니다.

## 공통 질문

### C1. 이번 런에서 지금 사용자가 하고 싶은 일은 무엇입니까?
답변:
- MemeCast / "나 지금 잡혔다" MVP를 실제 동작하는 웹앱으로 만든다.
- 사용자는 이미 아이디어를 확정했으며, 큰 아이데이션 없이 짧은 Product/UX, Frontend, Backend/API, Prompt/Image, QA/Safety 검토 후 바로 구현하길 원한다.

### C2. 이번 런은 어디까지 진행하면 된다고 보십니까? 즉, 이번에 멈출 지점은 어디입니까?
답변:
- MVP가 로컬에서 실행된다.
- `upload -> preset -> generate real or mock -> result -> download/copy prompt` 흐름이 동작한다.
- lint/typecheck/build를 실행하고 가능한 실패를 수정한다.
- feature branch에 단계별 작은 커밋이 남아 있다.
- GitHub push가 가능하면 branch push까지 완료한다.

### C3. 이번 런의 최종 산출물은 무엇입니까?
답변:
- GitHub repo `https://github.com/summit1123/memezzic.git`에서 feature branch로 작업한 Next.js + TypeScript MVP.
- 셀카/캐릭터 사진 업로드.
- 밈 시나리오 선택.
- 톤 선택.
- OpenAI Image API 기반 이미지 생성.
- mock mode fallback.
- 결과 이미지 다운로드, 프롬프트 복사, 다시 만들기.
- README, `.env.example`, 안전/개인정보 안내.
- 단계별 작은 커밋.

### C4. 이번 런에서 반드시 honest COMPLETE라고 부를 수 있는 기준은 무엇입니까?
답변:
- 앱이 로컬에서 실행되고 핵심 생성 플로우가 동작한다.
- 실제 OpenAI API 호출을 `.env`의 `OPENAI_API_KEY`로 시도하고 성공 여부 또는 실패 사유를 기록한다.
- OpenAI 호출이 실패하더라도 mock mode fallback은 동작한다.
- lint/typecheck/build 또는 repo에서 가능한 검증 명령의 결과가 남아 있다.
- `.env`와 API key는 절대 커밋되거나 출력되지 않는다.
- feature branch, 커밋 목록, 변경 파일 요약, 실행 명령과 결과, known limitations, 다음 개선 제안이 최종 보고에 포함된다.

### C5. 이미 가지고 있는 입력 자료는 무엇입니까?
답변:
- `GOAL_MEMECAST_MVP.md`: 제품 목표, 기능 범위, API 요구사항, 프롬프트 빌더, 안전 요구사항, 검증 기준.
- `.env`: 로컬 `OPENAI_API_KEY` 포함. 커밋 금지.
- GitHub repo: `https://github.com/summit1123/memezzic.git`.
- 디자인 방향: Apple-like premium design template.

### C6. 누가 승인권자입니까? 또는 누가 최종 의사결정을 합니까?
답변:
- 사용자 본인이 승인권자다.
- 이 문서의 방향은 사용자 승인 완료 상태다.
- 중간에 큰 제품 방향 변경이 필요할 때만 사용자에게 묻고, 일반적인 구현 결정은 Codex/Ralph가 합리적으로 판단해 진행한다.

## 프로필별 질문

### P1. 이번 런에서 실제로 동작해야 하는 end-to-end workflow는 무엇입니까?
답변:
- 사용자가 셀카/캐릭터 이미지를 업로드한다.
- 밈 시나리오와 톤, 생성 모드를 선택한다.
- 서버가 입력을 검증하고 OpenAI Image API 또는 mock mode로 이미지를 생성한다.
- 결과 화면에서 이미지를 확인하고 다운로드, 프롬프트 복사, 다시 만들기를 수행한다.

### P2. 반드시 통과해야 할 검증은 무엇입니까?
답변:
- 가능한 경우 install, lint, typecheck, build, 관련 테스트.
- 브라우저 또는 로컬 실행으로 핵심 플로우 smoke check.
- 실제 OpenAI API 호출 성공 여부 또는 실패 사유 확인.
- mock mode 동작 확인.
- 비밀키/`.env` 미커밋 확인.

### P3. 지금 바로 구현을 막는 외부 의존성이나 미정 규칙이 있습니까?
답변:
- `.env`에는 `OPENAI_API_KEY`가 준비되어 있다.
- 별도 긴 트렌드 리서치는 필요 없다.
- 필요한 경우 OpenAI Image API 사용법만 공식 문서 기준으로 확인한다.
- GitHub push는 로컬 인증 상태에 따라 실패할 수 있으며, 실패 시 로컬 커밋과 blocker를 보고한다.

## 확정 결정

- workflow profile은 `build-direct`로 확정한다.
- 아이디어와 제품 범위는 `GOAL_MEMECAST_MVP.md` 기준으로 확정되어 있다.
- 디자인 템플릿은 Apple-like premium으로 확정한다.
- Apple 로고, 브랜드, 상표, 실제 Apple UI 명칭을 직접 사용하지 않는다.
- 밈앱의 재미는 마이크로카피와 결과물에서 살리고, UI는 고급스럽고 미니멀하게 만든다.

## 포함 영역

- Product/UX: smallest lovable MVP, user flow, empty/result states, share loop.
- Design: Apple-like premium web app look and feel without Apple branding.
- Frontend: upload, preset/tone/mode selectors, loading, results, download/copy/make-another.
- Backend/API: server-side OpenAI image generation/editing, validation, mock fallback.
- Prompt/Image: structured Korean prompt builder and scenario/tone config.
- QA/Safety: secret handling, face upload consent, abuse prevention, lint/typecheck/build/smoke evidence.
- Docs: README, `.env.example`, safety/privacy notes.

## 제외 영역

- 배포 자동화와 프로덕션 인프라 구축.
- 결제/계정/DB 기반 히스토리 저장.
- 긴 트렌드 리서치나 별도 브랜드 전략 문서.
- 실제 방송사/브랜드/유명인/저작권 캐릭터를 직접 모방하는 기능.

## 증거 기준

- branch name과 commit list.
- 변경 파일 요약.
- 실행한 명령어와 결과.
- 실제 OpenAI API 호출 성공 여부 또는 실패 사유.
- mock mode 동작 여부.
- `.env`와 `OPENAI_API_KEY` 미노출/미커밋 확인.
- known limitations.
- 다음 개선 제안.
