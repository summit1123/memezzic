import { getScenario, getTone } from "./product-config";
import type { GenerateInput, GeneratedImage } from "./types";

export function createMockImages(input: Required<GenerateInput>, prompt: string): GeneratedImage[] {
  const count = input.mode === "candidates" ? input.count : 1;
  return Array.from({ length: count }, (_, index) => {
    const svg = createMockSvg(input, index + 1);
    const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`;

    return {
      id: `mock-${Date.now()}-${index}`,
      dataUrl,
      mimeType: "image/svg+xml",
      prompt,
    };
  });
}

function createMockSvg(input: Required<GenerateInput>, index: number): string {
  const scenario = getScenario(input.scenario);
  const tone = getTone(input.tone);
  const title = scenario?.label ?? "밈 시나리오";
  const toneLabel = tone?.label ?? "톤";
  const caption = input.customCaption || scenario?.defaultCaptions[0] || "오늘도 밈찍";
  const modeLabel =
    input.mode === "sticker_4x4"
      ? "16 REACTIONS"
      : input.mode === "seatmap"
        ? "SEATMAP"
        : input.mode === "candidates"
          ? `CANDIDATE ${index}`
          : "LIVE 2x2";

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#fafafa"/>
      <stop offset="48%" stop-color="#f4f4f5"/>
      <stop offset="100%" stop-color="#d9f99d"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="28" stdDeviation="32" flood-color="#111827" flood-opacity="0.12"/>
    </filter>
  </defs>
  <rect width="1024" height="1024" rx="64" fill="url(#bg)"/>
  <rect x="72" y="76" width="880" height="872" rx="48" fill="rgba(255,255,255,0.78)" stroke="#ffffff" filter="url(#shadow)"/>
  <text x="112" y="150" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#111111">meme zzic</text>
  <text x="112" y="190" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#71717a">밈찍 MOCK MODE</text>
  <rect x="730" y="116" width="150" height="52" rx="26" fill="#111111"/>
  <text x="765" y="150" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#ffffff">LIVE</text>
  <rect x="112" y="240" width="800" height="470" rx="40" fill="#111111"/>
  <circle cx="512" cy="420" r="112" fill="#f5f5f4"/>
  <circle cx="512" cy="384" r="62" fill="#d4d4d8"/>
  <path d="M368 598c28-88 100-132 144-132s116 44 144 132" fill="#e4e4e7"/>
  <text x="512" y="674" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="800" fill="#ffffff">${escapeXml(title)}</text>
  <rect x="152" y="748" width="720" height="92" rx="28" fill="#f8fafc"/>
  <text x="512" y="805" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="800" fill="#111111">${escapeXml(caption)}</text>
  <text x="112" y="896" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#3f3f46">${escapeXml(modeLabel)} · ${escapeXml(toneLabel)}</text>
</svg>`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
