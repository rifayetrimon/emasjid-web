import PromotagBannerItem from "@/components/banner/PromotagBannerItem";
import type { BannerRecord } from "@/types/cms";

interface Props {
  banners: BannerRecord[];
}

/**
 * Demo7-styled promotag block. Each banner becomes a rounded, soft-shadow
 * card honouring the admin's image mode / colours. Hidden when no banners.
 */
export default function Demo7PromotagBanner({ banners }: Props) {
  if (banners.length === 0) return null;
  return (
    <section className="relative py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-4">
        {banners.map((banner) => (
          <PromotagBannerItem
            key={banner.bannerId}
            banner={banner}
            variant="rounded"
          />
        ))}
      </div>
    </section>
  );
}
