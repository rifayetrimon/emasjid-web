"use client";

import { useState } from "react";
import { HelpCircle, Lightbulb, ShieldCheck, Settings } from "lucide-react";

interface FAQItem {
  question: string;
  text?: string;
  answer: string;
}

interface Props {
  title: string;
  items: FAQItem[];
}

const ICONS = [HelpCircle, Lightbulb, ShieldCheck, Settings];

export default function Demo4Faq({ title, items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  if (items.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <span className="inline-block px-3 py-1 rounded-md bg-gray-900 text-white text-xs font-bold uppercase tracking-wider mb-5">
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                {title || "Soalan Lazim"}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Cari jawapan kepada soalan yang sering ditanya tentang sistem
                dan perkhidmatan kami.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <p className="text-2xl font-bold text-gray-900">
                    {items.length}+
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Soalan</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                  <p className="text-2xl font-bold text-[var(--primary)]">
                    24/7
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Sokongan</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-2">
            {items.map((item, i) => {
              const isOpen = openIndex === i;
              const Icon = ICONS[i % ICONS.length];
              return (
                <div
                  key={i}
                  className={`rounded-2xl border transition-all ${
                    isOpen
                      ? "bg-white border-gray-200 shadow-sm"
                      : "bg-white border-transparent hover:border-gray-200"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center gap-4 px-5 py-5 text-left"
                  >
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isOpen
                          ? "bg-[var(--primary)] text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-lg font-bold text-gray-900">
                        {item.question}
                      </h3>
                      {item.text && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.text}
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-2xl text-gray-400 transition-transform ${
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
                      className="px-5 pb-5 ml-15 text-sm text-gray-600 leading-relaxed faq-answer pl-15"
                      style={{ paddingLeft: "60px" }}
                      dangerouslySetInnerHTML={{ __html: item.answer }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
