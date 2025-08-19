"use client";

import { useContext } from "react";
import { CMSContext } from "@/app/providers/cmsProvider";
import { assetPath } from "@/lib/assetPath";
import Image from "next/image";

export default function Segment() {
  const cms = useContext(CMSContext);
  if (!cms || !cms.content?.segments) return null;

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        {cms.content.segments.map((segment, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-12 items-stretch gap-8"
          >
            {/* Left: Image (4 cols) */}
            <div className="col-span-12 md:col-span-4 flex justify-center md:justify-start">
              <Image
                src={assetPath(segment.image)}
                alt={segment.button?.label || "segment image"}
                width={350}
                height={250}
                className="rounded-lg shadow-md"
                priority={idx === 0}
              />
            </div>

            {/* Right: Text + Button (8 cols) */}
            <div className="col-span-12 md:col-span-8 flex flex-col justify-between text-center md:text-left">
              {/* Top: Text */}
              <p className="text-gray-700 text-xl mt-3">{segment.text}</p>

              {/* Bottom: Button (same design, just pushed to bottom) */}
              {segment.button && (
                <div className="mt-6 mb-5 flex justify-between items-center">
                  {/* Left: Button */}
                  <a
                    href={segment.button.link}
                    className="px-6 py-2 border border-[var(--primary)] rounded text-[var(--primary)] transition duration-200 ease-in-out 
                 hover:bg-[var(--primary)] hover:text-white 
                 focus:bg-[var(--primary)] focus:text-white 
                 active:bg-[var(--primary)] active:text-white"
                  >
                    {segment.button.label}
                  </a>

                  {/* Right: See More Link */}
                  <a
                    href="#"
                    className="text-[var(--secondary)] font-medium hover:underline"
                  >
                    See more
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
