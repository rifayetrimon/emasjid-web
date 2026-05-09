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

export default function Demo5Faq({ title, items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  if (items.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-[#fdfaf3] relative">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='%230c3d3c' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-16 bg-[var(--primary)]" />
            <svg width="20" height="20" viewBox="0 0 20 20" className="text-[var(--primary)]">
              <path
                d="M10 1 L13 7 L19 8 L14.5 12.5 L16 19 L10 16 L4 19 L5.5 12.5 L1 8 L7 7 Z"
                fill="currentColor"
              />
            </svg>
            <div className="h-[1px] w-16 bg-[var(--primary)]" />
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--primary)] mb-3 font-bold">
            Pertanyaan Umum
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-[var(--secondary)]"
            style={{ fontFamily: "'Times New Roman', serif" }}
          >
            {title || "Soalan Lazim"}
          </h2>
        </div>

        <div className="space-y-4">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`relative border-2 transition-all ${
                  isOpen
                    ? "border-[var(--primary)] bg-white shadow-lg"
                    : "border-[#d4b88a]/50 bg-white/50 hover:border-[#d4b88a]"
                }`}
                style={{
                  clipPath:
                    "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span
                      className="text-2xl text-[var(--primary)] font-bold flex-shrink-0"
                      style={{ fontFamily: "'Times New Roman', serif" }}
                    >
                      {String(i + 1).padStart(2, "0")}.
                    </span>
                    <h3
                      className="text-base md:text-lg font-bold text-[var(--secondary)]"
                      style={{ fontFamily: "'Times New Roman', serif" }}
                    >
                      {item.question}
                    </h3>
                  </div>
                  <span
                    className={`flex-shrink-0 w-8 h-8 flex items-center justify-center text-[var(--primary)] transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M5 8 L10 13 L15 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6">
                    <div className="h-[1px] w-full bg-[#d4b88a]/50 mb-4" />
                    <div
                      className="text-sm text-[var(--secondary)]/80 leading-relaxed faq-answer pl-12"
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
