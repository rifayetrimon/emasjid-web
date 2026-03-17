// services/faqService.ts
import { getCachedFaq, getCachedConfig } from "./apiCache";
import { FAQProps } from "@/types/cms";

export async function getFaqData(): Promise<FAQProps["faq"] | null> {
  try {
    const faqData = await getCachedFaq();
    const configData = await getCachedConfig();

    const faqItems = Array.isArray(faqData) ? faqData : [];

    const faqConfig = configData.faqConfig || {};
    return {
      title: faqConfig.faqTitle || "",
      background_image: "",
      items: faqItems.map(
        (item: { title: string; description: string; message: string }) => ({
          question: item.title || "",
          text: item.description || "",
          answer: item.message || "",
        })
      ),
    };
  } catch (error) {
    console.error("❌ Error fetching FAQ data:", error);
    return null;
  }
}
