"use client";

import { createContext, useEffect, useState } from "react";
import cmsData from "@/data/cms.json";
import { CMSData, FeatureItem } from "@/types/cms";

export const CMSContext = createContext<CMSData | null>(null);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [cms, setCms] = useState<CMSData | null>(null);

  useEffect(() => {
    // normalize JSON → add `features` shortcut
    const data: CMSData = {
      ...cmsData,
      features: cmsData.content.fetures.items as FeatureItem[],
    };

    // set CSS variables
    document.documentElement.style.setProperty(
      "--primary",
      data.base_settings.primary_color
    );
    document.documentElement.style.setProperty(
      "--secondary",
      data.base_settings.secondary_color
    );
    document.documentElement.style.setProperty(
      "--text-color",
      data.base_settings.text_color
    );

    setCms(data);
  }, []);

  if (!cms) return <div>Loading CMS...</div>;

  return <CMSContext.Provider value={cms}>{children}</CMSContext.Provider>;
}

// "use client";

// import { createContext, useEffect, useState } from "react";
// import { assetPath } from "@/lib/assetPath"; // adjust import if different

// type CMSData = {
//   base_settings: {
//     primary_color: string;
//     secondary_color: string;
//     text_color: string;
//   };
//   content: unknown;
// };

// export const CMSContext = createContext<CMSData | null>(null);

// export function CMSProvider({ children }: { children: React.ReactNode }) {
//   const [cms, setCms] = useState<CMSData | null>(null);

//   useEffect(() => {
//     async function loadCMS() {
//       try {
//         // ✅ Use assetPath to prepend base path
//         const res = await fetch(assetPath("/api/cms"));

//         if (!res.ok) {
//           throw new Error(`Failed to fetch CMS: ${res.status}`);
//         }

//         const data = await res.json();

//         // set CSS variables for theme colors
//         document.documentElement.style.setProperty(
//           "--primary",
//           data.base_settings.primary_color
//         );
//         document.documentElement.style.setProperty(
//           "--secondary",
//           data.base_settings.secondary_color
//         );
//         document.documentElement.style.setProperty(
//           "--text-color",
//           data.base_settings.text_color
//         );

//         setCms(data);
//       } catch (err) {
//         console.error("Failed to load CMS data", err);
//       }
//     }

//     loadCMS();
//   }, []);

//   if (!cms) return <div>Loading CMS...</div>;

//   return <CMSContext.Provider value={cms}>{children}</CMSContext.Provider>;
// }
