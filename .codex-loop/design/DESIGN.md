# 디자인 계약

Preset: apple-like-premium-product
Reference-Pack: apple-like-clean-product-ui

## 이 문서의 역할

이 파일은 MemeCast MVP의 디자인 source of truth입니다. Ralph와 Codex는 구현 중 이 문서를 강한 UI 품질 게이트로 취급합니다.

## 현재 방향

- Apple-like premium design template.
- 깨끗한 white/black 중심 화면, 넓은 여백, 정제된 타이포그래피, 차분한 위계.
- subtle glass/blur, 얇은 border, 낮은 채도의 surface, 조용한 shadow를 절제해서 사용한다.
- 첫 화면은 마케팅 랜딩이 아니라 실제 생성기를 바로 사용할 수 있는 product-first interaction이어야 한다.
- 밈앱의 재미는 버튼 문구, loading copy, result copy, 생성 결과물에서 살린다.
- UI 자체는 조잡하거나 장난감처럼 보이지 않게 고급스럽고 미니멀하게 유지한다.

## 금지 브랜드/상표 규칙

- Apple 로고, Apple 제품명, 실제 Apple UI 자산, SF Symbols를 직접 복제하지 않는다.
- 실제 방송사, 스포츠 리그, 회사, 유명인, 저작권 캐릭터의 로고나 명칭을 생성하거나 UI에 사용하지 않는다.
- fake channel names만 사용한다: MEMECAST, LIVE, TODAY ME.

## 레이아웃 규칙

- 모바일에서도 upload, scenario, tone, mode, generate CTA가 자연스럽게 이어져야 한다.
- desktop에서는 넓은 여백과 선명한 primary workspace를 사용한다.
- 중첩 카드와 장식 카드 남발을 피한다.
- tool/app surface는 한 화면에서 스캔 가능해야 하며, 핵심 CTA는 항상 명확해야 한다.
- 결과 이미지는 제품의 주인공이므로 작은 썸네일만 두지 말고 충분히 크게 보여준다.

## 타이포그래피와 컬러

- 기본 텍스트는 검정/짙은 회색 중심.
- 배경은 white/off-white/soft gray 중심.
- 포인트 컬러는 한두 개만 사용하고, 밈앱의 에너지를 위해 아주 절제된 neon/lime/blue accent를 허용한다.
- 큰 hero headline보다 실제 generator controls의 가독성을 우선한다.
- letter spacing은 0을 기본으로 한다.

## 인터랙션 규칙

- 업로드 후 즉시 preview를 보여준다.
- scenario/tone/mode 선택은 segmented controls, chips, compact cards를 사용한다.
- loading state는 Apple-like polish와 Korean meme microcopy를 함께 갖는다.
- 결과 화면에는 Download, Copy prompt, Generate sticker pack, Make another one 액션이 명확해야 한다.

## 완료 전 디자인 체크

- UI가 generic AI scaffold처럼 보이면 완료하지 않는다.
- Apple-like라고 해서 Apple 브랜드를 모방하지 않는다.
- 텍스트가 mobile/desktop에서 겹치거나 버튼 밖으로 넘치면 완료하지 않는다.
- 생성 플로우가 첫 화면에서 분명하지 않으면 완료하지 않는다.
