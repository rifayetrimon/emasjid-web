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
}

const ITEMS = (s: VisitorStats) => [
  { label: "Jumlah", value: s.total },
  { label: "Hari Ini", value: s.today },
  { label: "Kelmarin", value: s.yesterday },
  { label: "Bulan Ini", value: s.thisMonth },
  { label: "Bulan Lepas", value: s.lastMonth },
];

export default function VisitorList({
  stats,
  tone = "dark",
  titleClass,
  align = "right",
}: Props) {
  const items = ITEMS(stats);
  const labelColor = tone === "dark" ? "text-white" : "text-gray-900";
  const isRight = align === "right";

  return (
    <div className={isRight ? "text-right" : "text-left"}>
      <h4
        className={
          titleClass ||
          `text-2xl font-extrabold uppercase tracking-wider mb-4 ${labelColor}`
        }
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
            <span className={`${labelColor} font-medium`}>{item.label}</span>
            <span className={`${labelColor} font-medium`}>:</span>
            <span className="text-[var(--primary)] font-semibold tabular-nums">
              <AnimatedCount value={item.value} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
