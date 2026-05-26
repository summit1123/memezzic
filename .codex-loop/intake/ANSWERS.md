# Summit 인테이크 답변

모드: implementation
상태: 승인

## 확정 목표 한 줄

- MemeCast MVP를 Apple-like premium 디자인의 Next.js + TypeScript 웹앱으로 구현하고, OpenAI Image API real mode와 mock fallback까지 검증한다.

## 질문 기록

### 무엇을 만들 것인가?

- GitHub repo `https://github.com/summit1123/memezzic.git`에서 feature branch로 작업한다.
- 셀카/캐릭터 사진 업로드, 밈 시나리오 선택, 톤 선택, OpenAI Image API 기반 이미지 생성, mock mode fallback, 결과 다운로드/프롬프트 복사/다시 만들기를 포함한다.

### 어디서 멈출 것인가?

- MVP가 로컬에서 실행되고 `upload -> preset -> generate real or mock -> result -> download/copy prompt` 흐름이 동작할 때 멈춘다.
- lint/typecheck/build를 실행하고 가능한 실패를 수정한다.
- feature branch에 단계별 작은 커밋이 남아 있어야 한다.
- GitHub push가 가능하면 branch push까지 완료한다.

### 디자인은 어떤 방향인가?

- Apple-like premium design template.
- clean white/black UI, spacious layout, refined typography, subtle glass, product-first interaction.
- Apple 로고/브랜드/상표는 직접 사용하지 않는다.
- 밈앱의 재미는 마이크로카피와 생성 결과물에서 살리고, UI는 고급스럽고 미니멀하게 만든다.

### 리서치는 어느 정도 필요한가?

- 별도 긴 트렌드 리서치는 필요 없다.
- 이미 작성된 `GOAL_MEMECAST_MVP.md`를 기준으로 구현한다.
- 필요한 경우 OpenAI Image API 사용법만 공식 문서 기준으로 확인한다.

### 승인 방식은 무엇인가?

- 사용자가 현재 방향을 승인했다.
- 큰 제품 방향 변경이 필요할 때만 질문한다.
- 일반적인 구현 결정은 Codex/Ralph가 합리적으로 판단해서 진행한다.
