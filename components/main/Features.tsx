"use client";

import Image from "next/image";
import { FeaturesProps } from "@/types/cms";
import { assetPath } from "@/lib/assetPath";

export default function Features({ fetures }: FeaturesProps) {
  if (!fetures || !fetures.items || fetures.items.length === 0) return null;

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
                src={assetPath(feature.icon)}
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
            <p className="text-gray-600">{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// "use client";

// import Image from "next/image";
// import { FeaturesProps } from "@/types/cms";
// import { assetPath } from "@/lib/assetPath";

// export default function Features({ fetures }: FeaturesProps) {
//   if (!fetures || !fetures.items || fetures.items.length === 0) return null;

//   return (
//     <section className="py-20 px-6 md:px-20 bg-gray-50">
//       <h2 className="text-3xl font-bold text-center mb-12 text-[var(--secondary)]">
//         {fetures.title}
//       </h2>
//       <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//         {fetures.items.map((feature, index) => (
//           <div
//             key={index}
//             className="p-6 text-center bg-white rounded-xl shadow hover:shadow-lg transition"
//           >
//             <div className="w-28 h-28 mx-auto mb-4 relative">
//               <Image
//                 src={assetPath(feature.icon)}
//                 alt={feature.title}
//                 fill
//                 className="object-contain"
//               />
//             </div>
//             <h3 className="text-xl font-semibold mb-2 text-[var(--secondary)]">
//               {feature.title}
//             </h3>
//             <p className="text-gray-600">{feature.text}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
