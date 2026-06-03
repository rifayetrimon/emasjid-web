import Image from "@/components/ui/FallbackImage";
import { Heart, ArrowRight } from "lucide-react";
import type { DonationConfig } from "@/types/cms";

interface Props {
  donation: DonationConfig;
  /** Optional collected amount for the progress bar. */
  collected?: number;
}

function formatMyr(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "RM0";
  return `RM${new Intl.NumberFormat("en-MY").format(Math.round(n))}`;
}

/**
 * Demo7-styled donation block. Soft pastel background, rounded card, big
 * progress ring, gradient CTA. Returns null when admin has disabled it.
 */
export default function Demo7DonationBlock({
  donation,
  collected = 0,
}: Props) {
  if (!donation.enabled) return null;
  const target = donation.target;
  const pct =
    target > 0 ? Math.min(100, Math.max(0, (collected / target) * 100)) : 0;

  const adminBg = donation.tickerBackgroundColor;
  const adminText =
    donation.tickerTextColor || donation.textColor || undefined;

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl -z-10" />

      <div className="max-w-4xl mx-auto">
        <div
          className="relative rounded-[40px] p-8 md:p-12 overflow-hidden shadow-xl border-4 border-white"
          style={{
            backgroundColor: adminBg || "#0c3d3c",
            color: adminText,
          }}
        >
          {donation.backgroundImage && (
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <Image
                src={donation.backgroundImage}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          )}

          <div className="relative text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs uppercase tracking-[0.2em] font-bold mb-6">
              <Heart className="w-3.5 h-3.5" />
              Sumbangan
            </span>

            {donation.title && (
              <h2
                className="text-3xl md:text-4xl font-bold mb-5 tracking-tight"
                style={{
                  color:
                    donation.tickerColor ||
                    donation.textColor ||
                    undefined,
                }}
              >
                {donation.title}
              </h2>
            )}

            {target > 0 && (
              <>
                <p className="text-base md:text-lg mb-6 font-semibold">
                  {formatMyr(collected)}{" "}
                  <span className="opacity-60">/ {formatMyr(target)}</span>
                </p>
                <div className="max-w-2xl mx-auto h-4 bg-white/20 rounded-full overflow-hidden mb-8">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor:
                        donation.progressBarColor || "#fbbe21",
                    }}
                  />
                </div>
              </>
            )}

            {donation.buttonTitle && (
              <a
                href={donation.buttonUrl || "#"}
                target={donation.buttonUrl ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all"
                style={{
                  backgroundColor:
                    donation.buttonColor || "#fbbe21",
                  color: donation.textColor || "#111827",
                }}
              >
                {donation.buttonTitle}
                <ArrowRight className="w-4 h-4" />
              </a>
            )}

            {donation.leaderboardEnabled && donation.leaderboardTitle && (
              <p
                className="mt-6 text-xs uppercase tracking-[0.2em] font-semibold opacity-80"
                style={{ color: donation.leaderboardColor || undefined }}
              >
                {donation.leaderboardTitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
