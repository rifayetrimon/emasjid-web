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

export default function Demo3Faq({ title, items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  if (items.length === 0) return null;

  return (
    <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--secondary)]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 text-xs uppercase tracking-wider font-semibold text-gray-700 mb-5">
            Pusat Bantuan
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            {title || "Soalan Lazim"}
          </h2>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? "bg-white shadow-xl border-white"
                    : "bg-white/50 backdrop-blur-md border-white/80 hover:bg-white/70"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-base md:text-lg font-semibold text-gray-900 flex-1">
                    {item.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isOpen
                        ? "bg-[var(--primary)] text-white rotate-180"
                        : "bg-gray-100 text-gray-600"
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
                  <div
                    className="px-6 pb-6 text-sm text-gray-600 leading-relaxed faq-answer border-t border-gray-100 pt-4"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
