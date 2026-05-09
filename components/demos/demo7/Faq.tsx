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

const COLOR_TOKENS = [
  { bg: "bg-rose-100", text: "text-rose-600", ring: "ring-rose-300" },
  { bg: "bg-amber-100", text: "text-amber-600", ring: "ring-amber-300" },
  { bg: "bg-sky-100", text: "text-sky-600", ring: "ring-sky-300" },
  { bg: "bg-emerald-100", text: "text-emerald-600", ring: "ring-emerald-300" },
  { bg: "bg-violet-100", text: "text-violet-600", ring: "ring-violet-300" },
];

export default function Demo7Faq({ title, items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  if (items.length === 0) return null;

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 -right-32 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl -z-10" />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[var(--primary)]/20 text-xs uppercase tracking-wider font-semibold text-[var(--primary)] mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
            Bantuan
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
            {title || "Soalan Lazim"}
          </h2>
          <p className="text-gray-500 mt-4 text-base">
            Jawapan kepada perkara yang ramai bertanya.
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            const tone = COLOR_TOKENS[i % COLOR_TOKENS.length];
            return (
              <div
                key={i}
                className={`rounded-3xl bg-white p-1.5 transition-all ${
                  isOpen
                    ? `ring-2 ${tone.ring} shadow-xl`
                    : "border border-gray-100 hover:shadow-md"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left"
                >
                  <div
                    className={`w-10 h-10 rounded-2xl ${tone.bg} ${tone.text} flex items-center justify-center text-base font-bold flex-shrink-0`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <span className="text-base md:text-lg font-semibold text-gray-900 flex-1">
                    {item.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isOpen
                        ? `${tone.bg} ${tone.text} rotate-45`
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M7 1V13M1 7H13"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
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
                    className="px-5 pb-5 pt-1 pl-19 text-sm text-gray-600 leading-relaxed faq-answer"
                    style={{ paddingLeft: "75px" }}
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
