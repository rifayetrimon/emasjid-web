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

export default function Demo9Faq({ title, items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  if (items.length === 0) return null;

  return (
    <section className="py-16 border-t border-gray-100">
      <div className="max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-bold mb-2">
          §03
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
          {title || "Soalan Lazim"}
        </h2>
        <p className="text-gray-500 text-base mb-10">
          Rujukan untuk pertanyaan yang kerap berlaku.
        </p>

        <div className="divide-y divide-gray-100 border-y border-gray-100">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-4 py-5 text-left group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <span className="text-[11px] font-mono font-semibold text-gray-400 mt-1 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className={`text-base md:text-lg font-semibold transition-colors ${
                        isOpen
                          ? "text-gray-900"
                          : "text-gray-700 group-hover:text-gray-900"
                      }`}
                    >
                      {item.question}
                    </h3>
                  </div>
                  <span
                    className={`flex-shrink-0 text-gray-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
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
                    className="pb-6 pl-9 text-sm text-gray-600 leading-relaxed faq-answer"
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
