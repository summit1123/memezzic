# Summit 워크플로우 프로필

프로필: build-direct
프로필-라벨: 즉시 개발
기본-모드: implementation

## 이런 경우에 사용합니다
- 아이디어와 요구사항이 이미 충분히 분명하고 바로 구현에 들어가고 싶을 때
- 핵심 산출물이 동작하는 기능, 코드, 테스트, 검증일 때

## 목표 산출물
- repo 현실과 맞는 task graph
- 동작하는 기능 단위
- 검증 증거

## 단계 맵
| 단계 ID | 권장 모드 | 완료 결과 |
| --- | --- | --- |
| onboarding | implementation | 구현 목표와 evidence bar를 고정합니다. |
| technical-research | implementation | repo 범위, 제약, 연동 조건을 빠르게 파악합니다. |
| task-graph | implementation | truthful task graph를 생성합니다. |
| implementation | implementation | 실제 기능을 구축합니다. |
| verification | implementation | local checks, review, evaluator까지 마칩니다. |
