// components/main/Branding.tsx
import Image from "next/image";
import { BrandingItem } from "@/types/cms";

interface BrandingProps {
  branding: BrandingItem[];
}

export default function Branding({ branding }: BrandingProps) {
  // Log the API response data
  console.group("🎨 BRANDING - API Response Data");
  console.log("Branding Data:", branding);
  console.log("Total Branding Items:", branding?.length);
  console.table(branding);
  console.groupEnd();

  if (!branding || branding.length === 0) {
    console.warn("⚠️ BRANDING: No branding items provided");
    return null;
  }

  return (
    <div className="branding w-full flex flex-col gap-4">
      {branding.map((item, index) => (
        <div key={index} className="relative w-full h-[500px]">
          <Image
            src={item.image}
            alt={`Branding ${index + 1}`}
            fill
            style={{ objectFit: "cover", objectPosition: "top" }}
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}
