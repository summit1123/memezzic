# Summit 리서치 findings

모드: implementation
상태: 초기화됨

## 유지할 근거

- 제품 스펙은 `GOAL_MEMECAST_MVP.md`를 기준으로 한다.
- OpenAI Image API 사용법은 구현 시점에 공식 문서를 확인한다.
- 디자인은 Apple-like premium 방향이지만 Apple 로고, 상표, 제품명, 디자인 자산은 사용하지 않는다.
- `.env`와 `OPENAI_API_KEY`는 로컬 실행에만 사용하고 커밋, 출력, 클라이언트 전달을 금지한다.

## 아직 확인할 것

- target repo의 실제 앱 구조.
- 사용 가능한 package manager.
- OpenAI SDK 버전과 이미지 API 파라미터 호환성.
- 로컬 build/lint/typecheck 명령.
