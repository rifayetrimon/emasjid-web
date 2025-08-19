"use client";

import Image from "next/image";
import { FeaturesProps } from "@/types/cms";

export default function Features({ fetures }: FeaturesProps) {
  if (!fetures || !fetures.items || fetures.items.length === 0) return null;

  return (
    <section className="py-20 px-6 md:px-20 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-12 text-[var(--secondary)]">
        {fetures.title}
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {fetures.items.map((feature, index) => (
          <div
            key={index}
            className="p-6 text-center bg-white rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="w-12 h-12 mx-auto mb-4 relative">
              <Image
                src={feature.icon}
                alt={feature.title}
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
