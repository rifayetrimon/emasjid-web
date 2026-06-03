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

export default function Blog2Faq({ title, items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  if (items.length === 0) return null;

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <SectionTitle label="FAQ">{title || "Soalan Lazim"}</SectionTitle>

        <div className="divide-y divide-gray-200 border-y border-gray-200">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-4 py-5 text-left group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <span className="text-sm font-bold text-[var(--primary)] tabular-nums pt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-base md:text-lg font-bold text-gray-900 leading-snug">
                      {item.question}
                    </h3>
                  </div>
                  <span
                    className={`flex-shrink-0 text-2xl text-gray-400 leading-none transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div
                    className="pb-6 pl-10 text-sm text-gray-600 leading-relaxed faq-answer"
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

function SectionTitle({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-center mb-10">
      <h2 className="inline-block text-xl md:text-2xl font-extrabold text-gray-900 uppercase tracking-wider border-b-4 border-[var(--primary)] pb-1">
        {label}
      </h2>
      <p className="mt-3 text-2xl md:text-3xl font-bold text-gray-900">{children}</p>
    </div>
  );
}
