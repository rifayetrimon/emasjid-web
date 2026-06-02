import { getCachedVisitors } from "./apiCache";

// Mirrors the four rolling windows the backend exposes plus a derived
// `today`. Fields named for the API so the wire format matches the
// rendered label.
export interface VisitorStats {
  total: number;
  today: number;
  lastWeek: number;
  lastMonth: number;
  lastYear: number;
}

export const EMPTY_VISITOR_STATS: VisitorStats = {
  total: 0,
  today: 0,
  lastWeek: 0,
  lastMonth: 0,
  lastYear: 0,
};

type SeriesPoint = { date?: string; visitors?: number };

function toNum(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export async function getVisitorStats(): Promise<VisitorStats> {
  try {
    const data = await getCachedVisitors();

    // `series.visitors.latest` is the most recent day in the rolling
    // series — the backend's authoritative "today" count. We fall back
    // to the last entry of `series.points` if the summary block is
    // absent, then to zero.
    const latestFromSummary = data?.series?.visitors?.latest;
    const points: SeriesPoint[] = Array.isArray(data?.series?.points)
      ? (data.series.points as SeriesPoint[])
      : [];
    const lastPoint = points.length ? points[points.length - 1] : undefined;
    const today =
      latestFromSummary != null
        ? toNum(latestFromSummary)
        : toNum(lastPoint?.visitors);

    return {
      total: toNum(data?.total),
      today,
      lastWeek: toNum(data?.lastWeek),
      lastMonth: toNum(data?.lastMonth),
      lastYear: toNum(data?.lastYear),
    };
  } catch {
    return EMPTY_VISITOR_STATS;
  }
}

/** Format a count with thousand separators; >999_999 becomes "1.2M". */
export function formatVisitorCount(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "0";
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}
