# Summit 인테이크 승인

모드: implementation
상태: 승인
승인: 예
승인자: user
승인 시각: 2026-05-26 Asia/Seoul

## 확정 목표

- MemeCast MVP를 실제 작동하는 Apple-like premium 웹앱으로 구현한다.

## 확정 산출물

- `feature/memecast-mvp` branch.
- Next.js + TypeScript 기반 MVP.
- 셀카/캐릭터 사진 업로드.
- 밈 시나리오 선택.
- 톤 선택.
- OpenAI Image API 기반 이미지 생성.
- mock mode fallback.
- 결과 이미지 다운로드, 프롬프트 복사, 다시 만들기.
- README, `.env.example`, 안전/개인정보 안내.
- 단계별 작은 커밋과 검증 결과.

## 확정 제외 범위

- 프로덕션 배포 자동화.
- 계정, 결제, DB 히스토리 저장.
- 긴 트렌드 리서치.
- 실제 방송사/브랜드/Apple/유명인/저작권 캐릭터를 직접 모방하는 기능.

## COMPLETE 전 필수 증거

- 로컬 실행 가능.
- `upload -> preset -> generate real or mock -> result -> download/copy prompt` smoke evidence.
- lint/typecheck/build 또는 가능한 검증 명령 결과.
- 실제 OpenAI API 호출 성공 여부 또는 실패 사유.
- mock mode 동작 확인.
- `.env`와 `OPENAI_API_KEY` 미노출/미커밋 확인.
- branch name, commit list, 변경 파일 요약, known limitations, 다음 개선 제안.
