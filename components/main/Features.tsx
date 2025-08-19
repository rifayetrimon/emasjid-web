"use client";

import { useContext } from "react";
import Image from "next/image";
import { CMSContext } from "@/app/providers/cmsProvider";
import { CMSData } from "@/types/cms";

export default function Features() {
  const cms = useContext<CMSData | null>(CMSContext);

  if (!cms || !cms.content?.fetures?.items) return null;

  return (
    <section className="py-20 px-6 md:px-20 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-12 text-[var(--secondary)]">
        {cms.content.fetures.title}
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cms.content.fetures.items.map((feature, index) => (
          <div
            key={index}
            className="p-6 text-center bg-white rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="w-12 h-12 mx-auto mb-4 relative">
              <Image
                src={feature.icon}
                alt={feature.title}
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// "use client";

// import { assetPath } from "@/lib/assetPath";
// import { JSX, useState } from "react";
// import Image from "next/image";

// // Define the type for a single feature item
// type FeatureItem = {
//   id: number;
//   icon: string;
//   title: string;
//   text: JSX.Element;
// };

// export default function Fetures() {
//   const [activeIndex, setActiveIndex] = useState<number | null>(null);

//   const features: FeatureItem[] = [
//     {
//       id: 1,
//       icon: assetPath("/icons/cloud.svg"),
//       title: "Selamat & Terjamin",
//       text: (
//         <>
//           Data pengguna dilindungi <br /> dengan selamat
//         </>
//       ),
//     },
//     {
//       id: 2,
//       icon: assetPath("/icons/profile.svg"),
//       title: "Mesra Pengguna",
//       text: (
//         <>
//           Akses lancar melalui <br /> telefon & tablet
//         </>
//       ),
//     },
//     {
//       id: 3,
//       icon: assetPath("/icons/time.svg"),
//       title: "Akses 24/7",
//       text: (
//         <>
//           Boleh digunakan <br /> bila-bila masa
//         </>
//       ),
//     },
//     {
//       id: 4,
//       icon: assetPath("/icons/pc.svg"),
//       title: "Kemaskini Automatik",
//       text: (
//         <>
//           Pengawasan berterusan oleh <br /> MAIS
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="bg-[#F1F1F1] py-16 px-4">
//       <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-[#21536E]">
//         Kelebihan e-Masjid
//       </h2>

//       <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-[#21536E]">
//         {features.map((item) => {
//           const isActive = activeIndex === item.id;
//           return (
//             <div
//               key={item.id}
//               className="group flex flex-col items-center text-center sm:text-left cursor-pointer"
//               onMouseEnter={() => setActiveIndex(item.id)}
//               onMouseLeave={() => setActiveIndex(null)}
//               onTouchStart={() => setActiveIndex(item.id)}
//             >
//               <Image
//                 src={item.icon}
//                 alt="Icon"
//                 className="w-20 h-20 object-contain mb-4"
//                 width={80}
//                 height={80}
//               />

//               <div className="relative w-40 h-1 mb-4">
//                 <div
//                   className={`absolute inset-0 transition-colors duration-500 ${
//                     isActive ? "bg-[#0C9F77]" : "bg-black"
//                   }`}
//                 />
//                 <span
//                   className={`absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 rounded-full transition-all duration-500 ${
//                     isActive
//                       ? "left-[calc(100%-12px)] bg-[#0C9F77]"
//                       : "bg-black"
//                   }`}
//                 />
//               </div>

//               <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2">
//                 {item.title}
//               </h3>
//               <p className="text-sm sm:text-base leading-relaxed">
//                 {item.text}
//               </p>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
