# 작업 컨텍스트

## 프로젝트 요약
meme zzic / 밈찍은 사용자가 셀카 또는 캐릭터 사진을 업로드하고 밈 시나리오, 톤, 생성 모드를 선택하면 OpenAI Image API 또는 mock fallback으로 방송 캡처형 AI 밈 이미지와 리액션 스티커를 찍어주는 한국어 웹앱 MVP다.

가까운 목표:

- 빈 repo에 Next.js + TypeScript 웹앱을 세팅한다.
- server-side `POST /api/generate`와 prompt builder, validation, mock fallback을 구현한다.
- Apple-like premium web design 계약을 지키는 responsive generator UI를 만든다.
- 실제 OpenAI API 호출 또는 실패 사유, mock mode, local validation 증거를 남긴다.

## 운영 모드
- 현재 모드: implementation
- 품질 프로필: development
- 실제 코드베이스
- tests와 local checks
- `.codex-loop/prd/PRD.md`
- `.codex-loop/tasks.json`
- 바뀐 경로가 end-to-end로 동작합니다.

## 디자인 계약
- 현재 프리셋: apple-like-premium-product
- 현재 레퍼런스 팩: apple-like-clean-product-ui
- Preset: apple-like-premium-product
- Reference-Pack: apple-like-clean-product-ui
- Apple-like premium design template.
- 대상은 native/mobile app이 아니라 browser에서 실행되는 responsive web app이다.
- Apple.com product page와 고급 웹 기반 creation tool에서 느껴지는 clean, spacious, product-first 감각을 참고한다.

## 레퍼런스 팩
- 아직 불러온 레퍼런스 팩 안내가 없습니다.

## 인테이크 게이트
- 인테이크 모드: implementation
- 인테이크 상태: approved
- 인테이크 승인: 예
- 확정 목표: meme zzic / 밈찍 MVP를 실제 작동하는 Apple-like premium 웹앱으로 구현한다.
- 확정 산출물: `feature/memecast-mvp` branch.
- 확정 산출물: Next.js + TypeScript 기반 MVP.
- 확정 제외 범위: 프로덕션 배포 자동화.
- 확정 제외 범위: 계정, 결제, DB 히스토리 저장.
- COMPLETE 전 필수 증거: 로컬 실행 가능.
- COMPLETE 전 필수 증거: `upload -> preset -> generate real or mock -> result -> download/copy prompt` smoke evidence.

## 리서치 게이트
- 리서치 모드: implementation
- 리서치 상태: approved
- 리서치 승인: 예
- 권장 방향: 별도 긴 트렌드 리서치 없이 `GOAL_MEMECAST_MVP.md`를 기준으로 build-direct 구현을 진행한다.
- 권장 방향: 필요한 경우 OpenAI Image API 사용법만 공식 문서 기준으로 확인한다.
- 선택 이유: 사용자가 아이디어, 범위, 디자인 방향, 멈출 지점, 완료 증거 기준을 이미 승인했다.
- 선택 이유: 이번 run의 목적은 제안서가 아니라 작동하는 MVP와 검증 가능한 커밋이다.
- 단계별 실행 계획: 1단계: target repo와 Ralph workflow 상태를 정리하고 secret hygiene을 확인한다.
- 단계별 실행 계획: 2단계: repo 구조와 OpenAI Image API 사용법을 빠르게 확인해 task graph를 만든다.

## 워크플로우 프로필
- 워크플로우 프로필: build-direct
- 워크플로우 단계: implementation
- 워크플로우 모드: implementation
- Task seed 준비 여부: 예
- 워크플로우 프로필: build-direct
- 현재 단계: implementation (implementation)
- 현재 단계 목표: 실제 기능을 구축합니다.
- 워크플로우 목표: Build meme zzic / 밈찍 MVP: Apple-like Korean AI meme image web app with photo upload, OpenAI image generation, mock fallback, docs, and verified milestone commits.
- 다음 단계: verification -> local checks, review, evaluator까지 마칩니다.

