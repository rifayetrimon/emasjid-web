// services/faqService.ts
import { getCachedFaq, getCachedFooter, getCachedConfig } from "./apiCache";
import { FAQProps } from "@/types/cms";
import { getImageUrl } from "./utils";

export async function getFaqData(): Promise<FAQProps["faq"] | null> {
  try {
    const faqData = await getCachedFaq();
    const footerData = await getCachedFooter();
    const configData = await getCachedConfig();

    const faqBgUrl = getImageUrl(footerData.bgImage, "/images/soalan/bg.png");

    return {
      title: configData.faqMainTitle || "Soalan Lazim",
      background_image: faqBgUrl,
      items: faqData.map(
        (item: { title: string; description: string; message: string }) => ({
          question: item.title,
          text: item.description,
          answer: item.message,
        })
      ),
    };
  } catch (error) {
    console.error("❌ Error fetching FAQ data:", error);
    return null;
  }
}
