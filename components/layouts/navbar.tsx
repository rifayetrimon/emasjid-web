"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import { MenuItem } from "@/types/cms";

export default function Navbar({ menuItems }: { menuItems: MenuItem[] }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const safeMenuItems = Array.isArray(menuItems) ? menuItems : [];
  const visibleItems = safeMenuItems.slice(0, 5);
  const dropdownItems = safeMenuItems.slice(5);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkStyle = isHome
    ? "text-white hover:text-[var(--primary)]"
    : "text-gray-800 hover:text-[var(--primary)]";

  return (
    <nav
      className={`w-full py-8 px-4 border-b transition-all duration-300 ${
        isHome
          ? "bg-transparent border-transparent absolute top-0 left-0 z-50"
          : "bg-gray-100 border-gray-300 relative z-50"
      }`}
    >
      {/* Desktop Nav */}
      {/* 👇 CHANGED HERE: increased from gap-8 to gap-12 */}
      <ul className="hidden md:flex justify-center gap-16 items-center">
        {visibleItems.map((item, index) => (
          <li key={index}>
            <a href={item.link} className={`font-medium ${linkStyle}`}>
              {item.label}
            </a>
          </li>
        ))}

        {dropdownItems.length > 0 && (
          <li className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`font-medium flex items-center gap-1 ${linkStyle}`}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              More
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-white rounded-lg shadow-xl py-2 border border-gray-200 z-[100]">
                {dropdownItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 hover:text-[var(--primary)] transition-colors duration-200 font-medium whitespace-nowrap"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </li>
        )}
      </ul>

      {/* Mobile Nav Toggle */}
      <div className="md:hidden flex justify-between items-center">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`text-2xl ${isHome ? "text-white" : "text-gray-800"}`}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {menuOpen && (
        <ul className="md:hidden mt-4 flex flex-col items-start gap-4 bg-[#164776] rounded-md p-4 shadow-md absolute top-20 left-4 right-4 z-[100]">
          {safeMenuItems.map((item, index) => (
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
