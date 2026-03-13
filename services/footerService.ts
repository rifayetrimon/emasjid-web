// services/footerService.ts
import { getCachedFooter, getCachedConfig } from "./apiCache";
import { FooterProps } from "@/types/cms";
import { getImageUrl } from "./utils";

export async function getFooterData(): Promise<FooterProps["footer"] | null> {
  try {
    const footerData = await getCachedFooter();
    const configData = await getCachedConfig();

    const logoUrl = getImageUrl(configData.logoCMS, "/images/banner/icon.png");

    return {
      image: {
        image: logoUrl,
        link: "#",
      },
      footer_title:
        footerData.content?.[0]?.title || "Majlis Agama Islam Selangor (MAIS)",
      text:
        footerData.content?.[0]?.details ||
        "Urus setia Jawatankuasa Bahagian Pengurusan Masjid",
      address:
        configData.address ||
        "Jabatan Agama Islam Selangor, Aras 7, Menara Selatan, Bangunan Sultan Idris Shah, 40000, Shah Alam, Selangor",
      phone: configData.phonenum || "019725478",
      email: configData.email || "support@mais.gov.my",
      social_links: [
        { platform: "/icons/fb.svg", link: "https://facebook.com/mais" },
        {
          platform: "/icons/instagram.svg",
          link: "https://instagram.com/mais",
        },
        { platform: "/icons/x.svg", link: "https://twitter.com/mais" },
      ],
      copyright: configData.copyright || "© 2025 MAIS. Hak Cipta Terpelihara.",
    };
  } catch (error) {
    console.error("❌ Error fetching footer data:", error);
    return null;
  }
}
