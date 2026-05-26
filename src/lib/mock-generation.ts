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

  if (input.mode === "broadcast_2x2") {
    return createGridMockSvg({
      gridSize: 2,
      title,
      toneLabel,
      captions: scenario?.defaultCaptions ?? [caption],
      modeLabel: "4 CUT SHEET",
    });
  }

  if (input.mode === "sticker_4x4") {
    return createGridMockSvg({
      gridSize: 4,
      title,
      toneLabel,
      captions: [
        caption,
        "아직",
        "커피수혈",
        "해냄",
        "멘탈복구",
        "회의중",
        "읽씹아님",
        "집중모드",
        "간바레",
        "럭키비키",
        "냐냐냥",
        "강한자",
        "살아남음",
        "대기중",
        "에러남",
        "다시감",
      ],
      modeLabel: "16 REACTIONS",
    });
  }

  const modeLabel =
    input.mode === "seatmap" ? "SEATMAP" : input.mode === "candidates" ? `CANDIDATE ${index}` : "SINGLE";

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

type GridMockOptions = {
  gridSize: 2 | 4;
  title: string;
  toneLabel: string;
  captions: string[];
  modeLabel: string;
};

function createGridMockSvg({ gridSize, title, toneLabel, captions, modeLabel }: GridMockOptions): string {
  const outerPadding = 74;
  const gutter = gridSize === 2 ? 24 : 16;
  const sheetSize = 876;
  const cellSize = (sheetSize - gutter * (gridSize + 1)) / gridSize;
  const cells = Array.from({ length: gridSize * gridSize }, (_, index) => {
    const row = Math.floor(index / gridSize);
    const column = index % gridSize;
    const x = outerPadding + gutter + column * (cellSize + gutter);
    const y = outerPadding + gutter + row * (cellSize + gutter);
    const faceSize = gridSize === 2 ? 78 : 38;
    const captionSize = gridSize === 2 ? 28 : 16;
    const label = captions[index % captions.length] ?? "밈찍";
    const hue = 92 + index * 18;

    return `
  <g>
    <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="${gridSize === 2 ? 34 : 18}" fill="hsl(${hue}, 38%, 94%)"/>
    <rect x="${x + 18}" y="${y + 18}" width="${cellSize - 36}" height="${gridSize === 2 ? 56 : 30}" rx="${gridSize === 2 ? 28 : 15}" fill="#111111"/>
    <text x="${x + 38}" y="${y + (gridSize === 2 ? 55 : 39)}" font-family="Arial, sans-serif" font-size="${gridSize === 2 ? 18 : 10}" font-weight="800" fill="#ffffff">${gridSize === 2 ? "밈찍" : "MZ"}</text>
    <circle cx="${x + cellSize / 2}" cy="${y + cellSize * 0.48}" r="${faceSize}" fill="#ffffff"/>
    <circle cx="${x + cellSize / 2}" cy="${y + cellSize * 0.42}" r="${faceSize * 0.52}" fill="#d4d4d8"/>
    <path d="M ${x + cellSize / 2 - faceSize * 0.9} ${y + cellSize * 0.63} C ${x + cellSize / 2 - faceSize * 0.55} ${y + cellSize * 0.52}, ${x + cellSize / 2 + faceSize * 0.55} ${y + cellSize * 0.52}, ${x + cellSize / 2 + faceSize * 0.9} ${y + cellSize * 0.63} L ${x + cellSize / 2 + faceSize} ${y + cellSize * 0.78} L ${x + cellSize / 2 - faceSize} ${y + cellSize * 0.78} Z" fill="#e4e4e7"/>
    <text x="${x + cellSize / 2}" y="${y + cellSize - (gridSize === 2 ? 36 : 18)}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${captionSize}" font-weight="900" fill="#111111">${escapeXml(label)}</text>
  </g>`;
  }).join("");

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#fbfbfb"/>
      <stop offset="62%" stop-color="#f4f4f5"/>
      <stop offset="100%" stop-color="#d9f99d"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="26" stdDeviation="34" flood-color="#111827" flood-opacity="0.13"/>
    </filter>
  </defs>
  <rect width="1024" height="1024" rx="64" fill="url(#bg)"/>
  <rect x="54" y="52" width="916" height="920" rx="52" fill="rgba(255,255,255,0.9)" filter="url(#shadow)"/>
  <rect x="${outerPadding}" y="${outerPadding}" width="${sheetSize}" height="${sheetSize}" rx="42" fill="#ffffff" stroke="#e4e4e7" stroke-width="2"/>
  ${cells}
  <rect x="118" y="904" width="788" height="38" rx="19" fill="#111111"/>
  <text x="142" y="929" font-family="Arial, sans-serif" font-size="18" font-weight="800" fill="#ffffff">meme zzic · ${escapeXml(modeLabel)} · ${escapeXml(title)} · ${escapeXml(toneLabel)}</text>
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
