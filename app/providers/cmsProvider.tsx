"use client";

import { createContext, useEffect, useState } from "react";
import cmsData from "@/data/cms.json";
import { CMSData, FeatureItem } from "@/types/cms";

export const CMSContext = createContext<CMSData | null>(null);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [cms, setCms] = useState<CMSData | null>(null);

  useEffect(() => {
    const data: CMSData = {
      ...cmsData,
      features: cmsData.content.fetures.items as FeatureItem[], // ✅ use fetures
    };

    // set CSS variables from base_settings
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
