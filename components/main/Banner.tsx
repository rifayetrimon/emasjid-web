"use client";

import Image from "next/image";
import { BannerProps } from "@/types/cms";
import { assetPath } from "@/lib/assetPath";

export default function Banner({ banner }: BannerProps) {
  if (!banner) return null;

  const { title, supporting_text, buttons, background_image, logo } = banner;

  return (
    <section
      className="relative w-full h-[90vh] flex flex-col justify-center items-center text-center text-white"
      style={{
        backgroundImage: `url(${assetPath(background_image)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Logo */}
      {logo && (
        <div className="mb-6">
          <Image
            src={assetPath(logo)}
            alt="icon"
            width={120}
            height={120}
            className="w-40 h-40 object-contain"
            priority
          />
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        {title.general}{" "}
        <a href={title.focus.link} className="text-[var(--primary)]">
          <span className="text-[var(--secondary)]">
            {title.focus.text.charAt(0)}
          </span>
          {title.focus.text.slice(1)}
        </a>
      </h1>

      {/* Supporting text */}
      <p className="max-w-5xl text-xl mb-6">{supporting_text}</p>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-10 mt-6">
        {buttons?.map((btn, i) => (
          <a
            key={i}
            href={btn.link}
            className="px-6 py-3 rounded-lg font-medium border border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
          >
            {btn.label}
          </a>
        ))}
      </div>
    </section>
  );
}
