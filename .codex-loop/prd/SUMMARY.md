# 프로젝트 요약

meme zzic / 밈찍은 사용자가 셀카 또는 캐릭터 사진을 업로드하고 밈 시나리오, 톤, 생성 모드를 선택하면 OpenAI Image API 또는 mock fallback으로 방송 캡처형 AI 밈 이미지와 리액션 스티커를 찍어주는 한국어 웹앱 MVP다.

가까운 목표:

- 빈 repo에 Next.js + TypeScript 웹앱을 세팅한다.
- server-side `POST /api/generate`와 prompt builder, validation, mock fallback을 구현한다.
- Apple-like premium web design 계약을 지키는 responsive generator UI를 만든다.
- 실제 OpenAI API 호출 또는 실패 사유, mock mode, local validation 증거를 남긴다.
