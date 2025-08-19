"use client";

import { useContext } from "react";
import { CMSContext } from "@/app/providers/cmsProvider";
import Image from "next/image";

export default function Banner() {
  const cms = useContext(CMSContext);
  if (!cms?.content?.banner) return null;

  const { title, supporting_text, buttons, background_image, logo } =
    cms.content.banner;

  return (
    <section
      className="relative w-full h-[90vh] flex flex-col justify-center items-center text-center text-white"
      style={{
        backgroundImage: `url(${background_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {logo && (
        <div className="mb-6 animate-bounce">
          <Image
            src={logo}
            alt="icon"
            width={64}
            height={64}
            className="w-16 h-16 object-contain"
            priority
          />
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        {title.general}{" "}
        <a href={title.focus.link} className="text-[var(--primary)] underline">
          {title.focus.text}
        </a>
      </h1>

      {/* Supporting text */}
      <p className="max-w-2xl text-lg mb-6">{supporting_text}</p>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        {buttons?.map((btn, i) => (
          <a
            key={i}
            href={btn.link}
            className="px-6 py-3 rounded-lg font-medium border-1 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
          >
            {btn.label}
          </a>
        ))}
      </div>
    </section>
  );
}

// import { assetPath } from "@/lib/assetPath";
// import Image from "next/image";

// export default function Banner() {
//   return (
//     <div
//       className="relative min-h-[600px] md:min-h-[700px] bg-cover bg-center"
//       style={{
//         backgroundImage: `url('${assetPath("/images/banner/bg.png")}')`,
//       }}
//     >
//       {/* Semi-transparent black overlay */}
//       <div className="absolute inset-0 bg-black opacity-50 pointer-events-none"></div>

//       {/* Content Wrapper */}
//       <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 py-12">
//         {/* Logo Icon */}
//         <Image
//           src={assetPath("/images/banner/icon.png")}
//           alt="Masjid Logo"
//           width={100}
//           height={100}
//           className="mb-6 pt-16"
//         />

//         {/* Main Title */}
//         <h1 className="text-3xl md:text-4xl font-bold text-center leading-snug">
//           Selamat Datang ke Portal <span className="text-blue-500">e</span>
//           <span className="text-green-600 text-4xl md:text-5xl">Masjid</span>
//         </h1>

//         {/* Description */}
//         <p className="mt-4 text-center text-base md:text-lg max-w-2xl">
//           Maklumat ini disediakan sebagai panduan kepada mana-mana orang yang
//           ingin membuat permohonan menggunakan Sistem Pengurusan Smart Masjid
//           MAIS
//         </p>

//         {/* Buttons Row */}
//         <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6">
//           <button className="px-6 py-2 border rounded text-white border-[#0C9F77] transition duration-200 ease-in-out hover:bg-[#0C9F77] focus:bg-[#0C9F77] active:bg-[#0C9F77]">
//             LOG MASUK
//           </button>
//           <button className="px-6 py-2 border rounded text-white border-[#0C9F77] transition duration-200 ease-in-out hover:bg-[#0C9F77] focus:bg-[#0C9F77] active:bg-[#0C9F77]">
//             KEMASKINI PERMOHONAN
//           </button>
//           <button className="px-6 py-2 border rounded text-white border-[#0C9F77] transition duration-200 ease-in-out hover:bg-[#0C9F77] focus:bg-[#0C9F77] active:bg-[#0C9F77]">
//             PERMOHONAN BARU
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
