import { NextResponse } from "next/server";
import { buildPrompt } from "@/lib/prompt-builder";
import { createMockImages } from "@/lib/mock-generation";
import { generateOpenAIImages } from "@/lib/openai-image";
import { validateGenerateFields, validateImageFile } from "@/lib/validation";
import type { GenerateResponse } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 90;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fileValue = formData.get("image");
    const file = fileValue instanceof File ? fileValue : null;
    const fileError = validateImageFile(file);

    if (fileError || !file) {
      return jsonError(fileError ?? "이미지를 업로드해주세요.", "broadcast_2x2", 400);
    }

    const validation = validateGenerateFields({
      scenario: formData.get("scenario"),
      tone: formData.get("tone"),
      mode: formData.get("mode"),
      customCaption: formData.get("customCaption"),
      count: formData.get("count"),
    });

    if (!validation.ok) {
      return jsonError(validation.error, "broadcast_2x2", 400);
    }

    const input = validation.value;
    const prompt = buildPrompt(input);

    const forceMock = process.env.NODE_ENV !== "production" && request.headers.get("x-memezzic-mock") === "1";

    if (!process.env.OPENAI_API_KEY || forceMock) {
      return NextResponse.json<GenerateResponse>({
        ok: true,
        mode: input.mode,
        images: createMockImages(input, prompt),
        usedMock: true,
        error: forceMock
          ? "Mock mode: forced by development smoke test."
          : "Mock mode: add OPENAI_API_KEY to generate real images.",
      });
    }

    try {
      const images = await generateOpenAIImages({
        image: file,
        prompt,
        count: input.count,
        mode: input.mode,
      });

      return NextResponse.json<GenerateResponse>({
        ok: true,
        mode: input.mode,
        images,
        usedMock: false,
      });
    } catch {
      return NextResponse.json<GenerateResponse>({
        ok: true,
        mode: input.mode,
        images: createMockImages(input, prompt),
        usedMock: true,
        error: "OpenAI 이미지 생성이 실패해 mock mode로 결과를 보여드려요.",
      });
    }
  } catch {
    return jsonError("생성 요청을 처리하지 못했어요. 잠시 후 다시 시도해주세요.", "broadcast_2x2", 500);
  }
}

function jsonError(message: string, mode: GenerateResponse["mode"], status: number) {
  return NextResponse.json<GenerateResponse>(
    {
      ok: false,
      mode,
      images: [],
      usedMock: false,
      error: message,
    },
    { status },
  );
}
