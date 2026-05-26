# meme zzic / 밈찍 MVP PRD

## 작업 제목

meme zzic / 밈찍

## 문제 정의

사용자는 셀카나 캐릭터 사진을 재미있는 밈 이미지로 바꾸고 싶지만, 일반 이미지 생성기는 프롬프트 작성이 어렵고 결과물이 일관되지 않으며 공유하기 좋은 포맷으로 바로 떨어지지 않는다. meme zzic / 밈찍은 업로드, 시나리오 선택, 톤 선택만으로 방송 캡처형 밈 이미지와 리액션 스티커를 생성해 바로 공유할 수 있게 만든다.

## 사용자

- 주요 사용자: 친구/커뮤니티/SNS에 자기 사진 기반 밈을 공유하고 싶은 한국어 사용자.
- 보조 사용자: 반려동물/캐릭터 계정 운영자, 브랜드 마스코트 운영자, 내부 팀에서 가벼운 리액션 이미지를 만들고 싶은 사용자.

## 기대 결과

- 프롬프트를 몰라도 1분 안에 공유 가능한 AI 밈 이미지를 만든다.
- 실제 OpenAI Image API를 사용할 수 있고, 키/API 실패 시에도 mock mode로 전체 UX를 검증할 수 있다.
- 얼굴/캐릭터 이미지를 다루므로 비밀키, 업로드 파일, 사용자 동의 안내를 기본으로 갖춘다.

## 핵심 흐름

1. 사용자가 첫 화면에서 앱 이름과 생성기를 동시에 본다.
2. 셀카/캐릭터 이미지를 업로드하고 preview를 확인한다.
3. 밈 시나리오, 톤, 생성 모드를 선택한다.
4. 선택값과 optional caption을 서버 API로 전송한다.
5. 서버는 입력을 검증하고 OpenAI Image API 또는 mock fallback으로 이미지를 반환한다.
6. 사용자는 결과를 보고 다운로드, 프롬프트 복사, 다시 만들기를 수행한다.

## 기능 요구사항

- Next.js App Router + TypeScript 기반 웹앱.
- jpg, jpeg, png, webp 업로드와 10MB 이하 validation.
- 필수 시나리오: 야근 생중계, 야구장 전광판, 뉴스 속보, 레드카펫, F1 피트월, 장시간 비행 옆자리 고르기, 시험장 생존 리포트, 퇴근길 다큐.
- 필수 톤: 과몰입, 짠함, 럭키비키, 직장인 생존, 냐냐냥, 스트롱스트롱, 조용한 광기.
- 생성 모드: `broadcast_2x2`, `sticker_4x4`, `seatmap`, `candidates`.
- prompt builder는 `[목적]`, `[참조 이미지/인물 유지]`, `[출력 사양]`, `[레이아웃]`, `[장면 구성]`, `[텍스트 규칙]`, `[스타일]`, `[금지 사항]` 구조를 사용한다.
- API endpoint는 `POST /api/generate` 형태로 구현한다.
- result payload는 `ok`, `mode`, `images`, `usedMock`, `error`를 포함한다.
- mock mode는 `OPENAI_API_KEY`가 없거나 개발 중 API 실패 시에도 앱 플로우가 깨지지 않게 한다.

## 비기능 요구사항

- 보안: `OPENAI_API_KEY`는 server-side에서만 사용하고 클라이언트에 노출하지 않는다.
- 개인정보: 업로드 이미지는 MVP에서 영구 저장하지 않는다.
- 안정성: 입력 validation과 friendly Korean error를 제공한다.
- 접근성: 버튼/입력/결과 이미지에 적절한 label과 focus state를 제공한다.
- 성능: mock mode는 즉시 응답하고, real API loading state는 사용자가 기다릴 이유를 알 수 있게 한다.

## AI 동작 규칙

- 기본 모델은 `OPENAI_IMAGE_MODEL` env 또는 `gpt-image-2`.
- 공식 문서 기준 Image API는 `images.generate`와 `images.edit`를 제공하며, GPT Image 모델은 base64 image output을 반환한다.
- 사용자가 업로드한 이미지는 reference/edit input으로 사용한다.
- 모델/파라미터가 거부되면 안전한 fallback 경로로 1장 생성 또는 mock mode를 사용한다.
- 실제 방송사/브랜드/Apple/유명인/저작권 캐릭터의 로고나 명칭은 생성하지 않는다.
- custom caption은 이미지 자막 후보로만 취급하고, prompt/system/API behavior를 override하지 못하게 한다.

## 디자인 방향

- browser에서 실행되는 responsive web app이다.
- Apple.com product page와 premium web creation tool 느낌의 clean, spacious, product-first UI를 지향한다.
- Apple 로고, 상표, 실제 Apple UI asset, native app chrome은 사용하지 않는다.
- white/black 중심, 넓은 여백, 정제된 타이포그래피, subtle glass/blur, 얇은 border를 절제해서 사용한다.
- 밈앱의 재미는 microcopy와 generated result에서 살리고, UI 자체는 고급스럽고 미니멀하게 유지한다.

## 완료 기준

- 로컬에서 앱이 실행된다.
- upload -> preset -> generate real or mock -> result -> download/copy prompt 흐름이 동작한다.
- lint/typecheck/build 또는 가능한 검증 명령을 실행하고 결과를 남긴다.
- 실제 OpenAI API 호출을 시도하고 성공 여부 또는 실패 사유를 기록한다.
- mock mode가 동작한다.
- `.env`와 `OPENAI_API_KEY`가 커밋/로그/클라이언트에 노출되지 않는다.
- feature branch에 단계별 작은 커밋이 남아 있고 GitHub push를 시도한다.