## 현재 실행 상태
- 현재 `in_progress` 로 표시된 task가 없습니다.
- 루프 반복: n/a / n/a
- 검증: 아직 loop 검증이 실행되지 않았습니다.
- 리뷰: 아직 리뷰 게이트가 실행되지 않았습니다.
- 목표 평가: 아직 목표 evaluator 결과가 없습니다.
- 훅 루프: active

## 열린 태스크
- [todo] 002 웹앱 기반 세팅과 secret hygiene deps=001
- [todo] 003 제품 config, 타입, validation 구현 deps=002
- [todo] 004 구조화된 이미지 prompt builder 구현 deps=003
- [todo] 005 OpenAI image API route와 mock fallback 구현 deps=004
- [todo] 006 Apple-like premium web generator UI 구현 deps=005
- [todo] 007 문서, 검증, GitHub push 마무리 deps=006

## 누적 사실
- 아직 없습니다.

## 누적 제약
- 아직 없습니다.

## 디자인 방향 메모
- 아직 승인된 시각 방향 메모가 없습니다.

## 계약
- 아직 누적 계약 메모가 없습니다.

## 승인 자산
- 아직 승인된 자산이 등록되지 않았습니다.

## 제출 원고 게이트
- 아직 원고 리뷰가 없습니다.

## 제출 PDF 게이트
- 아직 제출 PDF 리뷰가 없습니다.

## 최근 진행 상황
- 아직 최근 loop 로그가 없습니다.

## 사전 점검 차단 항목
- 없음.

## 사전 점검 경고
- 없음.

## 열린 질문
- 없음.

## 고정 프롬프트 메모
# 고정 루프 프롬프트

당신은 데모 stub이 아니라 실제 제품 또는 실제 제출 문서를 만들고 있습니다.

모든 반복은 repo를 더 정직한 상태로 만들어야 합니다.

- 브리프가 모호하면 PRD를 먼저 선명하게 다듬습니다.
- 활성 task 상태를 정확하게 유지합니다.
- repo 상태가 바뀌면 압축 handoff를 새로 고칩니다.
- 코드, 디자인 명세, 테스트, 자산, 문서 중 하나에서 실제 진전을 만듭니다.
- 조각난 결과보다 vertical slice를 우선합니다.
- 산출물은 믿을 수 있고 근거가 있고 검토자 관점에서 설득 가능해야 합니다.

현재 운영 계약을 반드시 지키세요.

- `.codex-loop/QUALITY_BARS.md`를 읽고 활성 품질 프로필을 강한 완료 게이트로 취급합니다.
- `.codex-loop/design/DESIGN.md`를 읽고 디자인 계약을 강한 스타일/레이아웃 게이트로 취급합니다.
- `.codex-loop/design/reference-packs/` 아래 선택한 파일을 읽고 현재 시각 레퍼런스 계열로 취급합니다.
- `.codex-loop/modes/<active-mode>.md`를 읽고 그 모드의 source of truth를 따릅니다.
- 활성 품질 프로필의 MUST 항목을 모두 만족하기 전에는 완료를 선언하지 않습니다.

제안서/제출 문서 작업일 때:

- Markdown source가 source of truth입니다.
- PDF는 포장 단계일 뿐, 품질이 갑자기 생기는 장소가 아닙니다.
- 근거, 표, 비교, workflow 구조를 source에서 먼저 만듭니다.
- 장식 레이아웃으로 빈약한 사고를 가리지 않습니다.
- 실제 심사위원을 위한 문체로 씁니다.

제품에 UI가 있을 때:

- 표면 polish 전에 사용자 흐름을 먼저 정의합니다.
- spacing, hierarchy, copy를 의도적으로 유지합니다.
- reference pack과 승인된 자산을 함께 사용해 일관된 시각 시스템을 만듭니다.
- 장식 노이즈, 랜덤 카드, 빈 강조 도형을 피합니다.
- 여전히 generic하면 코드 polish보다 디자인 입력을 먼저 고칩니다.
- UI가 생기면 실행 중인 앱에서 동작을 확인합니다.

백엔드나 AI 작업이 있을 때:

- contract를 먼저 정의합니다.
- failure state를 반드시 다룹니다.
- 가정은 task spec 또는 PRD에 기록합니다.
- 중요한 business rule을 조용히 지어내지 않습니다.
