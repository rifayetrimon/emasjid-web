import {
  Eye,
  CalendarCheck,
  TrendingUp,
  CalendarRange,
} from "lucide-react";
import { VisitorStats as Stats } from "@/services/visitorService";
import AnimatedCount from "./AnimatedCount";

type Variant = "bento" | "light" | "dark" | "heritage" | "editorial";

interface Props {
  stats: Stats;
  variant?: Variant;
  /** Optional section title above the stats */
  title?: string;
  eyebrow?: string;
}

// Mirrors the four windows the visitors API actually returns. When the
// backend ships a daily "today" field, slot it back in after `total`.
const FIELDS = (s: Stats) => [
  {
    key: "total",
    icon: Eye,
    label: "Jumlah Lawatan",
    value: s.total,
    chipBg: "bg-blue-50",
    chipText: "text-blue-600",
  },
  {
    key: "lastWeek",
    icon: CalendarCheck,
    label: "7 Hari",
    value: s.lastWeek,
    chipBg: "bg-emerald-50",
    chipText: "text-emerald-600",
  },
  {
    key: "lastMonth",
    icon: TrendingUp,
    label: "30 Hari",
    value: s.lastMonth,
    chipBg: "bg-purple-50",
    chipText: "text-purple-600",
  },
  {
    key: "lastYear",
    icon: CalendarRange,
    label: "365 Hari",
    value: s.lastYear,
    chipBg: "bg-rose-50",
    chipText: "text-rose-600",
  },
];

export default function VisitorStats({
  stats,
  variant = "light",
  title,
  eyebrow,
}: Props) {
  const fields = FIELDS(stats);
  const total = fields[0];
  const rest = fields.slice(1);

  if (variant === "bento") {
    // Bento layout: total spans full width, then 4 sub-stats in 2x2
    return (
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <BentoCard field={total} large />
        {rest.map((f) => (
          <BentoCard key={f.key} field={f} />
        ))}
      </div>
    );
  }

  return (
    <section
      aria-label="Statistik pelawat"
      className={`py-12 md:py-16 px-6 ${sectionWrapperBg(variant)}`}
    >
      <div className="max-w-7xl mx-auto">
        {(eyebrow || title) && (
          <div className={`mb-8 md:mb-10 ${headerAlign(variant)}`}>
            {eyebrow && (
              <p className={eyebrowClass(variant)}>{eyebrow}</p>
            )}
            {title && (
              <h2 className={titleClass(variant)}>{title}</h2>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {fields.map((f) => (
            <SectionCard key={f.key} field={f} variant={variant} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Bento (used inside Template 2 right column) ───────── */

function BentoCard({
  field,
  large = false,
}: {
  field: ReturnType<typeof FIELDS>[number];
  large?: boolean;
}) {
  const Icon = field.icon;
  return (
    <div
      className={`${
        large ? "col-span-2" : ""
      } rounded-3xl bg-white p-4 md:p-5 border border-gray-100 flex flex-col justify-between min-h-[120px]`}
    >
      <div
        className={`w-10 h-10 rounded-xl ${field.chipBg} ${field.chipText} flex items-center justify-center`}
        aria-hidden
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p
          className={`${
            large ? "text-3xl md:text-4xl" : "text-2xl"
          } font-bold text-gray-900 leading-none tabular-nums`}
        >
          <AnimatedCount value={field.value} />
        </p>
        <p className="text-[11px] md:text-xs text-gray-500 mt-1.5 font-medium">
          {field.label}
        </p>
      </div>
    </div>
  );
}

/* ───────── Standalone section card (used in other templates) ───────── */

function SectionCard({
  field,
  variant,
}: {
  field: ReturnType<typeof FIELDS>[number];
  variant: Variant;
}) {
  const Icon = field.icon;

  if (variant === "dark") {
    return (
      <div className="rounded-2xl bg-zinc-900 border border-white/5 p-5 hover:border-[var(--primary)]/40 transition-colors">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/15 border border-[var(--primary)]/30 text-[var(--primary)] flex items-center justify-center mb-4">
          <Icon className="w-5 h-5" />
        </div>
        <p className="text-2xl md:text-3xl font-bold text-white leading-none tabular-nums">
          <AnimatedCount value={field.value} />
        </p>
        <p className="text-[11px] uppercase tracking-wider text-white/50 mt-2 font-bold">
          {field.label}
        </p>
      </div>
    );
  }

  if (variant === "heritage") {
    return (
      <div
        className="bg-[#fdfaf3] border-2 border-[var(--primary)]/40 hover:border-[var(--primary)] transition-colors p-5"
        style={{
          clipPath:
            "polygon(10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px), 0 10px)",
        }}
      >
        <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-4">
          <Icon className="w-5 h-5" />
        </div>
        <p
          className="text-2xl md:text-3xl font-bold text-[var(--secondary)] leading-none tabular-nums"
          style={{ fontFamily: "'Times New Roman', serif" }}
        >
          <AnimatedCount value={field.value} />
        </p>
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#a47133] mt-2 font-bold">
          {field.label}
        </p>
      </div>
    );
  }

  if (variant === "editorial") {
    return (
      <div className="border-r last:border-r-0 border-gray-200 px-4 md:px-5 py-2">
        <p
          className="text-3xl md:text-4xl font-bold text-gray-900 leading-none tabular-nums"
          style={{ fontFamily: "Georgia, serif" }}
        >
          <AnimatedCount value={field.value} />
        </p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-2 font-bold">
          {field.label}
        </p>
      </div>
    );
  }

  // default "light"
  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-5 hover:shadow-md hover:border-[var(--primary)]/30 transition-all">
      <div
        className={`w-10 h-10 rounded-xl ${field.chipBg} ${field.chipText} flex items-center justify-center mb-4`}
        aria-hidden
      >
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-none tabular-nums">
        <AnimatedCount value={field.value} />
      </p>
      <p className="text-[11px] uppercase tracking-wider text-gray-500 mt-2 font-bold">
        {field.label}
      </p>
    </div>
  );
}

/* ───────── Style helpers ───────── */

function sectionWrapperBg(v: Variant) {
  if (v === "dark") return "bg-black";
  if (v === "heritage") return "bg-[#f5e9d0]/40";
  if (v === "editorial") return "bg-gray-50 border-y border-gray-200";
  return "bg-gray-50/50";
}
function headerAlign(v: Variant) {
  return v === "editorial" || v === "heritage" ? "text-center" : "text-left";
}
function eyebrowClass(v: Variant) {
  if (v === "dark")
    return "text-[10px] uppercase tracking-[0.3em] text-[var(--primary)] font-bold mb-2";
  if (v === "heritage")
    return "text-xs uppercase tracking-[0.3em] text-[var(--primary)] font-bold mb-3";
  if (v === "editorial")
    return "text-xs uppercase tracking-[0.3em] text-[var(--secondary)] font-bold mb-2";
  return "text-xs uppercase tracking-[0.2em] text-[var(--primary)] font-bold mb-2";
}
function titleClass(v: Variant) {
  if (v === "dark")
    return "text-3xl md:text-4xl font-bold text-white tracking-tight";
  if (v === "heritage")
    return "text-3xl md:text-4xl font-bold text-[var(--secondary)]";
  if (v === "editorial")
    return "text-3xl md:text-4xl font-bold text-gray-900";
  return "text-2xl md:text-3xl font-bold text-gray-900 tracking-tight";
}
