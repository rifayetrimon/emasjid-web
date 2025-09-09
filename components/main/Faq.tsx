"use client";

import { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { FAQProps } from "@/types/cms";
import { assetPath } from "@/lib/assetPath";

export default function Faq({ faq }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faq || !faq.items || faq.items.length === 0) return null;

  const handleClose = () => setOpenIndex(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (openIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [openIndex]);

  return (
    <div
      className="relative bg-cover bg-center py-16 px-4"
      style={{
        backgroundImage: `url(${assetPath(faq.background_image ?? "")})`,
      }}
    >
      {/* Section Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[var(--secondary)]">
        {faq.title}
      </h2>

      {/* FAQ Grid */}
      <div
        className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 ${
          faq.items.length > 10 ? "overflow-y-auto" : ""
        }`}
        style={{
          maxHeight: faq.items.length > 10 ? "600px" : "none",
        }}
      >
        {faq.items.map((item, i) => (
          <div key={i} className="w-full">
            <button
              onClick={() => setOpenIndex(i)}
              className="group w-full text-left flex items-center justify-between bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#0C9F77]"
            >
              <div className="pr-4">
                <h3 className="text-base md:text-lg font-semibold text-black mb-1">
                  {item.question}
                </h3>
                <p className="text-sm text-gray-600">{item.text}</p>
              </div>
              <FaPlay className="text-sm text-gray-400 group-hover:text-[#0C9F77]" />
            </button>
          </div>
        ))}
      </div>

      {/* Drawer */}
      {openIndex !== null && (
        <>
          {/* Overlay */}
          <div
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Drawer */}
          <div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-50 p-6 animate-slideUp"
            style={{
              height: "calc(50vh)",
              maxHeight: "55vh",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {faq.items[openIndex].question}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-800 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Scrollable Answer (with HTML support) */}
            <div
              className="faq-answer overflow-y-auto max-h-[calc(100%-40px)] pr-2 text-gray-700"
              dangerouslySetInnerHTML={{
                __html: faq.items[openIndex].answer,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
