"use client";

import { useState } from "react";
import { FAQProps } from "@/types/cms";

export default function FaqClient({ faq }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faq || !faq.items || faq.items.length === 0) {
    console.warn("⚠️ FAQ: No FAQ items provided");
    return null;
  }

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  // Split items into left and right columns
  const half = Math.ceil(faq.items.length / 2);
  const leftItems = faq.items.slice(0, half);
  const rightItems = faq.items.slice(half);

  const renderItem = (item: typeof faq.items[0], index: number) => {
    const isOpen = openIndex === index;

    return (
      <div key={index}>
        <button
          onClick={() => toggle(index)}
          className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg px-5 py-4 transition-colors duration-200 text-left"
        >
          <span className="text-sm md:text-base font-medium text-gray-800 pr-4">
            {item.question}
          </span>
          <span
            className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-500 transition-transform duration-300 ${
              isOpen ? "rotate-45" : ""
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </span>
        </button>

        {/* Answer - collapsible */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div
            className="px-5 py-4 text-sm text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: item.answer }}
          />
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 px-6 bg-white" id="faq">
      {/* Title */}
      {faq.title && (
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900">
          {faq.title}
        </h2>
      )}

      {/* 2-column grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
        {/* Left column */}
        <div className="space-y-3">
          {leftItems.map((item, i) => renderItem(item, i))}
        </div>

        {/* Right column */}
        <div className="space-y-3">
          {rightItems.map((item, i) => renderItem(item, i + half))}
        </div>
      </div>
    </section>
  );
}
