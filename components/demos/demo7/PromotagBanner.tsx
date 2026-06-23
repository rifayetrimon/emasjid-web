import PromotagBannerItem from "@/components/banner/PromotagBannerItem";
import type { BannerRecord } from "@/types/cms";

interface Props {
  banners: BannerRecord[];
}

/**
 * Promotag block shared by every non-Blog template. Matches the Blog
 * template's promotag design exactly — the square-cornered "sharp" treatment
 * in a max-w-7xl container — so the promotion banner looks identical across
 * all templates. Honours the admin's image mode / colours. Hidden when empty.
 */
export default function Demo7PromotagBanner({ banners }: Props) {
  if (banners.length === 0) return null;
  return (
    <section className="max-w-7xl mx-auto px-6 pb-12 space-y-4">
      {banners.map((banner) => (
        <PromotagBannerItem
          key={banner.bannerId}
          banner={banner}
          variant="sharp"
        />
      ))}
    </section>
  );
}
