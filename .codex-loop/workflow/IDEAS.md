# Summit 워크플로우 아이디어

프로필: build-direct
상태: 승인

이번 run은 아이디어 탐색이 아니라 확정된 제품을 구현하는 흐름이다.

## 후보 방향

- 선택 방향: MemeCast / "나 지금 잡혔다" AI 밈 이미지 생성 MVP.
- 보류 방향: 추가 밈앱 아이디어 탐색, 별도 커뮤니티 리서치, 대규모 플랫폼화.

## 선택한 방향

셀카 또는 캐릭터 사진 1장을 업로드하면 밈 시나리오와 톤에 맞춰 AI 중계샷, 방송 캡처형 이미지, 4x4 리액션 스티커, 좌석표 밈을 생성하는 웹앱을 만든다.

## 선택 이유

- 사용자가 아이디어를 이미 확정했다.
- `GOAL_MEMECAST_MVP.md`에 제품 스펙, 프롬프트 전략, API 요구사항, 안전 기준이 충분히 정리되어 있다.
- 현재 목적은 제안서나 추가 브레인스토밍이 아니라 작동하는 MVP와 검증 증거다.

## 디자인 방향

- Apple-like premium design template.
- 깨끗한 white/black 중심 UI, 넓은 여백, 정제된 타이포그래피, 절제된 glass/blur, product-first interaction.
- Apple 로고, 상표, 제품명, 실제 Apple 디자인 자산은 사용하지 않는다.
- 재미는 마이크로카피와 생성 결과물에서 살리고, UI는 조잡하지 않게 고급스럽고 미니멀하게 만든다.

## 목표 산출물

- repo 현실과 맞는 task graph.
- Next.js + TypeScript 기반 MemeCast MVP.
- OpenAI Image API real mode와 mock fallback.
- 안전한 `.env`/비밀키 처리.
- README, `.env.example`, 안전/개인정보 안내.
- 단계별 작은 커밋과 검증 증거.
