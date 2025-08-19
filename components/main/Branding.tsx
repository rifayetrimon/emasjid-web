// components/main/Branding.tsx
import Image from "next/image";
import { assetPath } from "@/lib/assetPath";
import { BrandingItem } from "@/types/cms";

interface BrandingProps {
  branding: BrandingItem[];
}

export default function Branding({ branding }: BrandingProps) {
  return (
    <div className="branding w-full flex flex-col gap-4">
      {branding.map((item, index) => (
        <div key={index} className="relative w-full h-[500px]">
          <Image
            src={assetPath(item.image)}
            alt={`Branding ${index}`}
            fill
            style={{ objectFit: "cover", objectPosition: "top" }}
          />
        </div>
      ))}
    </div>
  );
}
