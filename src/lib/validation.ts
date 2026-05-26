import { isGenerationMode, isScenarioId, isToneId } from "./product-config";
import type { GenerateInput, GenerationMode, ScenarioId, ToneId } from "./types";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const MAX_CUSTOM_CAPTION_LENGTH = 80;
export const MAX_COUNT = 4;
export const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export type ValidationResult =
  | { ok: true; value: Required<GenerateInput> }
  | { ok: false; error: string };

export function sanitizeCaption(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_CUSTOM_CAPTION_LENGTH);
}

export function validateImageFile(file: File | null): string | null {
  if (!file) {
    return "이미지를 업로드해주세요.";
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "jpg, png, webp 이미지만 업로드할 수 있어요.";
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return "이미지는 10MB 이하로 업로드해주세요.";
  }

  return null;
}

export function validateGenerateFields(fields: {
  scenario: FormDataEntryValue | null;
  tone: FormDataEntryValue | null;
  mode: FormDataEntryValue | null;
  customCaption: FormDataEntryValue | null;
  count: FormDataEntryValue | null;
}): ValidationResult {
  const scenario = String(fields.scenario ?? "");
  const tone = String(fields.tone ?? "");
  const mode = String(fields.mode ?? "");
  const customCaption = sanitizeCaption(fields.customCaption);
  const parsedCount = Number(fields.count ?? 1);
  const count = Number.isFinite(parsedCount)
    ? Math.min(Math.max(Math.trunc(parsedCount), 1), MAX_COUNT)
    : 1;

  if (!isScenarioId(scenario)) {
    return { ok: false, error: "알 수 없는 밈 시나리오예요." };
  }

  if (!isToneId(tone)) {
    return { ok: false, error: "알 수 없는 톤이에요." };
  }

  if (!isGenerationMode(mode)) {
    return { ok: false, error: "알 수 없는 생성 모드예요." };
  }

  return {
    ok: true,
    value: {
      scenario: scenario as ScenarioId,
      tone: tone as ToneId,
      mode: mode as GenerationMode,
      customCaption,
      count: mode === "candidates" ? count : 1,
    },
  };
}
