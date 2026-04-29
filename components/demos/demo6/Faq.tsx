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

export default function Demo6Faq({ title, items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  if (items.length === 0) return null;

  return (
    <section className="bg-white border-y-[3px] border-black">
      <div className="grid lg:grid-cols-12">
        <div className="lg:col-span-4 border-r-0 lg:border-r-[3px] border-black p-8 md:p-12 bg-yellow-400">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] mb-4 font-bold">
            §{String(items.length).padStart(2, "0")} / Soalan
          </p>
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-black">
            {title || "Soalan Lazim"}
          </h2>
          <div className="mt-8 font-mono text-xs leading-relaxed text-black/70 max-w-xs">
            <p>{"// Kompilasi soalan yang sering ditanya."}</p>
            <p>{"// Klik untuk membuka jawapan penuh."}</p>
          </div>
        </div>

        <div className="lg:col-span-8">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`border-b-[3px] border-black last:border-b-0 ${
                  isOpen ? "bg-black text-white" : "bg-white"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full grid grid-cols-12 gap-4 items-center px-6 md:px-10 py-6 text-left"
                >
                  <span className="col-span-2 md:col-span-1 text-2xl font-mono font-bold tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="col-span-9 md:col-span-10 text-xl md:text-2xl font-black uppercase tracking-tight leading-tight">
                    {item.question}
                  </h3>
                  <span
                    className={`col-span-1 text-3xl font-light text-right transition-transform ${
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
                  <div className="px-6 md:px-10 pb-8 grid grid-cols-12 gap-4">
                    <div className="col-span-2 md:col-span-1" />
                    <div
                      className="col-span-10 md:col-span-10 text-sm leading-relaxed faq-answer"
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
