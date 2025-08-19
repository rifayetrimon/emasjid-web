"use client";

import { useContext, useState } from "react";
import { CMSContext } from "@/app/providers/cmsProvider";

export default function Faq() {
  const cms = useContext(CMSContext);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!cms) return null;

  return (
    <section className="py-20 px-6 md:px-20">
      <h2 className="text-3xl font-bold text-center mb-12">
        {cms.content.faq.title}
      </h2>

      <div className="max-w-3xl mx-auto space-y-4">
        {cms.content.faq.items.map((item, i) => (
          <div key={i} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex justify-between items-center px-6 py-4 font-semibold text-left bg-gray-100 hover:bg-gray-200"
            >
              {item.question}
              <span>{openIndex === i ? "−" : "+"}</span>
            </button>

            {openIndex === i && (
              <div className="px-6 py-4 text-gray-700">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// "use client";

// import { FaPlay } from "react-icons/fa";

// const questions = [
//   {
//     title: "Maklumat Umum",
//     description: "Briefly talk about your firm's services here.",
//   },
//   {
//     title: "Permohonan eMasjid",
//     description: "Briefly talk about your firm's services here.",
//   },
//   {
//     title: "Proses Permohonan",
//     description: "Briefly talk about your firm's services here.",
//   },
//   {
//     title: "Bantuan Teknikal",
//     description: "Briefly talk about your firm's services here.",
//   },
//   {
//     title: "Membaharui eMasjid",
//     description: "Briefly talk about your firm's services here.",
//   },
//   {
//     title: "Perakuan eMasjid",
//     description: "Briefly talk about your firm's services here.",
//   },
//   {
//     title: "Penarikan Balik eMasjid",
//     description: "Briefly talk about your firm's services here.",
//   },
//   {
//     title: "Kewajipan Pengguna",
//     description: "Briefly talk about your firm's services here.",
//   },
// ];

// export default function Faq() {
//   return (
//     <div
//       className="relative bg-cover bg-center py-16 px-4"
//       style={{
//         backgroundImage: "url('/images/soalan/bg.png')",
//       }}
//     >
//       <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
//         Soalan Lazim
//       </h2>

//       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
//         {questions.map((item, index) => (
//           <button
//             key={index}
//             className="group w-full text-left flex items-center justify-between bg-white p-6 rounded-lg shadow-md hover:shadow-lg active:shadow-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#0C9F77]"
//           >
//             <div className="pr-4">
//               <h3 className="text-base md:text-lg font-semibold text-black mb-1">
//                 {item.title}
//               </h3>
//               <p className="text-sm text-gray-600">{item.description}</p>
//             </div>

//             <FaPlay className="text-sm text-gray-400 group-hover:text-[#0C9F77] group-active:text-[#0C9F77] group-focus-within:text-[#0C9F77] transition-colors duration-300" />
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
