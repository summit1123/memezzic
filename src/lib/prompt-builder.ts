import { getScenario, getTone } from "./product-config";
import type { GenerateInput, ScenarioConfig, ToneConfig } from "./types";

const IDENTITY_RULE =
  "첨부 사진 속 인물/캐릭터의 얼굴형, 눈·코·입 비율, 헤어스타일, 피부톤, 전체 인상은 최대한 유지한다. 정체성이 다른 사람처럼 바뀌면 안 된다. 표정, 포즈, 의상, 배경만 장면에 맞게 바꾼다.";

const TEXT_RULE =
  "이미지 안의 한글 텍스트는 아래 [자막 후보]에서 필요한 만큼만 골라 짧게 사용한다. 임의의 긴 문장, 실제 브랜드명, 실제 방송사명, 워터마크를 추가하지 않는다.";

const SAFETY_RULES = [
  "실제 방송사 로고, 실제 회사 로고, 스포츠 리그 로고, 유명인, 저작권 캐릭터를 만들지 않는다.",
  "방송 UI가 필요하면 밈찍, meme zzic, LIVE, MEMEZZIC, TODAY ME처럼 가상의 라벨만 사용한다.",
  "성적 콘텐츠, 혐오, 괴롭힘, 정치 설득, 불법 행위 묘사는 피한다.",
  "사용자를 조롱하거나 모욕하는 방향이 아니라 자기풍자와 공감형 유머로 만든다.",
];

const VIDEO_READY_RULES = [
  "각 장면은 Seedance, Veo, Kling 같은 image-to-video 모델의 첫 프레임으로도 쓸 수 있게 구성한다.",
  "주인공 얼굴은 선명한 중간샷 또는 medium close-up으로 유지하고, 배경에는 움직일 여지를 남긴다.",
  "한 컷 안의 행동은 하나만 명확하게 만든다. 복잡한 손동작, 과도한 손가락 노출, 극단적인 표정은 피한다.",
  "관중/배경은 약한 모션블러와 방송 질감으로 처리하되, 주인공의 눈과 얼굴 윤곽은 흔들리지 않게 한다.",
];

function cutFrameContract(gridSize: 2 | 4): string[] {
  const total = gridSize * gridSize;

  return [
    `- 컷 보관 후처리를 위해 전체 이미지를 정확한 ${gridSize}행 x ${gridSize}열, 총 ${total}개의 동일한 정사각형 셀로 나눈다.`,
    "- 각 셀 사이에는 18~28px 정도의 밝은 흰색/연회색 구분선을 넣고, 바깥쪽에도 같은 두께의 안전 여백을 둔다.",
    "- 인물의 얼굴, 손, 자막, 중요한 소품은 셀 경계선에서 최소 8% 이상 안쪽에 배치한다.",
    "- 셀마다 장면은 달라도 카메라 거리, 인물 크기, 얼굴 방향, 조명 밀도는 비슷하게 유지한다.",
    "- 프레임 경계가 비스듬하거나 겹치거나 만화 말풍선처럼 셀을 침범하면 안 된다.",
  ];
}

const STICKER_CAPTIONS = [
  "퇴근?",
  "아직",
  "커피필요",
  "해냄",
  "멘탈복구",
  "회의중",
  "답장중",
  "집중",
  "좋았어",
  "럭키",
  "냐냥",
  "버팀",
  "살아남음",
  "대기",
  "오류",
  "다시감",
];

const SEATMAP_CAPTIONS = [
  '1A "말 걸면 대답은 함"',
  '2B "간식 나눠주는 타입"',
  '3C "잠들면 조용함"',
  '4D "긍정 회로 풀가동"',
  '5E "기내식에 진심"',
  '6F "도착 전부터 퇴근"',
];

type PromptContext = Required<GenerateInput> & {
  scenarioConfig: ScenarioConfig;
  toneConfig: ToneConfig;
};

export function buildPrompt(input: GenerateInput): string {
  const scenarioConfig = getScenario(input.scenario);
  const toneConfig = getTone(input.tone);

  if (!scenarioConfig || !toneConfig) {
    throw new Error("Invalid prompt input");
  }

  const context: PromptContext = {
    scenario: input.scenario,
    tone: input.tone,
    mode: input.mode,
    customCaption: input.customCaption ?? "",
    count: input.count ?? 1,
    scenarioConfig,
    toneConfig,
  };

  if (context.mode === "sticker_4x4") {
    return buildStickerPrompt(context);
  }

  if (context.mode === "seatmap") {
    return buildSeatmapPrompt(context);
  }

  return buildBroadcastPrompt(context);
}

