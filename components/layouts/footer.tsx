import { assetPath } from "@/lib/assetPath";
import Image from "next/image";

interface FooterProps {
  footer: {
    image: { image: string; link: string };
    footer_title: string;
    text: string;
    address: string;
    phone: string;
    email: string;
    social_links: { platform: string; link: string }[];
    copyright: string;
  };
}

export default function Footer({ footer }: FooterProps) {
  return (
    <footer className="bg-[#164776] text-white py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Left: Image */}
        <div className="w-full md:w-auto flex justify-center md:justify-start">
          <a href={footer.image.link}>
            <Image
              src={assetPath(footer.image.image)}
              alt="Footer Icon"
              width={150}
              height={150}
              className="object-contain"
            />
          </a>
        </div>

        {/* Right: Line + Text Content */}
        <div className="flex w-full md:w-auto gap-6 items-start md:items-stretch justify-between md:justify-start">
          {/* Vertical Line (hidden on mobile) */}
          <div className="hidden md:block w-[2px] bg-white" />

          {/* Text & Social Icons */}
          <div className="text-left w-full">
            <h3 className="text-2xl font-semibold">{footer.footer_title}</h3>

            <p className="text-base text-gray-200 mt-4 leading-relaxed">
              {footer.text}
            </p>

            <p className="text-base text-gray-200 mt-4 leading-relaxed">
              {footer.address}
            </p>

            <a
              href={`tel:${footer.phone}`}
              className="block text-base text-gray-200 mt-4"
            >
              Phone Number : {footer.phone}
            </a>
            <a
              href={`mailto:${footer.email}`}
              className="block text-base text-gray-200 mt-1"
            >
              e-mel : {footer.email}
            </a>

            {/* Social Icons */}
            <div className="flex gap-5 mt-5 text-xl">
              {footer.social_links.map((social, i) => (
                <a
                  key={i}
                  href={social.link}
                  aria-label={social.platform}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={assetPath(
                      `/icons/${social.platform.toLowerCase()}.svg`
                    )}
                    alt={social.platform}
                    width={24}
                    height={24}
                    className="hover:opacity-80 transition-opacity"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Centered Copyright */}
      <div className="mt-10 text-center text-sm text-gray-300">
        {footer.copyright}
      </div>
    </footer>
  );
}

// import { assetPath } from "@/lib/assetPath";
// import Image from "next/image";

// export default function footer() {
//   return (
//     <footer className="bg-[#164776] text-white py-10 px-6">
//       <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
//         {/* Left: Image - Centered on mobile */}
//         <div className="w-full md:w-auto flex justify-center md:justify-start">
//           <Image
//             src={assetPath("/images/banner/icon.png")}
//             alt="Footer Icon"
//             width={150}
//             height={150}
//             className="object-contain"
//           />
//         </div>

//         {/* Right: Line + Text Content */}
//         <div className="flex w-full md:w-auto gap-6 items-start md:items-stretch justify-between md:justify-start">
//           {/* Vertical Line (hidden on mobile) */}
//           <div className="hidden md:block w-[2px] bg-white" />

//           {/* Text & Social Icons */}
//           <div className="text-left w-full">
//             <h3 className="text-2xl font-semibold">
//               Majlis Agama Islam Selangor (MAIS)
//             </h3>

//             <p className="text-base text-gray-200 mt-4 leading-relaxed">
//               Urus setia Jawatankuasa Bahagian <br />
//               Pengurusan Masjid
//             </p>

//             <p className="text-base text-gray-200 mt-4 leading-relaxed">
//               Jabatan Agama Islam Selangor, Aras 7, <br />
//               Menara Selatan, Bangunan Sultan Idris Shah, <br />
//               40000, Shah Alam, Selangor
//             </p>

//             <a
//               href="tel:+60355143512"
//               className="block text-base text-gray-200 mt-4"
//             >
//               Phone Number : +603-5514 3512 / 3513
//             </a>
//             <a
//               href="mailto:tauliah@mais.gov.my"
//               className="block text-base text-gray-200 mt-1"
//             >
//               e-mel : tauliah@mais.gov.my
//             </a>

//             {/* Social Icons */}
//             <div className="flex gap-5 mt-5 text-xl">
//               <a href="#" aria-label="Facebook">
//                 <Image
//                   src={assetPath("/icons/fb.svg")}
//                   alt="Facebook"
//                   width={24}
//                   height={24}
//                   className="hover:opacity-80 transition-opacity"
//                 />
//               </a>
//               <a href="#" aria-label="Instagram">
//                 <Image
//                   src={assetPath("/icons/instagram.svg")}
//                   alt="Instagram"
//                   width={24}
//                   height={24}
//                   className="hover:opacity-80 transition-opacity"
//                 />
//               </a>
//               <a href="#" aria-label="X">
//                 <Image
//                   src={assetPath("/icons/x.svg")}
//                   alt="X"
//                   width={24}
//                   height={24}
//                   className="hover:opacity-80 transition-opacity"
//                 />
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Centered Copyright */}
//       <div className="mt-10 text-center text-sm text-gray-300">
//         &copy; {new Date().getFullYear()} Hak Cipta Terpelihara © 2025 Awfatech
//         Global Sdn Bhd Team.
//       </div>
//     </footer>
//   );
// }
