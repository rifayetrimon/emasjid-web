"use client";

import { FaPlay } from "react-icons/fa";

const questions = [
  {
    title: "Maklumat Umum",
    description: "Briefly talk about your firm's services here.",
  },
  {
    title: "Permohonan eMasjid",
    description: "Briefly talk about your firm's services here.",
  },
  {
    title: "Proses Permohonan",
    description: "Briefly talk about your firm's services here.",
  },
  {
    title: "Bantuan Teknikal",
    description: "Briefly talk about your firm's services here.",
  },
  {
    title: "Membaharui eMasjid",
    description: "Briefly talk about your firm's services here.",
  },
  {
    title: "Perakuan eMasjid",
    description: "Briefly talk about your firm's services here.",
  },
  {
    title: "Penarikan Balik eMasjid",
    description: "Briefly talk about your firm's services here.",
  },
  {
    title: "Kewajipan Pengguna",
    description: "Briefly talk about your firm's services here.",
  },
];

export default function Faq() {
  return (
    <div
      className="relative bg-cover bg-center py-16 px-4"
      style={{
        backgroundImage: "url('/images/soalan/bg.png')",
      }}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
        Soalan Lazim
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {questions.map((item, index) => (
          <button
            key={index}
            className="group w-full text-left flex items-center justify-between bg-white p-6 rounded-lg shadow-md hover:shadow-lg active:shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#0C9F77]"
          >
            <div className="pr-4">
              <h3 className="text-base md:text-lg font-semibold text-black mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>

            <FaPlay className="text-sm text-gray-400 group-hover:text-[#0C9F77] group-active:text-[#0C9F77] group-focus-within:text-[#0C9F77] transition-colors duration-300" />
          </button>
        ))}
      </div>
    </div>
  );
}