export function buildBroadcastPrompt(context: PromptContext): string {
  const captions = captionsForMode(context);

  return [
    "[목적]",
    `첨부 사진 속 인물/캐릭터를 기반으로, [${context.scenarioConfig.label}] 상황의 한국 SNS 밈 이미지를 만든다.`,
    "",
    "[참조 이미지/인물 유지]",
    IDENTITY_RULE,
    "",
    "[출력 사양]",
    context.mode === "candidates"
      ? "- 1:1 정사각형 후보 이미지. 각 후보는 단일 장면의 팬캠 첫 프레임처럼 만든다."
      : context.mode === "single_poster"
        ? "- 1:1 정사각형 단일 포스터 이미지. 한 장면을 뉴스 속보/팬캠 대표 컷처럼 강하게 만든다."
        : "- 1:1 정사각형 이미지. 한 장 안에 2행x2열, 총 4컷을 배치한다.",
    "- 모든 컷은 같은 인물/캐릭터 정체성을 유지한다.",
    "- 살짝 압축된 중계 화면 질감, candid framing, mild video softness를 살린다.",
    "- 결과물은 선명해야 하지만 쇼핑몰 상세페이지나 앱 UI mockup처럼 보이면 안 된다.",
    ...(context.mode === "broadcast_2x2" ? ["", "[컷 분리 계약]", ...cutFrameContract(2)] : []),
    "",
    "[레이아웃]",
    ...layoutRulesForMode(context),
    "",
    "[장면 구성]",
    `- 시나리오: ${context.scenarioConfig.label}`,
    `- 장면 설명: ${context.scenarioConfig.description}`,
    `- 시각 방향: ${context.scenarioConfig.visualStyle}`,
    `- 톤: ${context.toneConfig.label} (${context.toneConfig.direction})`,
    "",
    "[자막 후보]",
    ...captions.map((caption, index) => `${index + 1}. "${caption}"`),
    "",
    "[텍스트 규칙]",
    TEXT_RULE,
    "",
    "[스타일]",
    "- 한국 예능 캡처, 팬캠 썸네일, 뉴스 패러디 밈처럼 즉시 이해되는 화면.",
    "- 과한 영화 포스터, 제품 광고, 앱 화면, 랜딩페이지 느낌은 피한다.",
    "- 색상은 검정, 흰색, 짙은 회색 중심에 작은 라임 포인트.",
    "",
    "[영상화 친화 조건]",
    ...VIDEO_READY_RULES.map((rule) => `- ${rule}`),
    "",
    "[금지 사항]",
    ...SAFETY_RULES.map((rule) => `- ${rule}`),
  ].join("\n");
}

export function buildStickerPrompt(context: PromptContext): string {
  const captions = context.customCaption
    ? [context.customCaption, ...STICKER_CAPTIONS.slice(1)]
    : STICKER_CAPTIONS;

  return [
    "[목적]",
    "첨부 사진 속 인물/캐릭터를 meme zzic / 밈찍 리액션 이모티콘 시트로 만든다.",
    "",
    "[참조 이미지/인물 유지]",
    IDENTITY_RULE,
    "",
    "[출력 사양]",
    "- 1:1 정사각형 이미지.",
    "- 4행x4열, 총 16칸의 리액션 스티커 시트.",
    "- 각 칸은 같은 인물/캐릭터의 다른 표정과 포즈.",
    "- 배경은 투명 또는 깨끗한 흰색/연회색.",
    "",
    "[컷 분리 계약]",
    ...cutFrameContract(4),
    "",
    "[레이아웃]",
    "- 모든 칸은 균등한 여백과 정렬을 유지한다.",
    "- 각 스티커 아래에는 짧고 굵은 한글 캡션을 넣는다.",
    "",
    "[장면 구성]",
    `- 톤: ${context.toneConfig.label} (${context.toneConfig.direction})`,
    "- 감정 범위: 피곤함, 결심, 당황, 회복, 집중, 성공, 대기, 재시도.",
    "",
    "[자막 후보]",
    ...captions.map((caption, index) => `${index + 1}. "${caption}"`),
    "",
    "[텍스트 규칙]",
    TEXT_RULE,
    "",
    "[스타일]",
    "- 귀엽고 선명한 디지털 스티커.",
    "- 너무 유아틱하거나 캐릭터 상품 광고처럼 보이지 않게 정돈한다.",
    "",
    "[금지 사항]",
    ...SAFETY_RULES.map((rule) => `- ${rule}`),
  ].join("\n");
}

