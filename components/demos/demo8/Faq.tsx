"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  text?: string;
  answer: string;
}

interface Props {
  title: string;
  items: FAQItem[];
}

export default function Demo8Faq({ title, items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  if (items.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[var(--primary)]/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 text-xs uppercase tracking-[0.25em] font-semibold text-[var(--primary)] mb-5">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
            {title || "Soalan Lazim"}
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Jawapan kepada perkara yang ramai bertanya.
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? "bg-zinc-900 border-[var(--primary)]/40"
                    : "bg-zinc-950 border-white/5 hover:border-white/15"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left"
                >
                  <span className="text-[var(--primary)] font-bold text-sm tabular-nums w-8">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="flex-1 text-base md:text-lg font-semibold text-white">
                    {item.question}
                  </h3>
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isOpen
                        ? "bg-[var(--primary)] text-black rotate-180"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6 pl-18" style={{ paddingLeft: "76px" }}>
                    <div className="h-[1px] bg-white/10 mb-4" />
                    <div
                      className="text-sm text-white/70 leading-relaxed faq-answer"
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
