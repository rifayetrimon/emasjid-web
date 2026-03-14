// services/footerService.ts
import { getCachedFooter, getCachedConfig } from "./apiCache";
import { FooterProps } from "@/types/cms";
import { getImageUrl } from "./utils";

export async function getFooterData(): Promise<FooterProps["footer"] | null> {
  try {
    const footerData = await getCachedFooter();
    const configData = await getCachedConfig();

    const logoUrl = getImageUrl(configData.logoCMS, "/images/banner/icon.png");

    const firstFooter = Array.isArray(footerData) ? footerData[0] : footerData;

    const address = [
      configData.address1,
      configData.address2,
      configData.city,
      configData.state,
      configData.postcode,
    ]
      .filter(Boolean)
      .join(", ");

    return {
      image: {
        image: logoUrl,
        link: "#",
      },
      footer_title: firstFooter?.col1?.title || "",
      text: firstFooter?.col1?.content || "",
      address: address,
      phone: configData.phonenum || "",
      email: configData.email || "",
      social_links: [],
      copyright: configData.copyright || "",
    };
  } catch (error) {
    console.error("❌ Error fetching footer data:", error);
    return null;
  }
}