export function buildSeatmapPrompt(context: PromptContext): string {
  const captions = context.customCaption
    ? [`1A "${context.customCaption}"`, ...SEATMAP_CAPTIONS.slice(1)]
    : SEATMAP_CAPTIONS;

  return [
    "[목적]",
    "첨부 사진 속 인물/캐릭터의 여섯 가지 버전을 만들어, 장시간 비행 옆자리 고르기 밈 좌석표 이미지를 만든다.",
    "",
    "[참조 이미지/인물 유지]",
    IDENTITY_RULE,
    "",
    "[출력 사양]",
    "- 4:5 또는 1:1 비율의 SNS 공유용 좌석표 이미지.",
    "- 비행기 좌석표 인포그래픽 안에 같은 인물/캐릭터의 6가지 버전을 배치한다.",
    "- 번호와 짧은 한글 설명이 명확하게 보여야 한다.",
    "",
    "[레이아웃]",
    "- 제목: 장시간 비행, 내 옆자리 고르기",
    "- 좌석 번호: 1A, 2B, 3C, 4D, 5E, 6F",
    "- 하단에는 '댓글로 번호만 남겨줘' 느낌의 짧은 유도 문구.",
    "",
    "[장면 구성]",
    `- 톤: ${context.toneConfig.label} (${context.toneConfig.direction})`,
    "- 여섯 버전 모두 같은 사람처럼 보여야 하지만 성격과 포즈는 분명히 다르다.",
    "",
    "[자막 후보]",
    ...captions.map((caption) => `- ${caption}`),
    "",
    "[텍스트 규칙]",
    TEXT_RULE,
    "",
    "[스타일]",
    "- 항공 좌석표 인포그래픽 느낌.",
    "- 흰색/검정 중심에 작은 라임 포인트.",
    "- 밈이지만 읽기 쉬운 SNS 이미지처럼 정돈한다.",
    "",
    "[금지 사항]",
    ...SAFETY_RULES.map((rule) => `- ${rule}`),
  ].join("\n");
}

function captionsForMode(context: PromptContext): string[] {
  if (context.mode === "single_poster" || context.mode === "candidates") {
    return [context.customCaption || context.scenarioConfig.defaultCaptions[0]];
  }

  if (!context.customCaption) {
    return context.scenarioConfig.defaultCaptions;
  }

  return [context.customCaption, ...context.scenarioConfig.defaultCaptions].slice(0, 4);
}

function layoutRulesForMode(context: PromptContext): string[] {
  if (context.mode === "broadcast_2x2") {
    return [
      "- 정확히 2행x2열 방송 캡처형 컷으로 구성한다.",
      "- 각 컷에는 짧은 자막 후보를 하나씩만 배치한다.",
      "- 상단에는 작은 가상 라벨 LIVE / MEMEZZIC / TODAY ME 중 하나만 사용한다.",
      "- 실제 방송사/브랜드 로고는 만들지 않는다.",
    ];
  }

  if (context.mode === "single_poster") {
    return [
      "- 하나의 강한 대표 장면으로 구성한다.",
      "- 큰 제목은 자막 후보 1개만 사용하고, 부제는 생략하거나 아주 짧게 둔다.",
      "- 뉴스 속보, 팬캠 썸네일, 레드카펫 포스터 중 시나리오에 맞는 한 가지 포맷만 선택한다.",
      "- 실제 방송사/브랜드 로고는 만들지 않는다.",
    ];
  }

  return [
    "- 한 장짜리 후보 이미지로 구성한다.",
    "- 후보마다 구도, 표정, 배경 분위기가 달라질 수 있게 여백을 둔다.",
    "- 큰 제목은 자막 후보 1개만 사용한다.",
    "- 실제 방송사/브랜드 로고는 만들지 않는다.",
  ];
}
