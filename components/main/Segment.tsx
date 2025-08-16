import { assetPath } from "@/lib/assetPath";
import Image from "next/image";

export default function Segment() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-6">
        {/* Left: Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src={assetPath("/images/about/about.png")}
            alt="About Us"
            width={350}
            height={250}
            className="rounded-lg shadow-md"
          />
        </div>

        {/* Right: Text and Button */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <p className="text-gray-700 text-xl mb-12">
            MAKLUMAN: Berkuat kuasa mulai 1 SEPTEMBER 2024, <br />
            permohonan baharu eMasjid MAIS akan dilaksanakan berdasarkan
            Peraturan-Peraturan berpandukan Majlis Agama Islam (Negeri Selangor)
            2025.
          </p>
          <button className="px-6 py-2 border border-[#0C9F77] rounded text-[#0C9F77] transition duration-200 ease-in-out hover:bg-[#0C9F77] hover:text-white focus:bg-[#0C9F77] focus:text-white active:bg-[#0C9F77] active:text-white">
            Lihat Selanjutnya
          </button>
        </div>
      </div>
    </section>
  );
}
