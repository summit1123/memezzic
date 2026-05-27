"use client";

import {
  Check,
  Copy,
  Download,
  ImagePlus,
  Scissors,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import { GENERATION_MODES, SCENARIOS, TONES } from "@/lib/product-config";
import type { GeneratedImage, GenerateResponse, GenerationMode, ScenarioId, ToneId } from "@/lib/types";

const loadingLines = [
  "중계 카메라 찾는 중...",
  "자막팀 과몰입 중...",
  "오늘의 표정 분석 중...",
  "밈으로 쓸 수 있게 살짝 MSG 치는 중...",
];

const sampleSlides = [
  {
    src: "/assets/memezzic-sample.png",
    title: "퇴근 후, 가장 찬란한 순간",
    caption: "짧막 다큐",
  },
  {
    src: "/assets/memezzic-sample-redcarpet.png",
    title: "오늘의 착장 입장",
    caption: "레드카펫 밈",
  },
  {
    src: "/assets/memezzic-sample-seatmap.png",
    title: "내 옆자리 고르기",
    caption: "댓글 유도 밈",
  },
  {
    src: "/assets/memezzic-sample-baseball.png",
    title: "오늘의 직관 주인공",
    caption: "야구장 중계샷",
  },
];

const CUT_VAULT_STORAGE_KEY = "memezzic-cut-vault-v1";
const MAX_CUT_VAULT_ITEMS = 24;
const CUT_VAULT_TTL_HOURS = 6;
const CUT_VAULT_TTL_MS = CUT_VAULT_TTL_HOURS * 60 * 60 * 1000;

type CutVaultItem = {
  id: string;
  dataUrl: string;
  label: string;
  sourceLabel: string;
  expiresAt: number;
};

type StoredCutVaultItem = Omit<CutVaultItem, "expiresAt"> & {
  expiresAt?: number;
};

function getCutGridSize(mode: GenerationMode) {
  if (mode === "broadcast_2x2") {
    return 2;
  }

  if (mode === "sticker_4x4") {
    return 4;
  }

  return null;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("image load failed"));
    image.src = src;
  });
}

function getFreshCutVaultItems(items: CutVaultItem[]) {
  const now = Date.now();
  return items.filter((item) => item.expiresAt > now).slice(0, MAX_CUT_VAULT_ITEMS);
}

function parseStoredCutVault(value: string) {
  const parsed = JSON.parse(value) as StoredCutVaultItem[];
  if (!Array.isArray(parsed)) {
    return [];
  }

  const now = Date.now();
  return getFreshCutVaultItems(
    parsed.map((item) => ({
      ...item,
      expiresAt: typeof item.expiresAt === "number" ? item.expiresAt : now + CUT_VAULT_TTL_MS,
    })),
  );
}

function withCutVaultExpiry(item: Omit<CutVaultItem, "expiresAt">): CutVaultItem {
  return {
    ...item,
    expiresAt: Date.now() + CUT_VAULT_TTL_MS,
  };
}

