# 프로젝트 요약

meme zzic / 밈찍은 사용자가 메인페이지에서 톤, 생성 모드, 시나리오, 예시 이미지를 먼저 이해하고, 별도 제작 페이지에서 셀카 또는 캐릭터 사진을 업로드해 OpenAI Image API 또는 mock fallback으로 방송 캡처형 AI 밈 이미지와 리액션 스티커를 찍어주는 한국어 웹앱 MVP다.

가까운 목표:

- 빈 repo에 Next.js + TypeScript 웹앱을 세팅한다.
- server-side `POST /api/generate`와 prompt builder, validation, mock fallback을 구현한다.
- `/` 메인페이지는 서비스 소개, 예시, 톤/모드 설명, 시나리오 설명, `/create` CTA를 제공한다.
- `/create` 제작 페이지는 responsive generator UI와 result view를 제공한다.
- 실제 OpenAI API 호출 또는 실패 사유, mock mode, local validation 증거를 남긴다.
