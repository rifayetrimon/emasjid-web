"use client";

/**
 * Full-viewport maintenance page renderer. Reads `maintenanceDesign`,
 * `maintenanceTitle` and `maintenanceMessage` (or the new `maintenanceMode`,
 * `maintenanceTemplate`, `maintenanceDescription`) from the CMS config and
 * renders the matching full-screen design. Same visual identity as the
 * picker thumbnails in the CMS, scaled up for real viewports.
 *
 * No external dependencies beyond React + Tailwind CSS. All animations are
 * inline (Tailwind built-ins + SVG <animate>) so no extra CSS files needed.
 */

import { useContentReady } from "@/lib/contentReady";

type DesignId = "1" | "2" | "3" | "4" | string;

type Props = {
  design?: DesignId;
  title?: string;
  message?: string;
};

const DEFAULT_TITLE = "This site is under maintenance";
const DEFAULT_MESSAGE = "We're preparing to serve you better.";

export function MaintenancePage({ design = "1", title, message }: Props) {
  useContentReady(); // complete the progress bar — this full-screen page is the content
  const t = title?.trim() || DEFAULT_TITLE;
  const m = message?.trim() || DEFAULT_MESSAGE;

  switch (String(design)) {
    case "2":
      return <StargazerFull title={t} message={m} />;
    case "3":
      return <ToolkitFull title={t} message={m} />;
    case "4":
      return <WorkshopFull title={t} message={m} />;
    case "1":
    default:
      return <UnpluggedFull title={t} message={m} />;
  }
}

export default MaintenancePage;

export type MaintenanceDesignId = "1" | "2" | "3" | "4";

export const MAINTENANCE_DESIGN_OPTIONS: {
  id: MaintenanceDesignId;
  label: string;
  description: string;
}[] = [
  {
    id: "1",
    label: "Unplugged",
    description: "Pale-blue circle with disconnected plugs. Calm, minimal.",
  },
  {
    id: "2",
    label: "Stargazer",
    description: "Cosmic night sky with a ringed planet and twinkling stars.",
  },
  {
    id: "3",
    label: "Toolkit",
    description: "Warm amber backdrop with floating wrench, gear and screwdriver.",
  },
  {
    id: "4",
    label: "Workshop",
    description: "Lavender dome with a character pushing gears along a process bar.",
  },
];

