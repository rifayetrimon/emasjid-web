"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface FAQItem {
  question: string;
  text?: string;
  answer: string;
}

interface Props {
  title: string;
  items: FAQItem[];
}

export default function Demo2Faq({ title, items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (items.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--secondary)] mb-3 font-bold">
            Bantuan
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {title || "Soalan Lazim"}
          </h2>
          <div className="w-16 h-[2px] bg-[var(--secondary)] mx-auto" />
        </div>

        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="border border-gray-200 hover:border-gray-400 transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <span
                      className="text-xs font-bold text-[var(--secondary)] mt-1.5 tabular-nums"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-gray-900">
                        {item.question}
                      </h3>
                      {item.text && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.text}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`flex-shrink-0 w-8 h-8 flex items-center justify-center border border-gray-300 transition-transform ${
                      isOpen ? "rotate-45 bg-gray-900 text-white border-gray-900" : "text-gray-700"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div
                    className="px-6 pb-6 pl-16 text-sm text-gray-600 leading-relaxed faq-answer"
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
