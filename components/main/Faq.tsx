"use client";

import { useContext, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { CMSContext } from "@/app/providers/cmsProvider";

export default function Faq() {
  const cms = useContext(CMSContext);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!cms) return null;

  const handleClose = () => setOpenIndex(null);

  return (
    <div
      className="relative bg-cover bg-center py-16 px-4"
      style={{
        backgroundImage: "url('/images/soalan/bg.png')",
      }}
    >
      {/* Section Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[var(--secondary)]">
        {cms.content.faq.title}
      </h2>

      {/* FAQ Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {cms.content.faq.items.map((item, i) => (
          <div key={i} className="w-full">
            {/* Card Button */}
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
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-50 p-6 animate-slideUp h-1/3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {cms.content.faq.items[openIndex].question}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-800 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto h-full pr-2">
              <p className="text-gray-700">
                {cms.content.faq.items[openIndex].answer}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Drawer Animation */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
