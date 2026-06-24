"use client";

/**
 * Full-viewport Coming Soon renderer — mirror of MaintenancePage. Reads
 * the design / title / message coming from the CMS and renders the
 * matching full-screen design. Visually identical to the picker on
 * Page Designs in the CMS.
 *
 * No external deps beyond React + Tailwind. All animations are inline.
 */

import { useEffect, useState } from "react";
import { useContentReady } from "@/lib/contentReady";

type DesignId = "1" | "2" | "3" | "4" | string;

type Props = {
  design?: DesignId;
  title?: string;
  message?: string;
  launchDate?: string;
};

const DEFAULT_TITLE = "Something great is coming";
const DEFAULT_MESSAGE = "We're putting the finishing touches on our site.";

export function ComingSoonPage({
  design = "1",
  title,
  message,
  launchDate,
}: Props) {
  useContentReady(); // complete the progress bar — this full-screen page is the content
  const t = title?.trim() || DEFAULT_TITLE;
  const m = message?.trim() || DEFAULT_MESSAGE;

  switch (String(design)) {
    case "2":
      return <SubscribeFull title={t} message={m} />;
    case "3":
      return <AuroraFull title={t} message={m} />;
    case "4":
      return <LaunchFull title={t} message={m} />;
    case "1":
    default:
      return <CountdownFull title={t} message={m} launchDate={launchDate} />;
  }
}

export default ComingSoonPage;

export type ComingSoonDesignId = "1" | "2" | "3" | "4";

export const COMING_SOON_DESIGN_OPTIONS: {
  id: ComingSoonDesignId;
  label: string;
  description: string;
}[] = [
  {
    id: "1",
    label: "Countdown",
    description: "Glowing flip-card timer on a deep night sky.",
  },
  {
    id: "2",
    label: "Subscribe",
    description: "Cream gradient with bold promise + email signup.",
  },
  {
    id: "3",
    label: "Aurora",
    description: "Painterly aurora gradient with floating orbs.",
  },
  {
    id: "4",
    label: "Launch",
    description: "Rocket lifting off through pink clouds and stars.",
  },
];

// ───────────────────────────────────────────────────────────────────────
// 1. COUNTDOWN
// ───────────────────────────────────────────────────────────────────────

type CountdownParts = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  reached: boolean;
};

// Computes the gap from `now` → `targetMs`, clamped to zero once the date
// has passed. Returns padded two-digit strings ready to render.
function computeCountdownParts(targetMs: number, nowMs: number): CountdownParts {
  const diff = Math.max(0, targetMs - nowMs);
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
    reached: diff === 0,
  };
}

