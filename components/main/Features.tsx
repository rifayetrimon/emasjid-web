"use client";

import Image from "next/image";
import { FeaturesProps } from "@/types/cms";
import { assetPath } from "@/lib/assetPath";
import { useEffect } from "react";

export default function Features({ fetures }: FeaturesProps) {
  // Log the API response data
  useEffect(() => {
    console.group("⭐ FEATURES - API Response Data");
    console.log("Features Data:", fetures);
    console.log("Features Title:", fetures?.title);
    console.log("Total Feature Items:", fetures?.items?.length);
    console.log("Feature Items:", fetures?.items);
    if (fetures?.items) {
      console.table(
        fetures.items.map((item, index) => ({
          index,
          icon: item.icon,
          title: item.title,
          text: item.text,
        }))
      );
    }
    console.groupEnd();
  }, [fetures]);

  if (!fetures || !fetures.items || fetures.items.length === 0) {
    console.warn("⚠️ FEATURES: No feature items provided");
    return null;
  }

  return (
    <section className="py-20 px-6 md:px-20 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-12 text-[var(--secondary)]">
        {fetures.title}
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {fetures.items.map((feature, index) => (
          <div key={index} className="text-center">
            {/* Icon */}
            <div className="w-28 h-28 mx-auto mt-6 mb-8 relative">
              <Image
                src={feature.icon}
                alt={feature.title}
                fill
                className="object-contain"
              />
            </div>

            {/* Static black progress bar */}
            <div className="relative w-40 h-0.5 mb-8 mx-auto bg-black rounded">
              <span className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 rounded-full bg-black" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold mb-2 text-[var(--secondary)]">
              {feature.title}
            </h3>

            {/* Description */}
            {feature.text && <p className="text-gray-600">{feature.text}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
