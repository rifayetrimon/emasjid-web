import Image from "@/components/ui/FallbackImage";
import type { DonationConfig } from "@/types/cms";

interface Props {
  donation: DonationConfig;
  /** Optional collected amount for the progress bar (admin doesn't supply it yet). */
  collected?: number;
}

function formatMyr(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "RM0";
  return `RM${new Intl.NumberFormat("en-MY").format(Math.round(n))}`;
}

export default function Blog2DonationBlock({ donation, collected = 0 }: Props) {
  if (!donation.enabled) return null;
  const target = donation.target;
  const pct =
    target > 0 ? Math.min(100, Math.max(0, (collected / target) * 100)) : 0;

  return (
    <section
      className="relative px-6 py-12"
      style={{
        backgroundColor: donation.tickerBackgroundColor || "#0c3d3c",
        color: donation.tickerTextColor || donation.textColor || "#ffffff",
      }}
    >
      {donation.backgroundImage && (
        <div className="absolute inset-0 -z-0 opacity-20 pointer-events-none">
          <Image
            src={donation.backgroundImage}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}
      <div className="relative max-w-5xl mx-auto text-center">
        {donation.title && (
          <h2
            className="text-2xl md:text-3xl font-extrabold mb-3"
            style={{ color: donation.tickerColor || donation.textColor || undefined }}
          >
            {donation.title}
          </h2>
        )}

        {target > 0 && (
          <p className="text-sm md:text-base mb-5">
            {formatMyr(collected)} / {formatMyr(target)}
          </p>
        )}

        {target > 0 && (
          <div className="max-w-2xl mx-auto h-3 bg-white/20 rounded-full overflow-hidden mb-6">
            <div
              className="h-full transition-all"
              style={{
                width: `${pct}%`,
                backgroundColor: donation.progressBarColor || "#fbbe21",
              }}
            />
          </div>
        )}

        {donation.buttonTitle && (
          <a
            href={donation.buttonUrl || "#"}
            target={donation.buttonUrl ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider transition hover:opacity-90"
            style={{
              backgroundColor: donation.buttonColor || "#fbbe21",
              color: donation.textColor || "#111827",
            }}
          >
            {donation.buttonTitle}
          </a>
        )}

        {donation.leaderboardEnabled && donation.leaderboardTitle && (
          <p
            className="mt-6 text-xs uppercase tracking-[0.2em]"
            style={{ color: donation.leaderboardColor || undefined }}
          >
            {donation.leaderboardTitle}
          </p>
        )}
      </div>
    </section>
  );
}
