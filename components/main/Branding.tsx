import Image from "next/image";
import { getBrandingData } from "@/services/brandingService";
import InlineError from "@/components/ui/InlineError";

export default async function Branding() {
  const branding = await getBrandingData();

  if (!branding || branding.length === 0) {
    console.warn("⚠️ BRANDING: No branding items provided");
    return <InlineError componentName="Penjenamaan" />;
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
