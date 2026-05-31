# Summit 리서치 findings

모드: implementation
상태: 완료

## 수요 판단

- 한국은 인터넷/모바일 연결성이 매우 높은 시장이다. Digital in Asia의 2026 한국 디지털 시장 개요는 5,040만 인터넷 사용자와 인구 대비 97.4% 수준의 인터넷 사용을 언급한다.
- 한국 디지털 시장은 콘텐츠 기반 발견과 영상/라이브/커머스가 강하다. 같은 자료는 콘텐츠 생태계와 영상 광고 비중, 콘텐츠 주도 발견 흐름을 주요 특징으로 본다.
- GWI는 젊은 세대가 소셜을 친구 업데이트보다 엔터테인먼트 콘텐츠 허브로 쓰는 경향이 강하고, Gen Z에서 사진 공유도 중요한 동기라고 설명한다.
- Pew의 2025 미국 청소년 조사도 YouTube, TikTok, Instagram 같은 시각/영상 플랫폼 사용과 AI 챗봇 사용이 이미 일상화되고 있음을 보여준다. 한국 자료는 아니지만 "AI 보조 콘텐츠 제작"의 대중 수용성을 보는 보조 근거로만 사용한다.

판단: 밈찍의 `셀카/캐릭터 이미지 -> 바로 공유 가능한 밈 포맷`은 수요 가설이 충분하다. 특히 중계샷, 좌석표, 리액션 시트처럼 댓글을 부르는 결과물은 소셜 공유 동기와 맞다.

## 밈 활용 적절성

- Ipsos는 유머/밈 마케팅에서 engagement 잠재력과 동시에 tone, do/don't, 문화적 맥락 민감성을 강조한다.
- 밈찍은 실제 유행 밈/브랜드/방송사/유명인 모방보다 자기풍자와 공감형 일상 상황을 쓰는 쪽이 안전하다.
- 현재 제품 프리셋은 야근, 야구장, 뉴스 속보, 레드카펫, F1 피트월, 장거리 비행 좌석표, 시험장, 퇴근길처럼 일상/상황형 포맷으로 구성되어 있어 B안에 가깝다.
- 위험한 C안, 즉 실제 방송사/스포츠 리그/회사 로고, 유명인, 저작권 캐릭터, 타인 얼굴 모방은 프롬프트와 UI 안내에서 금지해야 한다.

판단: 밈 활용은 적절하다. 단, "사용자 본인 또는 권리 있는 이미지", "가상 라벨만 사용", "조롱이 아니라 자기풍자", "custom caption은 자막으로만 취급"을 계속 유지해야 한다.

## OpenAI API findings

- OpenAI 공식 Image API 가이드는 GPT Image 모델로 generation/edit endpoint를 제공한다고 설명한다.
- 같은 문서는 `n`으로 여러 이미지를 한 요청에서 생성할 수 있고, GPT Image 모델에서 base64 이미지 데이터를 받을 수 있으며, quality/size/format/customization을 지원한다고 설명한다.
- 공식 문서 본문은 GPT Image 모델 목록에 `gpt-image-2`, `gpt-image-1.5`, `gpt-image-1`, `gpt-image-1-mini`를 포함한다.

## Repo findings

- target repo는 GitHub remote `https://github.com/summit1123/memezzic.git`의 `feature/memecast-mvp` branch다.
- Next.js App Router + TypeScript + OpenAI Node SDK 기반이다.
- 기존 `nnnnnrrrrrin` 작업공간에서 필요한 OpenAI env만 가져왔다: `OPENAI_API_KEY`, `OPENAI_IMAGE_MODEL`, `NEXT_PUBLIC_APP_URL`. 값은 출력하지 않았다.
- `.env`는 `.gitignore`에 의해 제외된다.
- 이번 보강으로 `single_poster` 추천 모드를 실제 생성 모드에 연결하고, 클라이언트 업로드 validation과 자막 제한 안내를 추가했다.

## 기각한 방향

- 자극적/트렌드 직접 차용형 밈: 단기 조회수는 기대할 수 있지만 피로도와 논란 리스크가 높다.
- 실제 방송사/브랜드/유명인/저작권 캐릭터 패러디 강화: 법적/평판 리스크가 커서 MVP 범위에서 제외한다.
- 얼굴 이미지 저장/히스토리 제공: MVP에서는 개인정보/보관 정책 부담이 커서 제외한다.

## Carry-forward risks

- 실제 이미지 생성은 계정 권한, 조직 인증, 모델 접근권한, 비용, latency에 영향을 받는다.
- GPT Image는 텍스트 렌더링과 2x2/4x4 정밀 레이아웃에서 가끔 실패할 수 있다. 그래서 컷 분리 계약, mock fallback, 다운로드 가능한 원본/컷함을 유지한다.
- 밈 트렌드는 빨리 변하므로 프리셋은 관리자/코드 config로 쉽게 교체 가능해야 한다.

## Sources

- GWI, Reasons for Using Social Media by Generation: https://www.gwi.com/blog/reasons-for-social-media
- DataReportal, Digital 2026 Country Headlines Report: https://datareportal.com/reports/digital-2026-local-country-headlines
- Digital in Asia, South Korea Digital Market Overview 2026: https://digitalinasia.com/south-korea-digital-market-overview-2026/
- Ipsos, The Power of Humor and Memes in Marketing: https://www.ipsos.com/en-us/arf-power-humor-and-memes-marketing
- Pew Research Center, Teens, Social Media and AI Chatbots 2025: https://www.pewresearch.org/internet/2025/12/09/teens-social-media-and-ai-chatbots-2025/
- OpenAI, Image generation guide: https://developers.openai.com/api/docs/guides/image-generation