function useCountdown(launchDate?: string): CountdownParts | null {
  const targetMs = (() => {
    if (!launchDate) return null;
    const t = Date.parse(launchDate);
    return Number.isFinite(t) ? t : null;
  })();

  // Start at null on the server so the initial render is deterministic;
  // the client effect fills in the real numbers after hydration.
  const [parts, setParts] = useState<CountdownParts | null>(null);

  useEffect(() => {
    if (targetMs == null) {
      setParts(null);
      return;
    }
    const tick = () => setParts(computeCountdownParts(targetMs, Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  return parts;
}

function CountdownFull({
  title,
  message,
  launchDate,
}: {
  title: string;
  message: string;
  launchDate?: string;
}) {
  const live = useCountdown(launchDate);

  // Cells render dashes on the server / before the first tick to avoid a
  // hydration mismatch (server has no `Date.now()` for this client clock).
  const cells = live
    ? [
        { value: live.days, unit: "Days" },
        { value: live.hours, unit: "Hrs" },
        { value: live.minutes, unit: "Min" },
        { value: live.seconds, unit: "Sec" },
      ]
    : [
        { value: "--", unit: "Days" },
        { value: "--", unit: "Hrs" },
        { value: "--", unit: "Min" },
        { value: "--", unit: "Sec" },
      ];

  const stars = [
    { x: 6, y: 14, r: 1.1, delay: 0 },
    { x: 18, y: 8, r: 0.7, delay: 0.5 },
    { x: 32, y: 18, r: 1, delay: 1 },
    { x: 48, y: 10, r: 0.8, delay: 0.3 },
    { x: 64, y: 16, r: 1, delay: 0.8 },
    { x: 78, y: 8, r: 0.7, delay: 1.2 },
    { x: 92, y: 14, r: 0.9, delay: 0.4 },
    { x: 10, y: 78, r: 0.8, delay: 0.6 },
    { x: 28, y: 86, r: 0.7, delay: 1.1 },
    { x: 52, y: 90, r: 1, delay: 0.2 },
    { x: 74, y: 82, r: 0.8, delay: 0.9 },
    { x: 90, y: 88, r: 0.9, delay: 0.4 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white">
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white">
            <animate
              attributeName="opacity"
              values="0.2;1;0.2"
              dur={`${2 + (i % 3) * 0.6}s`}
              begin={`${s.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>

      <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 h-[60vh] w-[80vw] max-w-4xl rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 text-center w-full max-w-3xl px-6 z-10">
        <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-cyan-300 mb-3">
          Launching in
        </p>
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
          {title}
        </h1>
      </div>

      <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 flex gap-3 md:gap-6 z-10">
        {cells.map((c) => (
          <div key={c.unit} className="relative flex flex-col items-center">
            <div className="relative h-20 w-20 md:h-32 md:w-32 rounded-xl md:rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 flex items-center justify-center">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-black/50" />
              <span className="text-3xl md:text-5xl font-black text-cyan-300 font-mono leading-none tabular-nums">
                {c.value}
              </span>
            </div>
            <span className="text-[10px] md:text-xs text-cyan-300/70 mt-2 md:mt-3 uppercase tracking-[0.2em] font-semibold">
              {c.unit}
            </span>
          </div>
        ))}
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center w-full max-w-xl px-6">
        <p className="text-sm md:text-base text-slate-300/90">{message}</p>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// 2. SUBSCRIBE
// ───────────────────────────────────────────────────────────────────────
function SubscribeFull({ title, message }: { title: string; message: string }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50 px-6 overflow-hidden">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 text-[11px] md:text-xs font-bold uppercase tracking-wider text-indigo-700">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
        </span>
        Pre-launch
      </div>

      <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-300/50 mb-8" />

      <h1
        className="text-4xl md:text-6xl font-bold text-slate-900 text-center leading-tight tracking-tight max-w-3xl"
        style={{ fontFamily: "ui-serif, Georgia, serif" }}
      >
        {title}
      </h1>
      <p className="text-base md:text-lg text-slate-500 mt-5 text-center max-w-xl leading-relaxed">
        {message}
      </p>

      <form
        className="mt-10 flex items-center gap-2 w-full max-w-md"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex-1 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center px-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 mr-2 flex-shrink-0">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-10 5L2 7" />
          </svg>
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
          />
        </div>
        <button
          type="submit"
          className="h-12 px-5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs md:text-sm font-bold uppercase tracking-wider shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transition-shadow"
        >
          Notify Me
        </button>
      </form>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <a href="#" aria-label="X (Twitter)" className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center hover:scale-110 transition-transform">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>
        <a href="#" aria-label="Instagram" className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 flex items-center justify-center hover:scale-110 transition-transform">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1.5" fill="white" />
          </svg>
        </a>
        <a href="#" aria-label="Facebook" className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center hover:scale-110 transition-transform">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99h-2.54V12h2.54V9.8c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// 3. AURORA
// ───────────────────────────────────────────────────────────────────────
function AuroraFull({ title, message }: { title: string; message: string }) {
  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-950">
      <div
        className="absolute -top-[20%] -left-[20%] h-[80vh] w-[70vw] rounded-full bg-fuchsia-500/40 blur-3xl animate-pulse"
        style={{ animationDuration: "6s" }}
      />
      <div
        className="absolute -top-[10%] right-[10%] h-[70vh] w-[60vw] rounded-full bg-cyan-400/40 blur-3xl animate-pulse"
        style={{ animationDuration: "8s" }}
      />
      <div
        className="absolute bottom-[5%] left-[20%] h-[60vh] w-[60vw] rounded-full bg-indigo-500/40 blur-3xl animate-pulse"
        style={{ animationDuration: "7s" }}
      />
      <div
        className="absolute bottom-[10%] -right-[10%] h-[55vh] w-[55vw] rounded-full bg-pink-500/30 blur-3xl animate-pulse"
        style={{ animationDuration: "9s" }}
      />

      <div
        className="absolute top-[20%] left-[15%] h-4 w-4 rounded-full bg-white/60 blur-[2px] animate-bounce"
        style={{ animationDuration: "4s" }}
      />
      <div
        className="absolute top-[70%] right-[20%] h-3 w-3 rounded-full bg-cyan-200 blur-[2px] animate-bounce"
        style={{ animationDuration: "5s", animationDelay: "1s" }}
      />
      <div
        className="absolute top-[40%] right-[10%] h-2 w-2 rounded-full bg-fuchsia-200 animate-bounce"
        style={{ animationDuration: "6s", animationDelay: "0.5s" }}
      />
      <div
        className="absolute top-[60%] left-[10%] h-2.5 w-2.5 rounded-full bg-indigo-200 blur-[1px] animate-bounce"
        style={{ animationDuration: "5.5s", animationDelay: "0.8s" }}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-px bg-gradient-to-r from-transparent via-white/30 to-transparent -rotate-12" />

      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-center px-6">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="white"
          className="mb-4 animate-pulse drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
          style={{ animationDuration: "2s" }}
        >
          <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5Z" />
        </svg>

        <h1
          className="text-4xl md:text-7xl font-extrabold text-white leading-tight tracking-tight max-w-3xl drop-shadow-lg"
          style={{ fontFamily: "ui-serif, Georgia, serif" }}
        >
          {title}
        </h1>
        <p className="text-base md:text-xl text-white/80 mt-5 max-w-xl leading-relaxed">
          {message}
        </p>

        <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs md:text-sm font-bold uppercase tracking-wider text-white">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          Coming Soon
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// 4. LAUNCH
// ───────────────────────────────────────────────────────────────────────
function LaunchFull({ title, message }: { title: string; message: string }) {
  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-b from-violet-900 via-pink-700 to-orange-500">
      <svg
        viewBox="0 0 100 60"
        className="absolute inset-0 w-full h-1/2"
        preserveAspectRatio="xMidYMid slice"
      >
        {[
          { x: 8, y: 10 }, { x: 20, y: 6 }, { x: 32, y: 14 }, { x: 46, y: 8 },
          { x: 60, y: 16 }, { x: 74, y: 6 }, { x: 88, y: 12 }, { x: 14, y: 26 },
          { x: 38, y: 30 }, { x: 64, y: 28 }, { x: 82, y: 32 }, { x: 96, y: 22 },
        ].map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r="0.4" fill="white">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur={`${2 + (i % 3) * 0.5}s`}
              begin={`${i * 0.2}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>

      <div className="absolute top-[30%] left-[8%] h-10 w-32 rounded-full bg-pink-300/70 blur-md animate-pulse" style={{ animationDuration: "5s" }} />
      <div className="absolute top-[36%] right-[10%] h-8 w-28 rounded-full bg-pink-300/60 blur-md animate-pulse" style={{ animationDuration: "4s", animationDelay: "1s" }} />
      <div className="absolute top-[44%] left-[18%] h-7 w-20 rounded-full bg-orange-200/70 blur-md animate-pulse" style={{ animationDuration: "6s" }} />
      <div className="absolute top-[40%] right-[28%] h-6 w-16 rounded-full bg-pink-200/60 blur-md animate-pulse" style={{ animationDuration: "7s", animationDelay: "0.5s" }} />

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[20%] w-[140%] rounded-t-[50%] bg-gradient-to-b from-orange-400 to-rose-600" />

      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 text-center w-full max-w-3xl px-6 z-20">
        <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-pink-200 mb-3">
          🚀 Ready for liftoff
        </p>
        <h1
          className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg"
          style={{ fontFamily: "ui-serif, Georgia, serif" }}
        >
          {title}
        </h1>
        <p className="text-base md:text-lg text-pink-100/90 mt-4 max-w-xl mx-auto leading-relaxed">
          {message}
        </p>
      </div>

      <div className="absolute left-1/2 bottom-[14%] -translate-x-1/2 flex flex-col items-center z-10">
        <div className="absolute -bottom-12 flex flex-col items-center gap-1">
          <div className="h-5 w-12 rounded-full bg-white/70 blur-[3px] animate-pulse" style={{ animationDuration: "1.2s" }} />
          <div className="h-6 w-16 rounded-full bg-white/50 blur-[4px] animate-pulse" style={{ animationDuration: "1.5s", animationDelay: "0.2s" }} />
          <div className="h-8 w-20 rounded-full bg-white/30 blur-[5px] animate-pulse" style={{ animationDuration: "1.8s", animationDelay: "0.4s" }} />
        </div>

        <svg width="144" height="240" viewBox="0 0 36 60" className="relative z-10 drop-shadow-2xl">
          <path
            d="M18 4 Q 26 14, 26 32 L 26 44 L 10 44 L 10 32 Q 10 14, 18 4 Z"
            fill="#F3F4F6"
            stroke="#94A3B8"
            strokeWidth="0.8"
          />
          <path d="M18 4 Q 22 8, 22 14 L 14 14 Q 14 8, 18 4 Z" fill="#EF4444" />
          <circle cx="18" cy="22" r="3.5" fill="#0EA5E9" stroke="#0369A1" strokeWidth="0.8" />
          <circle cx="17" cy="21" r="1" fill="white" opacity="0.7" />
          <rect x="10" y="36" width="16" height="2" fill="#EF4444" />
          <path d="M10 38 L 4 48 L 10 46 Z" fill="#DC2626" />
          <path d="M26 38 L 32 48 L 26 46 Z" fill="#DC2626" />
          <rect x="14" y="44" width="8" height="3" rx="0.5" fill="#475569" />
          <path d="M 14 47 Q 18 56, 22 47 Q 19 52, 18 56 Q 17 52, 14 47 Z" fill="url(#flameGradFull)">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="0.4s" repeatCount="indefinite" />
          </path>
          <defs>
            <linearGradient id="flameGradFull" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="60%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
