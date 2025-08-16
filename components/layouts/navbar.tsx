"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Utama", href: "/" },
    { name: "Info eMasjid", href: "#" },
    { name: "Carian Masjid", href: "#" },
    { name: "Semakan Permohonan", href: "#" },
    { name: "Soalan Lazim", href: "#" },
  ];

  const linkStyle = isHome
    ? "text-white hover:text-green-600"
    : "text-gray-800 hover:text-blue-600";

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
        {navItems.map((item) => (
          <li key={item.name}>
            <a href={item.href} className={`font-medium ${linkStyle}`}>
              {item.name}
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile Nav Toggle */}
      <div className="md:hidden flex justify-between items-center">
        {/* <div className="text-xl font-bold text-white">eMasjid</div> */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`text-2xl ${isHome ? "text-white" : "text-gray-800"}`}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {menuOpen && (
        <ul className="md:hidden mt-4 flex flex-col items-start gap-4 bg-[#164776] rounded-md p-4 shadow-md">
          {navItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-white hover:text-[#0C9F77] font-medium"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