// ───────────────────────────────────────────────────────────────────────
// 1. UNPLUGGED — Two disconnected plugs on a pale blue circle. Clean,
//    instantly readable.
// ───────────────────────────────────────────────────────────────────────
function UnpluggedFull({ title, message }: { title: string; message: string }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white px-6">
      {/* Big background circle */}
      <div className="absolute h-[min(80vh,80vw)] aspect-square rounded-full bg-sky-100" />

      {/* Headline */}
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 text-center w-full max-w-2xl z-10 px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-sky-800 leading-tight tracking-tight">
          {title}
        </h1>
        <p className="text-base md:text-lg text-sky-700/80 mt-4 max-w-xl mx-auto">
          {message}
        </p>
      </div>

      {/* Cable + plugs SVG */}
      <svg
        viewBox="0 0 320 120"
        className="absolute w-[min(90vw,720px)] bottom-[18%] left-1/2 -translate-x-1/2 z-10"
        preserveAspectRatio="xMidYMid meet"
      >
        <path d="M0 60 L 100 60" stroke="#7AB9D4" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M220 60 L 320 60" stroke="#7AB9D4" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* LEFT PLUG (male) */}
        <g>
          <rect x="100" y="44" width="34" height="32" rx="6" fill="#A6DBED" stroke="#1F6A91" strokeWidth="2.5" />
          <rect x="134" y="50" width="12" height="20" rx="3" fill="#A6DBED" stroke="#1F6A91" strokeWidth="2.5" />
          <rect x="146" y="52" width="6" height="3" rx="1.5" fill="#1F6A91" />
          <rect x="146" y="65" width="6" height="3" rx="1.5" fill="#1F6A91" />
        </g>
        {/* RIGHT PLUG (female socket) */}
        <g>
          <rect x="186" y="44" width="34" height="32" rx="6" fill="#A6DBED" stroke="#1F6A91" strokeWidth="2.5" />
          <rect x="174" y="50" width="12" height="20" rx="3" fill="#A6DBED" stroke="#1F6A91" strokeWidth="2.5" />
          <circle cx="180" cy="54" r="1.5" fill="#1F6A91" />
          <circle cx="180" cy="66" r="1.5" fill="#1F6A91" />
        </g>
        {/* Pulsing disconnect spark */}
        <circle cx="160" cy="60" r="1.5" fill="#1F6A91" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// 2. STARGAZER — Cosmic gradient, twinkling stars, crescent moon, ringed
//    planet, sweeping comet.
// ───────────────────────────────────────────────────────────────────────
function StargazerFull({ title, message }: { title: string; message: string }) {
  const stars: { x: number; y: number; r: number; delay: number }[] = [
    { x: 8, y: 18, r: 1.2, delay: 0 },
    { x: 18, y: 8, r: 0.7, delay: 0.4 },
    { x: 28, y: 22, r: 0.9, delay: 0.8 },
    { x: 38, y: 12, r: 1.3, delay: 0.2 },
    { x: 52, y: 28, r: 0.8, delay: 0.6 },
    { x: 64, y: 14, r: 1, delay: 1 },
    { x: 78, y: 22, r: 0.9, delay: 0.3 },
    { x: 92, y: 12, r: 0.7, delay: 1.2 },
    { x: 12, y: 72, r: 0.9, delay: 0.5 },
    { x: 30, y: 82, r: 0.7, delay: 0.9 },
    { x: 50, y: 88, r: 1.1, delay: 0.3 },
    { x: 70, y: 76, r: 0.8, delay: 0.7 },
    { x: 88, y: 82, r: 1, delay: 0.1 },
    { x: 6, y: 52, r: 0.6, delay: 1.4 },
    { x: 96, y: 58, r: 0.9, delay: 0.8 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-violet-950 text-white">
      <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 h-[60vh] aspect-square rounded-full bg-indigo-500/10 blur-3xl" />

      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur={`${2 + (i % 3) * 0.5}s`}
              begin={`${s.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {/* Crescent moon */}
        <g>
          <circle cx="86" cy="16" r="4.5" fill="#FBBF24" opacity="0.95" />
          <circle cx="88" cy="14.5" r="4" fill="#1e1b4b" />
        </g>

        {/* Shooting star */}
        <line x1="0" y1="0" x2="8" y2="2.5" stroke="white" strokeWidth="0.5" strokeLinecap="round">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="15,8; 75,30; 75,30"
            keyTimes="0;0.6;1"
            dur="7s"
            repeatCount="indefinite"
          />
          <animate attributeName="opacity" values="0;0.9;0" keyTimes="0;0.3;0.6" dur="7s" repeatCount="indefinite" />
        </line>
      </svg>

      <div className="absolute top-[14%] left-1/2 -translate-x-1/2 text-center w-full max-w-2xl px-6 z-10">
        <h1
          className="text-4xl md:text-6xl font-semibold text-white leading-tight tracking-tight"
          style={{ fontFamily: "ui-serif, Georgia, serif" }}
        >
          {title}
        </h1>
        <p className="text-base md:text-lg text-indigo-200/80 mt-4 max-w-xl mx-auto leading-relaxed">
          {message}
        </p>
      </div>

      {/* Ringed planet */}
      <div className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative h-40 w-40 md:h-56 md:w-56">
          <div
            className="absolute inset-0 rounded-full border-[6px] md:border-[8px] border-violet-300/70"
            style={{
              borderTopColor: "transparent",
              borderLeftColor: "transparent",
              transform: "rotateX(70deg) scale(1.45, 0.35)",
            }}
          />
          <div className="absolute inset-4 md:inset-6 rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-500 to-indigo-700 shadow-2xl shadow-violet-900/60">
            <div className="absolute top-3 left-5 h-6 w-10 rounded-full bg-white/20 blur-md" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-fuchsia-200/40" />
            <div className="absolute top-[60%] left-0 right-0 h-px bg-fuchsia-200/20" />
          </div>
          <div
            className="absolute inset-0 rounded-full border-[6px] md:border-[8px] border-violet-200/80 border-b-transparent border-r-transparent"
            style={{ transform: "rotateX(70deg) scale(1.45, 0.35)" }}
          />
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs md:text-sm font-semibold uppercase tracking-wider text-indigo-200">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-300 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-300" />
        </span>
        Back Soon
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// 3. TOOLKIT — Warm gradient + amber circle, three floating tools.
// ───────────────────────────────────────────────────────────────────────
function ToolkitFull({ title, message }: { title: string; message: string }) {
  const sparkles: { x: number; y: number; r: number; delay: number }[] = [
    { x: 16, y: 28, r: 1, delay: 0 },
    { x: 82, y: 24, r: 1.2, delay: 0.4 },
    { x: 30, y: 80, r: 0.8, delay: 0.8 },
    { x: 70, y: 84, r: 1, delay: 0.2 },
    { x: 90, y: 58, r: 0.8, delay: 0.6 },
    { x: 8, y: 62, r: 1, delay: 1 },
    { x: 22, y: 50, r: 0.6, delay: 1.3 },
    { x: 78, y: 50, r: 0.7, delay: 0.5 },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 px-6 overflow-hidden">
      <div className="absolute h-[min(80vh,80vw)] aspect-square rounded-full bg-gradient-to-br from-amber-100 to-orange-100" />

      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
      >
        {sparkles.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#F59E0B">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="2.5s" begin={`${s.delay}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>

      <div className="absolute top-[14%] left-1/2 -translate-x-1/2 text-center w-full max-w-2xl px-6 z-10">
        <h1
          className="text-4xl md:text-6xl font-bold text-amber-900 leading-tight tracking-tight"
          style={{ fontFamily: "ui-serif, Georgia, serif" }}
        >
          {title}
        </h1>
        <p className="text-base md:text-lg text-amber-800/70 mt-4 max-w-xl mx-auto">
          {message}
        </p>
      </div>

      <svg
        viewBox="0 0 240 100"
        className="absolute w-[min(70vw,640px)] bottom-[18%] left-1/2 -translate-x-1/2 z-10"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* WRENCH */}
        <g transform="translate(40, 56) rotate(-25)">
          <rect x="-3" y="-22" width="6" height="36" rx="3" fill="#92400E" stroke="#78350F" strokeWidth="1" />
          <path
            d="M -7 -22 L -7 -32 L -3 -36 L 3 -36 L 7 -32 L 7 -22 L 3 -22 L 3 -28 L -3 -28 L -3 -22 Z"
            fill="#B45309"
            stroke="#78350F"
            strokeWidth="1"
          />
          <rect x="-1.5" y="-18" width="1.5" height="28" fill="#FBBF24" opacity="0.5" />
        </g>

        {/* GEAR — rotating */}
        <g transform="translate(120, 50)">
          <g className="animate-spin" style={{ transformOrigin: "center", animationDuration: "12s" }}>
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((rot) => (
              <rect key={rot} x="-3" y="-26" width="6" height="6" rx="1" fill="#F59E0B" transform={`rotate(${rot})`} />
            ))}
            <circle r="20" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            <circle r="10" fill="#FBBF24" />
            <circle r="4" fill="#78350F" />
          </g>
        </g>

        {/* SCREWDRIVER */}
        <g transform="translate(200, 56) rotate(35)">
          <ellipse cx="0" cy="14" rx="6" ry="12" fill="#DC2626" stroke="#7F1D1D" strokeWidth="1" />
          <line x1="-5" y1="10" x2="5" y2="10" stroke="#7F1D1D" strokeWidth="0.6" />
          <line x1="-5" y1="14" x2="5" y2="14" stroke="#7F1D1D" strokeWidth="0.6" />
          <line x1="-5" y1="18" x2="5" y2="18" stroke="#7F1D1D" strokeWidth="0.6" />
          <rect x="-1.5" y="-4" width="3" height="8" fill="#94A3B8" />
          <rect x="-1.5" y="-28" width="3" height="24" fill="#CBD5E1" stroke="#64748B" strokeWidth="0.5" />
          <path d="M -2.5 -32 L 2.5 -32 L 1.5 -28 L -1.5 -28 Z" fill="#94A3B8" />
          <rect x="0" y="-26" width="0.6" height="20" fill="white" opacity="0.6" />
        </g>

        {/* Ground shadows */}
        <ellipse cx="40" cy="92" rx="14" ry="2" fill="#92400E" opacity="0.15" />
        <ellipse cx="120" cy="92" rx="20" ry="2.5" fill="#92400E" opacity="0.18" />
        <ellipse cx="200" cy="92" rx="12" ry="2" fill="#92400E" opacity="0.15" />
      </svg>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────
// 4. WORKSHOP — Lavender dome with character pushing gears + progress bar.
// ───────────────────────────────────────────────────────────────────────
function WorkshopFull({ title, message }: { title: string; message: string }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center bg-slate-50 overflow-hidden">
      <div className="absolute -top-[60%] left-1/2 -translate-x-1/2 h-[160%] w-[140%] rounded-full bg-gradient-to-b from-indigo-50 via-indigo-100/60 to-transparent" />

      <svg
        viewBox="0 0 200 110"
        className="relative z-10 w-[min(80vw,640px)] mt-[6vh]"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Progress bar */}
        <g>
          <text
            x="100"
            y="9"
            textAnchor="middle"
            fontSize="6"
            fontWeight="700"
            fill="#1e293b"
            style={{ letterSpacing: "0.5px" }}
          >
            PROCESS
          </text>
          <rect x="70" y="12" width="60" height="6" rx="3" fill="#E0E7FF" />
          <rect x="70" y="12" width="36" height="6" rx="3" fill="#4F46E5">
            <animate attributeName="width" values="20;48;36" dur="4s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* Character */}
        <g transform="translate(40, 30)">
          <circle cx="20" cy="10" r="7" fill="#1e293b" />
          <path d="M14 6 Q 18 2, 22 4 Q 24 0, 27 5 L 27 10 L 14 10 Z" fill="#0f172a" />
          <circle cx="22" cy="11" r="1" fill="#f1c0a0" opacity="0.8" />
          <path d="M10 18 L 30 18 L 32 38 L 8 38 Z" fill="#475569" />
          <path d="M28 22 L 50 28 L 48 32 L 28 28 Z" fill="#1e293b" />
          <rect x="12" y="38" width="6" height="18" fill="#1e293b" />
          <rect x="22" y="38" width="6" height="18" fill="#1e293b" />
          <ellipse cx="14" cy="58" rx="5" ry="2" fill="#4F46E5" />
          <ellipse cx="26" cy="58" rx="5" ry="2" fill="#4F46E5" />
        </g>

        {/* Gears */}
        <g>
          {/* Gear 1 — target */}
          <g transform="translate(105, 50)">
            <circle r="11" fill="#4F46E5" />
            {[0, 60, 120, 180, 240, 300].map((rot) => (
              <rect key={rot} x="-2" y="-14" width="4" height="4" fill="#4F46E5" transform={`rotate(${rot})`} />
            ))}
            <circle r="6" fill="white" />
            <circle r="3" fill="#4F46E5" />
            <circle r="1.5" fill="white" />
          </g>
          {/* Gear 2 — spinning */}
          <g transform="translate(130, 45)">
            <g className="animate-spin" style={{ transformOrigin: "center", animationDuration: "8s" }}>
              <circle r="13" fill="#4F46E5" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
                <rect key={rot} x="-2" y="-16" width="4" height="4" fill="#4F46E5" transform={`rotate(${rot})`} />
              ))}
            </g>
            <rect x="-4" y="-2" width="1.5" height="6" fill="white" />
            <rect x="-1.5" y="-5" width="1.5" height="9" fill="white" />
            <rect x="1" y="-7" width="1.5" height="11" fill="white" />
          </g>
          {/* Gear 3 — check */}
          <g transform="translate(155, 50)">
            <circle r="11" fill="#4F46E5" />
            {[0, 60, 120, 180, 240, 300].map((rot) => (
              <rect key={rot} x="-2" y="-14" width="4" height="4" fill="#4F46E5" transform={`rotate(${rot})`} />
            ))}
            <path
              d="M -4 0 L -1 3 L 4 -3"
              stroke="white"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* Ground */}
        <line x1="20" y1="91" x2="180" y2="91" stroke="#CBD5E1" strokeWidth="0.6" strokeDasharray="3,2" />
      </svg>

      {/* Text block */}
      <div className="relative z-10 mt-[2vh] text-center px-6 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-indigo-600 tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-base md:text-lg text-slate-700 mt-4 leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}
