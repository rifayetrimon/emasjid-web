"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useCMS } from "@/hooks/useCMS"; // import hook

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  const { content, base_settings } = useCMS();

  // ✅ Pull nav items directly from CMS JSON
  const navItems = content?.banner?.menu_items || [];

  // ✅ Use CMS primary color for active/hover states
  const primary = base_settings?.primary_color || "#164776";
  const linkStyle = isHome
    ? `text-white hover:text-[${primary}]`
    : `text-gray-800 hover:text-[${primary}]`;

  return (
    <nav
      className={`w-full py-8 px-4 border-b z-50 ${
        isHome
          ? "bg-transparent border-transparent absolute top-0 left-0"
          : "bg-gray-100 border-gray-300"
      }`}
    >
      {/* Desktop Nav */}
      <ul className="hidden md:flex justify-center space-x-15">
        {navItems.map((item: any) => (
          <li key={item.label}>
            <a href={item.link} className={`font-medium ${linkStyle}`}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile Nav Toggle */}
      <div className="md:hidden flex justify-between items-center">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`text-2xl ${isHome ? "text-white" : "text-gray-800"}`}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {menuOpen && (
        <ul
          className="md:hidden mt-4 flex flex-col items-start gap-4 rounded-md p-4 shadow-md"
          style={{ backgroundColor: primary }}
        >
          {navItems.map((item: any) => (
            <li key={item.label}>
              <a
                href={item.link}
                onClick={() => setMenuOpen(false)}
                className="text-white hover:opacity-80 font-medium"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

// "use client";

// import { usePathname } from "next/navigation";
// import { useState } from "react";
// import { FaBars, FaTimes } from "react-icons/fa";

// export default function Navbar() {
//   const pathname = usePathname();
//   const isHome = pathname === "/";
//   const [menuOpen, setMenuOpen] = useState(false);

//   const navItems = [
//     { name: "Utama", href: "/" },
//     { name: "Info eMasjid", href: "#" },
//     { name: "Carian Masjid", href: "#" },
//     { name: "Semakan Permohonan", href: "#" },
//     { name: "Soalan Lazim", href: "#" },
//   ];

//   const linkStyle = isHome
//     ? "text-white hover:text-green-600"
//     : "text-gray-800 hover:text-blue-600";

//   return (
//     <nav
//       className={`w-full py-8 px-4 border-b z-50 ${
//         isHome
//           ? "bg-transparent border-transparent absolute top-0 left-0"
//           : "bg-gray-100 border-gray-300"
//       }`}
//     >
//       {/* Desktop Nav */}
//       <ul className="hidden md:flex justify-center space-x-15">
//         {navItems.map((item) => (
//           <li key={item.name}>
//             <a href={item.href} className={`font-medium ${linkStyle}`}>
//               {item.name}
//             </a>
//           </li>
//         ))}
//       </ul>

//       {/* Mobile Nav Toggle */}
//       <div className="md:hidden flex justify-between items-center">
//         {/* <div className="text-xl font-bold text-white">eMasjid</div> */}
//         <button
//           onClick={() => setMenuOpen(!menuOpen)}
//           className={`text-2xl ${isHome ? "text-white" : "text-gray-800"}`}
//         >
//           {menuOpen ? <FaTimes /> : <FaBars />}
//         </button>
//       </div>

//       {/* Mobile Nav Menu */}
//       {menuOpen && (
//         <ul className="md:hidden mt-4 flex flex-col items-start gap-4 bg-[#164776] rounded-md p-4 shadow-md">
//           {navItems.map((item) => (
//             <li key={item.name}>
//               <a
//                 href={item.href}
//                 onClick={() => setMenuOpen(false)}
//                 className="text-white hover:text-[#0C9F77] font-medium"
//               >
//                 {item.name}
//               </a>
//             </li>
//           ))}
//         </ul>
//       )}
//     </nav>
//   );
// }
