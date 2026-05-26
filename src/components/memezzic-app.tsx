"use client";

import {
  Check,
  Copy,
  Download,
  ImagePlus,
  Loader2,
  Radio,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { GENERATION_MODES, SCENARIOS, TONES } from "@/lib/product-config";
import type { GeneratedImage, GenerateResponse, GenerationMode, ScenarioId, ToneId } from "@/lib/types";

const loadingLines = [
  "중계 카메라 찾는 중...",
  "자막팀 과몰입 중...",
  "오늘의 표정 분석 중...",
  "밈으로 쓸 수 있게 살짝 MSG 치는 중...",
];

export function MemezzicApp() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [scenario, setScenario] = useState<ScenarioId>("overtime-live");
  const [tone, setTone] = useState<ToneId>("over-immersed");
  const [mode, setMode] = useState<GenerationMode>("broadcast_2x2");
  const [customCaption, setCustomCaption] = useState("");
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [usedMock, setUsedMock] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string>("");
  const [loadingIndex, setLoadingIndex] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);
  const previewObjectUrlRef = useRef("");

  const selectedScenario = useMemo(
    () => SCENARIOS.find((item) => item.id === scenario) ?? SCENARIOS[0],
    [scenario],
  );

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const interval = window.setInterval(() => {
      setLoadingIndex((index) => (index + 1) % loadingLines.length);
    }, 1300);

    return () => window.clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
    };
  }, []);

  function handleFileChange(nextFile: File | null) {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = "";
    }

    setFile(nextFile);
    setResults([]);
    setError("");

    if (!nextFile) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(nextFile);
    previewObjectUrlRef.current = url;
    setPreviewUrl(url);
  }

  async function handleGenerate(nextMode?: GenerationMode) {
    if (!file) {
      setError("먼저 셀카나 캐릭터 이미지를 올려주세요.");
      return;
    }

    const modeToUse = nextMode ?? mode;
    setMode(modeToUse);
    setError("");
    setStatusMessage("");
    setIsLoading(true);
    setUsedMock(false);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("scenario", scenario);
    formData.append("tone", tone);
    formData.append("mode", modeToUse);
    formData.append("customCaption", customCaption);
    formData.append("count", modeToUse === "candidates" ? "4" : "1");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as GenerateResponse;

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "이미지 생성에 실패했어요.");
      }

      setResults(payload.images);
      setUsedMock(payload.usedMock);
      setStatusMessage(payload.error ?? "");
      window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch (generateError) {
      setError(generateError instanceof Error ? generateError.message : "이미지 생성에 실패했어요.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyPrompt(image: GeneratedImage) {
    await navigator.clipboard.writeText(image.prompt);
    setCopiedId(image.id);
    window.setTimeout(() => setCopiedId(""), 1600);
  }

  function downloadImage(image: GeneratedImage, index: number) {
    const link = document.createElement("a");
    link.href = image.dataUrl;
    link.download = `memezzic-${selectedScenario.id}-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function resetFlow() {
    setResults([]);
    setError("");
    setStatusMessage("");
    setCopiedId("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="app-shell">
      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={16} aria-hidden />
            AI meme studio
          </div>
          <h1>
            meme zzic
            <span>밈찍</span>
          </h1>
          <p>
            셀카 한 장으로 방송 중계샷, 뉴스 속보, 좌석표 밈, 리액션 스티커를 바로 찍어보세요.
          </p>
        </div>
        <div className="hero-signal" aria-hidden>
          <div className="signal-bar">
            <Radio size={16} />
            LIVE
          </div>
          <strong>MEMEZZIC</strong>
          <span>오늘의 나, 방금 포착</span>
        </div>
      </section>

      <section className="workspace-grid" aria-label="밈찍 생성기">
        <div className="control-surface">
          <div className="panel-heading">
            <div>
              <span>Step 01</span>
              <h2>사진 올리기</h2>
            </div>
            <ShieldCheck size={22} aria-hidden />
          </div>

          <label className={`upload-zone ${previewUrl ? "has-preview" : ""}`}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
            />
            {previewUrl ? (
              <img src={previewUrl} alt="업로드한 이미지 미리보기" />
            ) : (
              <span>
                <ImagePlus size={30} aria-hidden />
                셀카나 캐릭터 이미지를 올려주세요
              </span>
            )}
          </label>

          <p className="privacy-note">
            업로드한 이미지는 결과 생성을 위해서만 사용됩니다. 운영 환경에서는 보관/삭제 정책을 명확히
            설정하세요.
          </p>
        </div>

        <div className="control-surface main-controls">
          <div className="panel-heading">
            <div>
              <span>Step 02</span>
              <h2>밈 설정</h2>
            </div>
            <Wand2 size={22} aria-hidden />
          </div>

          <div className="field-group">
            <div className="field-label">시나리오</div>
            <div className="scenario-grid">
              {SCENARIOS.map((item) => (
                <button
                  className={`scenario-card ${scenario === item.id ? "selected" : ""}`}
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setScenario(item.id);
                    if (item.recommendedMode !== "single_poster") {
                      setMode(item.recommendedMode);
                    }
                  }}
                >
                  <strong>{item.label}</strong>
                  <span>{item.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="field-row">
            <div className="field-group">
              <div className="field-label">톤</div>
              <div className="chip-row">
                {TONES.map((item) => (
                  <button
                    className={`chip ${tone === item.id ? "selected" : ""}`}
                    key={item.id}
                    type="button"
                    onClick={() => setTone(item.id)}
                    title={item.direction}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-group">
              <div className="field-label">생성 모드</div>
              <div className="mode-switch">
                {GENERATION_MODES.map((item) => (
                  <button
                    className={mode === item.id ? "selected" : ""}
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id)}
                    title={item.description}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <label className="caption-field">
            <span>한 줄 자막</span>
            <input
              maxLength={80}
              placeholder="예: 오늘의 나, 실시간 포착"
              value={customCaption}
              onChange={(event) => setCustomCaption(event.target.value)}
            />
          </label>

          <button
            className="generate-button"
            type="button"
            disabled={!file || isLoading}
            onClick={() => handleGenerate()}
          >
            {isLoading ? <Loader2 className="spin" size={20} aria-hidden /> : <Sparkles size={20} aria-hidden />}
            {isLoading ? "생중계 준비 중..." : "내 밈 찍기"}
          </button>

          {isLoading ? <p className="loading-line">{loadingLines[loadingIndex]}</p> : null}
          {error ? <p className="error-line">{error}</p> : null}
        </div>
      </section>

      <section className="result-section" ref={resultRef} aria-label="생성 결과">
        <div className="result-heading">
          <div>
            <span>Step 03</span>
            <h2>찍힌 결과</h2>
          </div>
          {usedMock ? <span className="mock-badge">Mock mode</span> : null}
        </div>

        {statusMessage ? <p className="status-line">{statusMessage}</p> : null}

        {results.length > 0 ? (
          <div className="result-grid">
            {results.map((image, index) => (
              <article className="result-card" key={image.id}>
                <img src={image.dataUrl} alt={`밈찍 생성 결과 ${index + 1}`} />
                <div className="result-actions">
                  <button type="button" onClick={() => downloadImage(image, index)}>
                    <Download size={17} aria-hidden />
                    Download
                  </button>
                  <button type="button" onClick={() => copyPrompt(image)}>
                    {copiedId === image.id ? <Check size={17} aria-hidden /> : <Copy size={17} aria-hidden />}
                    {copiedId === image.id ? "Copied" : "Prompt"}
                  </button>
                </div>
                <details>
                  <summary>프롬프트 보기</summary>
                  <pre>{image.prompt}</pre>
                </details>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-result">
            <strong>아직 찍힌 밈이 없어요.</strong>
            <span>사진을 올리고 시나리오를 고르면 여기에 결과가 나타납니다.</span>
          </div>
        )}

        {results.length > 0 ? (
          <div className="share-loop">
            <p>다음 중계 장소 댓글로 추천해줘 · 내 옆자리 몇 번 고를래? · 다음 편 원하면 냐냐냥 입력</p>
            <div>
              <button type="button" onClick={() => handleGenerate("sticker_4x4")} disabled={isLoading}>
                <Sparkles size={17} aria-hidden />
                스티커팩 찍기
              </button>
              <button type="button" onClick={resetFlow}>
                <RotateCcw size={17} aria-hidden />
                다시 만들기
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <footer className="safety-footer">
        <p>
          본인에게 권리가 있는 이미지만 업로드하세요. 타인의 얼굴, 유명인, 공인, 브랜드/저작권 캐릭터를
          허락 없이 사칭하거나 모방하지 마세요. 밈찍은 패러디/밈 스타일의 생성 이미지를 만드는 도구입니다.
        </p>
      </footer>
    </main>
  );
}
