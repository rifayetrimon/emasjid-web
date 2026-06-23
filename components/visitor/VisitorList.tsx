import AnimatedCount from "./AnimatedCount";
import type { VisitorStats } from "@/services/visitorService";

interface Props {
  stats: VisitorStats;
  /** Visual tone — "dark" for dark footers (white labels), "light" for light footers. */
  tone?: "dark" | "light";
  /** Optional class for the section title (override font, size, etc.). */
  titleClass?: string;
  /** Content alignment within the block. Defaults to "right" for footer placement. */
  align?: "left" | "right";
  /** Explicit text colour for the title/labels (e.g. the footer area text
   *  colour). When set it overrides the tone's default label colour. */
  color?: string;
}

// Mirrors the four time windows the visitors API returns today. When the
// backend adds a per-day "today" field we'll slot a "Hari Ini" row back in
// after the Jumlah row.
const ITEMS = (s: VisitorStats) => [
  { label: "Jumlah", value: s.total },
  { label: "7 Hari", value: s.lastWeek },
  { label: "30 Hari", value: s.lastMonth },
  { label: "365 Hari", value: s.lastYear },
];

export default function VisitorList({
  stats,
  tone = "dark",
  titleClass,
  align = "right",
  color,
}: Props) {
  const items = ITEMS(stats);
  const labelColor = tone === "dark" ? "text-white" : "text-gray-900";
  const isRight = align === "right";
  // When the footer area text colour is configured, it overrides the tone's
  // default (white/black) for the title, labels and colon. Inline style wins
  // over the Tailwind colour class, so the class stays as a fallback.
  const textStyle = color ? { color } : undefined;

  return (
    <div className={isRight ? "text-right" : "text-left"}>
      <h4
        className={
          titleClass ||
          `text-2xl font-extrabold uppercase tracking-wider mb-4 ${labelColor}`
        }
        style={textStyle}
      >
        Pengunjung
      </h4>
      <div
        className={`h-1 w-14 bg-[var(--primary)] rounded-full mb-7 ${
          isRight ? "ml-auto" : ""
        }`}
      />
      <ul className="space-y-3.5 text-[15px]">
        {items.map((item) => (
          <li
            key={item.label}
            className={`flex items-baseline gap-2 ${
              isRight ? "justify-end" : "justify-start"
            }`}
          >
            <span className={`${labelColor} font-medium`} style={textStyle}>
              {item.label}
            </span>
            <span className={`${labelColor} font-medium`} style={textStyle}>
              :
            </span>
            <span className="text-[var(--primary)] font-semibold tabular-nums">
              <AnimatedCount value={item.value} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
