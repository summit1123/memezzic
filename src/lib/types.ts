export type GenerationMode =
  | "broadcast_2x2"
  | "sticker_4x4"
  | "seatmap"
  | "candidates";

export type RecommendedMode = GenerationMode | "single_poster";

export type ScenarioId =
  | "overtime-live"
  | "baseball-jumbotron"
  | "breaking-news"
  | "red-carpet"
  | "f1-pitwall"
  | "flight-seatmap"
  | "exam-survival"
  | "commute-documentary";

export type ToneId =
  | "over-immersed"
  | "bittersweet"
  | "lucky-vicky"
  | "office-survival"
  | "nyanyanya"
  | "strong-strong"
  | "quiet-madness";

export type ScenarioConfig = {
  id: ScenarioId;
  label: string;
  description: string;
  defaultCaptions: string[];
  visualStyle: string;
  recommendedMode: RecommendedMode;
};

export type ToneConfig = {
  id: ToneId;
  label: string;
  direction: string;
};

export type GenerateInput = {
  scenario: ScenarioId;
  tone: ToneId;
  mode: GenerationMode;
  customCaption?: string;
  count?: number;
};

export type GeneratedImage = {
  id: string;
  dataUrl: string;
  mimeType: string;
  prompt: string;
};

export type GenerateResponse = {
  ok: boolean;
  mode: GenerationMode;
  images: GeneratedImage[];
  usedMock: boolean;
  error?: string;
};
