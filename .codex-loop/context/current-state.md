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
- 권장 방향: B안: 자기풍자/공감형 일상 상황 밈 생성기로 간다.
- 권장 방향: 핵심 포맷은 중계샷 4컷, 리액션 16컷, 좌석표 밈, 단일 포스터, 후보 4장으로 유지한다.
- 선택 이유: 한국어 소셜 환경은 모바일/콘텐츠 소비 밀도가 높고, 젊은 사용자는 재미/엔터테인먼트형 콘텐츠를 찾는 동기가 강하다.
- 선택 이유: 사용자가 프롬프트를 직접 쓰지 않아도 바로 공유 가능한 결과를 받는 UX가 수요 가설과 맞다.
- 단계별 실행 계획: 1단계: env 반영, OpenAI 모델 기본값과 공식 문서 정합성 확인.
- 단계별 실행 계획: 2단계: `single_poster`, 업로드 검증, caption 제한 안내, safety copy를 제품 코드에 반영.
- 리스크와 유의사항: 실제 이미지 API는 계정/모델 권한에 따라 실패할 수 있으므로 mock fallback은 제품 완성도 일부로 유지한다.
- 리스크와 유의사항: 생성 이미지의 한글 텍스트와 격자 레이아웃은 모델 한계가 있으므로 컷함/다운로드/프롬프트 복사를 보조 UX로 유지한다.

## 워크플로우 프로필
- 워크플로우 프로필: build-direct
- 워크플로우 단계: verification
- 워크플로우 모드: implementation
- Task seed 준비 여부: 예
- 워크플로우 프로필: build-direct
- 현재 단계: verification (implementation)
- 현재 단계 목표: local checks, review, evaluator까지 마칩니다.
- 워크플로우 목표: Build meme zzic / 밈찍 MVP: Apple-like Korean AI meme image web app with photo upload, OpenAI image generation, mock fallback, docs, and verified milestone commits.

## 현재 실행 상태
- 011 최종 commit/push와 재평가 (in_progress)
- 루프 반복: 0 / until-complete
- 검증: PASS (`pnpm lint`, `pnpm typecheck`, `pnpm build`, preflight, mock API smoke, real OpenAI API smoke, desktop/mobile browser smoke).
- 리뷰: PASS (`.codex-loop/reviews/release-review.md`).
- 목표 평가: 이전 evaluator는 dirty/unpushed와 first-screen generator-first 위반을 지적했다. TASK-009/010 보정은 완료했고, 남은 단계는 clean commit/push 후 재평가다.
- 훅 루프: inactive

## 열린 태스크
- [in_progress] 011 최종 commit/push와 재평가 deps=010

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
- rmcp_client is not enabled. Remote MCP flows like hosted Figma may need it.
- 로컬 `.env`에는 OpenAI image generation에 필요한 값이 반영되어 있고 실제 API smoke가 통과했다. preflight warning의 `OPENAI_API_KEY is not set` 문구는 shell process env 미주입 기준의 stale warning이다.

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
