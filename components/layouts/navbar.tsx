"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { MenuItem } from "@/types/cms";

export default function Navbar({ menuItems }: { menuItems: MenuItem[] }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);

  const linkStyle = isHome
    ? "text-white hover:text-[var(--primary)]"
    : "text-gray-800 hover:text-[var(--primary)]";

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
        {menuItems?.map((item, index) => (
          <li key={index}>
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
        <ul className="md:hidden mt-4 flex flex-col items-start gap-4 bg-[#164776] rounded-md p-4 shadow-md">
          {menuItems?.map((item, index) => (
            <li key={index}>
              <a
                href={item.link}
                onClick={() => setMenuOpen(false)}
                className="text-white hover:text-[var(--primary)] font-medium"
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