export function MemezzicApp() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [scenario, setScenario] = useState<ScenarioId>("overtime-live");
  const [tone, setTone] = useState<ToneId>("over-immersed");
  const [mode, setMode] = useState<GenerationMode>("broadcast_2x2");
  const [customCaption, setCustomCaption] = useState("");
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [resultMode, setResultMode] = useState<GenerationMode>("broadcast_2x2");
  const [cutVault, setCutVault] = useState<CutVaultItem[]>([]);
  const [usedMock, setUsedMock] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string>("");
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);
  const scrollAnimationRef = useRef<number | null>(null);
  const previewObjectUrlRef = useRef("");
  const hasLoadedCutVaultRef = useRef(false);

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

      if (scrollAnimationRef.current !== null) {
        window.cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    try {
      const savedVault = window.localStorage.getItem(CUT_VAULT_STORAGE_KEY);
      if (savedVault) {
        const parsedVault = parseStoredCutVault(savedVault);
        window.setTimeout(() => {
          if (isMounted) {
            hasLoadedCutVaultRef.current = true;
            setCutVault(parsedVault);
          }
        }, 0);
      } else {
        hasLoadedCutVaultRef.current = true;
      }
    } catch {
      window.localStorage.removeItem(CUT_VAULT_STORAGE_KEY);
      hasLoadedCutVaultRef.current = true;
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedCutVaultRef.current) {
      return;
    }

    try {
      const freshItems = getFreshCutVaultItems(cutVault);
      if (freshItems.length === 0) {
        window.localStorage.removeItem(CUT_VAULT_STORAGE_KEY);
        return;
      }

      window.localStorage.setItem(CUT_VAULT_STORAGE_KEY, JSON.stringify(freshItems));
    } catch {
      // Large image data can exceed localStorage quota. The in-memory temporary tray still works.
    }
  }, [cutVault]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCutVault((items) => getFreshCutVaultItems(items));
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((index) => (index + 1) % sampleSlides.length);
    }, 3600);

    return () => window.clearInterval(interval);
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

  function smoothScrollToPosition(top: number, duration = 820) {
    if (scrollAnimationRef.current !== null) {
      window.cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }

    const start = window.scrollY;
    const distance = Math.max(0, top) - start;

    if (Math.abs(distance) < 2) {
      return;
    }

    const startTime = window.performance.now();
    const easeInOutCubic = (progress: number) =>
      progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;

    function animateScroll(now: number) {
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, start + distance * easeInOutCubic(progress));

      if (progress < 1) {
        scrollAnimationRef.current = window.requestAnimationFrame(animateScroll);
      } else {
        scrollAnimationRef.current = null;
      }
    }

    scrollAnimationRef.current = window.requestAnimationFrame(animateScroll);
  }

  function smoothScrollToElement(element: HTMLElement | null, offset = 84, duration = 820) {
    if (!element) {
      return;
    }

    const targetTop = element.getBoundingClientRect().top + window.scrollY - offset;
    smoothScrollToPosition(targetTop, duration);
  }

  function handleCreateLinkClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    smoothScrollToElement(document.getElementById("create"), 84, 900);
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
      setResultMode(modeToUse);
      setUsedMock(payload.usedMock);
      setStatusMessage(payload.error ?? "");
      window.setTimeout(() => smoothScrollToElement(resultRef.current, 80, 980), 120);
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

  function downloadDataUrl(dataUrl: string, filename: string) {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function splitImageIntoCuts(image: GeneratedImage, resultIndex: number) {
    const gridSize = getCutGridSize(resultMode);
    if (!gridSize) {
      const sourceLabel = `${selectedScenario.label} 후보 ${resultIndex + 1}`;
      setCutVault((items) =>
        getFreshCutVaultItems([
          withCutVaultExpiry({
            id: `cut-whole-${image.id}-${Date.now()}`,
            dataUrl: image.dataUrl,
            label: "단일 컷",
            sourceLabel,
          }),
          ...items,
        ]),
      );
      setStatusMessage(`단일 이미지가 임시 컷함에 담겼어요. ${CUT_VAULT_TTL_HOURS}시간 안에 다운로드해두세요.`);
      return;
    }

    try {
      const loadedImage = await loadImage(image.dataUrl);
      const cuts: CutVaultItem[] = [];

      for (let row = 0; row < gridSize; row += 1) {
        for (let column = 0; column < gridSize; column += 1) {
          const sourceX = Math.round((loadedImage.naturalWidth * column) / gridSize);
          const sourceY = Math.round((loadedImage.naturalHeight * row) / gridSize);
          const nextX = Math.round((loadedImage.naturalWidth * (column + 1)) / gridSize);
          const nextY = Math.round((loadedImage.naturalHeight * (row + 1)) / gridSize);
          const cellWidth = nextX - sourceX;
          const cellHeight = nextY - sourceY;
          const canvas = document.createElement("canvas");
          canvas.width = cellWidth;
          canvas.height = cellHeight;
          const context = canvas.getContext("2d");

          if (!context) {
            throw new Error("canvas context unavailable");
          }

          context.drawImage(
            loadedImage,
            sourceX,
            sourceY,
            cellWidth,
            cellHeight,
            0,
            0,
            cellWidth,
            cellHeight,
          );

          cuts.push(
            withCutVaultExpiry({
              id: `cut-${image.id}-${row}-${column}-${Date.now()}`,
              dataUrl: canvas.toDataURL("image/png"),
              label: `${cuts.length + 1}컷`,
              sourceLabel: `${selectedScenario.label} ${resultIndex + 1}`,
            }),
          );
        }
      }

      setCutVault((items) => getFreshCutVaultItems([...cuts, ...items]));
      setStatusMessage(`${cuts.length}개의 컷을 임시 컷함에 담았어요. ${CUT_VAULT_TTL_HOURS}시간 안에 다운로드해두세요.`);
    } catch {
      setError("이미지를 컷으로 자르지 못했어요. 원본 이미지를 저장한 뒤 다시 시도해주세요.");
    }
  }

  function downloadCut(cut: CutVaultItem, index: number) {
    downloadDataUrl(cut.dataUrl, `memezzic-cut-${index + 1}.png`);
  }

  function downloadAllCuts() {
    cutVault.forEach((cut, index) => {
      window.setTimeout(() => downloadCut(cut, index), index * 120);
    });
  }

  function resetFlow() {
    setResults([]);
    setError("");
    setStatusMessage("");
    setCopiedId("");
    smoothScrollToPosition(0, 900);
  }

  return (
    <main className="app-shell">
      <nav className="top-nav" aria-label="밈찍 네비게이션">
        <a href="#" className="brand-mark" onClick={(event) => {
          event.preventDefault();
          resetFlow();
        }}>
          meme zzic
          <span>밈찍</span>
        </a>
        <a className="nav-cta" href="#create" onClick={handleCreateLinkClick}>
          만들기
        </a>
      </nav>

      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={16} aria-hidden />
            AI meme camera
          </div>
          <h1>
            밈이 되는 순간을
            <span>예쁘게 찍다.</span>
          </h1>
          <p>
            셀카 한 장을 올리면 밈찍이 중계샷, 레드카펫, 좌석표, 리액션 스티커처럼 바로 공유할 수 있는
            결과물로 바꿔줍니다.
          </p>
          <div className="hero-actions">
            <a href="#create" onClick={handleCreateLinkClick}>내 밈 찍기</a>
            <span>실제 이미지 생성 샘플 4종 포함</span>
          </div>
        </div>
        <div className="hero-gallery" aria-label="밈찍 실제 생성 샘플 슬라이드">
          <div className="gallery-frame">
            {sampleSlides.map((slide, index) => (
              <img
                aria-hidden={activeSlide !== index}
                className={activeSlide === index ? "active" : ""}
                key={slide.src}
                src={slide.src}
                alt={`밈찍 실제 생성 샘플: ${slide.title}`}
              />
            ))}
          </div>
          <div className="gallery-caption">
            <div>
              <span>{sampleSlides[activeSlide].caption}</span>
              <strong>{sampleSlides[activeSlide].title}</strong>
            </div>
            <div className="gallery-dots" aria-label="샘플 슬라이드 선택">
              {sampleSlides.map((slide, index) => (
                <button
                  aria-label={`${slide.title} 보기`}
                  className={activeSlide === index ? "active" : ""}
                  key={slide.src}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="story-section" aria-label="밈찍 소개">
        <div className="story-item">
          <span>01</span>
          <strong>사진은 하나면 충분합니다.</strong>
          <p>표정과 분위기를 유지하면서 장면만 밈 문법으로 바꿉니다.</p>
        </div>
        <div className="story-item">
          <span>02</span>
          <strong>결과물은 바로 공유할 수 있게.</strong>
          <p>중계샷, 좌석표, 리액션 시트처럼 댓글이 붙는 포맷으로 만듭니다.</p>
        </div>
        <div className="story-item">
          <span>03</span>
          <strong>웹에서 가볍고 부드럽게.</strong>
          <p>메인에서는 감상하고, 아래 스튜디오에서 세부 설정을 합니다.</p>
        </div>
      </section>

      <section className="studio-intro" id="create">
        <span>Create studio</span>
        <h2>이제 내 사진으로 찍어보기</h2>
        <p>여기서부터가 생성 화면입니다. 사진을 올리고 원하는 밈 문법을 고르면 됩니다.</p>
      </section>

      <section className="create-flow" aria-label="밈찍 생성기">
        <div className="control-surface upload-surface">
          <div className="panel-heading">
            <div>
              <span>Image</span>
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
              <span>Recipe</span>
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
            <span>Result</span>
            <h2>찍힌 결과</h2>
          </div>
          {usedMock ? <span className="mock-badge">Mock mode</span> : null}
        </div>

        {statusMessage ? <p className="status-line">{statusMessage}</p> : null}

        {results.length > 0 ? (
          <div className="cut-guide-banner">
            <Scissors size={18} aria-hidden />
            <div>
              <strong>스티커사진처럼 잘라 바로 저장할 수 있어요</strong>
              <span>
                컷은 이 브라우저의 임시 컷함에 최대 {CUT_VAULT_TTL_HOURS}시간만 남아요. 마음에 드는 컷은 꼭 다운로드해두세요.
              </span>
            </div>
          </div>
        ) : null}

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
                  <button type="button" onClick={() => splitImageIntoCuts(image, index)}>
                    <Scissors size={17} aria-hidden />
                    컷 자르기
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

        {cutVault.length > 0 ? (
          <div className="cut-vault" aria-label="임시 컷함">
            <div className="cut-vault-heading">
              <div>
                <span>Temporary cuts</span>
                <strong>임시 컷함</strong>
                <p>이 기기와 브라우저에서만 최대 {CUT_VAULT_TTL_HOURS}시간 유지됩니다. 저장할 컷은 바로 다운로드하세요.</p>
              </div>
              <div className="cut-vault-actions">
                <button type="button" onClick={downloadAllCuts}>
                  <Download size={16} aria-hidden />
                  모두 저장
                </button>
                <button type="button" onClick={() => setCutVault([])}>
                  <Trash2 size={16} aria-hidden />
                  비우기
                </button>
              </div>
            </div>
            <div className="cut-grid">
              {cutVault.map((cut, index) => (
                <article className="cut-card" key={cut.id}>
                  <img src={cut.dataUrl} alt={`${cut.sourceLabel} ${cut.label}`} />
                  <div>
                    <span>{cut.sourceLabel}</span>
                    <button type="button" onClick={() => downloadCut(cut, index)}>
                      <Download size={15} aria-hidden />
                      저장
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}

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
