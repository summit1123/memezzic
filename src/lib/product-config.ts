import type { GenerationMode, ScenarioConfig, ScenarioId, ToneConfig, ToneId } from "./types";

export const SCENARIOS: ScenarioConfig[] = [
  {
    id: "overtime-live",
    label: "야근 생중계",
    description: "퇴근 직전 추가 업무에 포착된 오늘의 나",
    defaultCaptions: [
      "퇴근 5분 전, 추가 업무 포착",
      "오늘도 카페인 전략 성공",
      "실시간 이슈 대응 중",
      "그래도 난 해냄",
    ],
    visualStyle: "late-night office live broadcast, clean desk glow, dramatic but realistic",
    recommendedMode: "broadcast_2x2",
  },
  {
    id: "baseball-jumbotron",
    label: "야구장 전광판",
    description: "관중석 카메라에 잡힌 것처럼 크게 터지는 리액션",
    defaultCaptions: ["전광판에 잡힘", "응원력 상승", "오늘의 직관 주인공", "승요 가능성 있음"],
    visualStyle: "stadium jumbotron, bright lights, fan cam composition",
    recommendedMode: "broadcast_2x2",
  },
  {
    id: "breaking-news",
    label: "뉴스 속보",
    description: "평범한 하루를 긴급 뉴스처럼 과몰입",
    defaultCaptions: ["긴급: 커피 3잔째", "현장 연결합니다", "오늘도 침착한 척", "속보 끝"],
    visualStyle: "fictional breaking news studio, clean lower thirds, serious parody tone",
    recommendedMode: "single_poster",
  },
  {
    id: "red-carpet",
    label: "레드카펫",
    description: "출근룩도 시상식처럼 만들어주는 과한 스포트라이트",
    defaultCaptions: ["오늘의 착장 입장", "플래시 세례 받는 중", "표정 관리 성공", "대상은 나"],
    visualStyle: "premium red carpet press photo, flash lighting, elegant parody",
    recommendedMode: "broadcast_2x2",
  },
  {
    id: "f1-pitwall",
    label: "F1 피트월",
    description: "하루 일정과 멘탈을 레이스 전략처럼 분석",
    defaultCaptions: ["월요일 전략 회의", "타이어보다 멘탈 관리", "피트인 필요", "완주 성공"],
    visualStyle: "fictional motorsport pit wall, data screens, race strategy parody",
    recommendedMode: "broadcast_2x2",
  },
  {
    id: "flight-seatmap",
    label: "장시간 비행 옆자리 고르기",
    description: "여섯 버전의 내가 좌석표에 등장하는 댓글 유도 밈",
    defaultCaptions: [
      "말 안 걸면 착함",
      "간식 나눠줌",
      "럭키비키 긍정러",
      "냐냐냥 해야 대답함",
      "기내식 세 번 물어봄",
      "도착 전부터 퇴근하고 싶음",
    ],
    visualStyle: "premium airline seat map infographic, playful character variants",
    recommendedMode: "seatmap",
  },
  {
    id: "exam-survival",
    label: "시험장 생존 리포트",
    description: "시험 직전의 표정 변화를 생존 다큐처럼 기록",
    defaultCaptions: ["문제지 첫 장", "기억 로딩 중", "찍신 강림", "살아나옴"],
    visualStyle: "quiet documentary still, classroom tension, subtle broadcast captions",
    recommendedMode: "broadcast_2x2",
  },
  {
    id: "commute-documentary",
    label: "퇴근길 다큐",
    description: "지친 귀가길도 명작 다큐의 한 장면처럼",
    defaultCaptions: ["집까지 23분", "이어폰은 생명줄", "오늘의 엔딩 크레딧", "무사 귀환"],
    visualStyle: "cinematic commute documentary, subway or street lights, calm premium tone",
    recommendedMode: "broadcast_2x2",
  },
];

export const TONES: ToneConfig[] = [
  { id: "over-immersed", label: "과몰입", direction: "조금 진지해서 더 웃긴 방송 과몰입 톤" },
  { id: "bittersweet", label: "짠함", direction: "웃긴데 살짝 짠하고 공감되는 톤" },
  { id: "lucky-vicky", label: "럭키비키", direction: "무슨 일이든 좋게 해석하는 초긍정 톤" },
  { id: "office-survival", label: "직장인 생존", direction: "회사와 마감 앞에서 살아남는 톤" },
  { id: "nyanyanya", label: "냐냐냥", direction: "댓글 놀이가 붙기 쉬운 귀엽고 이상한 톤" },
  { id: "strong-strong", label: "스트롱스트롱", direction: "강한 척하지만 귀여운 자기암시 톤" },
  { id: "quiet-madness", label: "조용한 광기", direction: "차분한 얼굴로 이상한 결심을 하는 톤" },
];

export const GENERATION_MODES: Array<{
  id: GenerationMode;
  label: string;
  description: string;
}> = [
  { id: "broadcast_2x2", label: "중계샷 4컷", description: "한 장 안에 2x2 방송 캡처형 밈" },
  { id: "sticker_4x4", label: "리액션 16컷", description: "카톡/디스코드에 쓰기 좋은 스티커 시트" },
  { id: "seatmap", label: "옆자리 밈", description: "여섯 버전의 나를 좌석표로 배치" },
  { id: "candidates", label: "후보 4장", description: "서로 다른 후보 이미지를 여러 장 생성" },
];

export function getScenario(id: string): ScenarioConfig | undefined {
  return SCENARIOS.find((scenario) => scenario.id === id);
}

export function getTone(id: string): ToneConfig | undefined {
  return TONES.find((tone) => tone.id === id);
}

export function isGenerationMode(value: string): value is GenerationMode {
  return GENERATION_MODES.some((mode) => mode.id === value);
}

export function isScenarioId(value: string): value is ScenarioId {
  return SCENARIOS.some((scenario) => scenario.id === value);
}

export function isToneId(value: string): value is ToneId {
  return TONES.some((tone) => tone.id === value);
}
