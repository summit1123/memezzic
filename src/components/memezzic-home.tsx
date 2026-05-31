import { ArrowRight, Camera, Layers3, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import { GENERATION_MODES, SCENARIOS, TONES } from "@/lib/product-config";
import type { GenerationMode, ToneId } from "@/lib/types";

const samples = [
  {
    src: "/assets/memezzic-sample-redcarpet.png",
    title: "오늘의 착장 입장",
    label: "레드카펫",
  },
  {
    src: "/assets/memezzic-sample-baseball.png",
    title: "오늘의 직관 주인공",
    label: "전광판",
  },
  {
    src: "/assets/memezzic-sample-seatmap.png",
    title: "내 옆자리 고르기",
    label: "댓글 유도",
  },
  {
    src: "/assets/memezzic-sample.png",
    title: "퇴근 후 가장 찬란한 순간",
    label: "짧막 다큐",
  },
];

const toneNotes: Record<ToneId, { bestFor: string; line: string }> = {
  "over-immersed": {
    bestFor: "뉴스처럼 진지하게 웃기는 톤",
    line: "평범한 표정도 사건 현장처럼",
  },
  "main-character": {
    bestFor: "오늘 내가 메인인 톤",
    line: "셀카를 하이라이트 장면으로",
  },
  bittersweet: {
    bestFor: "퇴근·시험·월요일 공감 톤",
    line: "웃긴데 살짝 짠해서 저장하게",
  },
  "lucky-vicky": {
    bestFor: "망한 하루도 좋은 징조로",
    line: "실패담을 밝은 공유용 밈으로",
  },
  "office-survival": {
    bestFor: "마감과 회의를 버틴 기록",
    line: "살아남은 나를 리포트처럼",
  },
  nyanyanya: {
    bestFor: "친구 태그가 붙는 장난 톤",
    line: "의미는 묘하고 반응은 잘 붙게",
  },
  "strong-strong": {
    bestFor: "기세를 올리는 자기암시",
    line: "강한 척하다가 귀여워지는 과장",
  },
  "quiet-madness": {
    bestFor: "차분한 얼굴의 이상한 결심",
    line: "담담해서 더 웃긴 결의",
  },
};

const modeNotes: Record<GenerationMode, { bestFor: string; output: string }> = {
  broadcast_2x2: {
    bestFor: "하루를 사건처럼 보여주고 싶을 때",
    output: "한 장 안에 2x2 방송 캡처형 컷",
  },
  sticker_4x4: {
    bestFor: "메신저에서 계속 꺼내 쓸 리액션이 필요할 때",
    output: "16개 표정이 들어간 스티커 시트",
  },
  seatmap: {
    bestFor: "댓글로 고르게 만들고 싶을 때",
    output: "여섯 버전의 나를 배치한 좌석표 밈",
  },
  single_poster: {
    bestFor: "한 장으로 강하게 꽂히는 대표 이미지를 원할 때",
    output: "뉴스, 포스터, 레드카펫형 단일 이미지",
  },
  candidates: {
    bestFor: "여러 후보 중 가장 웃긴 이미지를 고르고 싶을 때",
    output: "서로 다른 후보 이미지 4장",
  },
};

export function MemezzicHome() {
  return (
    <main className="home-shell">
      <nav className="home-nav" aria-label="밈찍 메인 네비게이션">
        <Link className="home-brand" href="/">
          meme zzic
          <span>밈찍</span>
        </Link>
        <div>
          <a href="#tones">톤</a>
          <a href="#modes">모드</a>
          <Link className="home-nav-cta" href="/create">
            만들기
          </Link>
        </div>
      </nav>

      <section className="home-hero" aria-label="밈찍 소개">
        <img src="/assets/memezzic-sample-baseball.png" alt="" aria-hidden />
        <div className="home-hero-copy">
          <span>
            <Sparkles size={16} aria-hidden />
            AI meme camera
          </span>
          <h1>밈찍</h1>
          <p>사진 한 장을 중계샷, 전광판, 좌석표, 포스터 밈으로 바꿔주는 AI 밈 스튜디오.</p>
          <div className="home-hero-actions">
            <Link href="/create">
              사진으로 시작하기
              <ArrowRight size={18} aria-hidden />
            </Link>
            <a href="#modes">결과 포맷 보기</a>
          </div>
        </div>
      </section>

      <section className="home-samples" aria-label="밈찍 예시 이미지">
        {samples.map((sample) => (
          <article key={sample.src}>
            <img src={sample.src} alt={`${sample.title} 예시 이미지`} />
            <div>
              <span>{sample.label}</span>
              <strong>{sample.title}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="home-section" id="tones">
        <div className="home-section-heading">
          <span>
            <Wand2 size={16} aria-hidden />
            Tone system
          </span>
          <h2>톤은 웃기는 방향입니다.</h2>
          <p>같은 사진도 과몰입 중계, 짠한 기록, 댓글 놀이용 밈처럼 다르게 읽히게 만듭니다.</p>
        </div>
        <div className="tone-board">
          {TONES.map((tone) => (
            <article key={tone.id}>
              <span>{tone.label}</span>
              <strong>{toneNotes[tone.id].bestFor}</strong>
              <p>{toneNotes[tone.id].line}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section" id="modes">
        <div className="home-section-heading">
          <span>
            <Layers3 size={16} aria-hidden />
            Generation modes
          </span>
          <h2>모드는 결과의 모양입니다.</h2>
          <p>한 장, 4컷, 좌석표 중 밈에 맞는 모양을 먼저 고릅니다.</p>
        </div>
        <div className="mode-board">
          {GENERATION_MODES.map((mode) => (
            <article key={mode.id}>
              <span>{mode.label}</span>
              <strong>{modeNotes[mode.id].output}</strong>
              <p>{modeNotes[mode.id].bestFor}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section scenario-section">
        <div className="home-section-heading">
          <span>
            <Camera size={16} aria-hidden />
            Meme recipes
          </span>
          <h2>프리셋은 상황을 빠르게 잡아줍니다.</h2>
          <p>어떤 장면으로 만들지 모르겠다면 아래 프리셋에서 시작하면 됩니다.</p>
        </div>
        <div className="scenario-board">
          {SCENARIOS.map((scenario) => (
            <article key={scenario.id}>
              <span>{scenario.label}</span>
              <p>{scenario.description}</p>
              <strong>{GENERATION_MODES.find((mode) => mode.id === scenario.recommendedMode)?.label}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="home-cta" aria-label="밈찍 시작">
        <h2>설명은 여기까지. 이제 사진으로 찍어보면 됩니다.</h2>
        <Link href="/create">
          제작 페이지로 이동
          <ArrowRight size={18} aria-hidden />
        </Link>
      </section>
    </main>
  );
}
