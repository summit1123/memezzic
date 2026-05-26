import OpenAI, { toFile } from "openai";
import type { GeneratedImage, GenerationMode } from "./types";

type OpenAIImageRequest = {
  image: File;
  prompt: string;
  count: number;
  mode: GenerationMode;
};

export async function generateOpenAIImages({
  image,
  prompt,
  count,
  mode,
}: OpenAIImageRequest): Promise<GeneratedImage[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("MISSING_OPENAI_API_KEY");
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";
  const outputFormat = "png";
  const safeCount = mode === "candidates" ? Math.min(Math.max(count, 1), 4) : 1;
  const fileBuffer = Buffer.from(await image.arrayBuffer());
  const referenceImage = await toFile(fileBuffer, image.name || "reference.png", {
    type: image.type || "image/png",
  });

  try {
    const editResponse = await client.images.edit({
      model,
      image: referenceImage,
      prompt,
      n: safeCount,
      size: "1024x1024",
      quality: "medium",
      output_format: outputFormat,
    });

    return mapOpenAIImages(editResponse.data ?? [], prompt, outputFormat);
  } catch (error) {
    const generateResponse = await client.images.generate({
      model,
      prompt: `${prompt}\n\n참고: 업로드 이미지 편집 경로가 실패해 텍스트 기반 후보로 생성한다. 첨부 사진의 인상 보존을 최대한 시도한다.`,
      n: safeCount,
      size: "1024x1024",
      quality: "medium",
      output_format: outputFormat,
    });

    const images = mapOpenAIImages(generateResponse.data ?? [], prompt, outputFormat);
    if (images.length === 0) {
      throw error;
    }

    return images;
  }
}

function mapOpenAIImages(
  data: Array<{ b64_json?: string | null; url?: string | null }>,
  prompt: string,
  outputFormat: "png" | "jpeg" | "webp",
): GeneratedImage[] {
  return data
    .map((item, index) => {
      if (item.b64_json) {
        return {
          id: `openai-${Date.now()}-${index}`,
          dataUrl: `data:image/${outputFormat};base64,${item.b64_json}`,
          mimeType: `image/${outputFormat}`,
          prompt,
        };
      }

      if (item.url) {
        return {
          id: `openai-url-${Date.now()}-${index}`,
          dataUrl: item.url,
          mimeType: `image/${outputFormat}`,
          prompt,
        };
      }

      return null;
    })
    .filter((item): item is GeneratedImage => item !== null);
}
