import { assetPath } from "@/lib/assetPath";
import Image from "next/image";

export default function footer() {
  return (
    <footer className="bg-[#164776] text-white py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Left: Image - Centered on mobile */}
        <div className="w-full md:w-auto flex justify-center md:justify-start">
          <Image
            src={assetPath("/images/banner/icon.png")}
            alt="Footer Icon"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>

        {/* Right: Line + Text Content */}
        <div className="flex w-full md:w-auto gap-6 items-start md:items-stretch justify-between md:justify-start">
          {/* Vertical Line (hidden on mobile) */}
          <div className="hidden md:block w-[2px] bg-white" />

          {/* Text & Social Icons */}
          <div className="text-left w-full">
            <h3 className="text-2xl font-semibold">
              Majlis Agama Islam Selangor (MAIS)
            </h3>

            <p className="text-base text-gray-200 mt-4 leading-relaxed">
              Urus setia Jawatankuasa Bahagian <br />
              Pengurusan Masjid
            </p>

            <p className="text-base text-gray-200 mt-4 leading-relaxed">
              Jabatan Agama Islam Selangor, Aras 7, <br />
              Menara Selatan, Bangunan Sultan Idris Shah, <br />
              40000, Shah Alam, Selangor
            </p>

            <a
              href="tel:+60355143512"
              className="block text-base text-gray-200 mt-4"
            >
              Phone Number : +603-5514 3512 / 3513
            </a>
            <a
              href="mailto:tauliah@mais.gov.my"
              className="block text-base text-gray-200 mt-1"
            >
              e-mel : tauliah@mais.gov.my
            </a>

            {/* Social Icons */}
            <div className="flex gap-5 mt-5 text-xl">
              <a href="#" aria-label="Facebook">
                <Image
                  src={assetPath("/icons/fb.svg")}
                  alt="Facebook"
                  width={24}
                  height={24}
                  className="hover:opacity-80 transition-opacity"
                />
              </a>
              <a href="#" aria-label="Instagram">
                <Image
                  src={assetPath("/icons/instagram.svg")}
                  alt="Instagram"
                  width={24}
                  height={24}
                  className="hover:opacity-80 transition-opacity"
                />
              </a>
              <a href="#" aria-label="X">
                <Image
                  src={assetPath("/icons/x.svg")}
                  alt="X"
                  width={24}
                  height={24}
                  className="hover:opacity-80 transition-opacity"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Centered Copyright */}
      <div className="mt-10 text-center text-sm text-gray-300">
        &copy; {new Date().getFullYear()} Hak Cipta Terpelihara © 2025 Awfatech
        Global Sdn Bhd Team.
      </div>
    </footer>
  );
}
