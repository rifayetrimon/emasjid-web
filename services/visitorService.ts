import { getCachedVisitors } from "./apiCache";

export interface VisitorStats {
  total: number;
  today: number;
  yesterday: number;
  thisMonth: number;
  lastMonth: number;
}

export const EMPTY_VISITOR_STATS: VisitorStats = {
  total: 0,
  today: 0,
  yesterday: 0,
  thisMonth: 0,
  lastMonth: 0,
};

export async function getVisitorStats(): Promise<VisitorStats> {
  try {
    const data = await getCachedVisitors();
    return {
      total: Number(data?.total ?? 0),
      today: Number(data?.today ?? 0),
      yesterday: Number(data?.yesterday ?? 0),
      thisMonth: Number(data?.thisMonth ?? 0),
      lastMonth: Number(data?.lastMonth ?? 0),
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
