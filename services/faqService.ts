// services/faqService.ts
import { getCachedFaq, getCachedConfig } from "./apiCache";
import { FAQProps } from "@/types/cms";
import { DEMO_FAQ } from "@/lib/demoContent";

export async function getFaqData(): Promise<FAQProps["faq"] | null> {
  try {
    const faqData = await getCachedFaq();
    const configData = await getCachedConfig();

    const faqItems = Array.isArray(faqData) ? faqData : [];

    const faqConfig = configData.faqConfig || {};
    const items =
      faqItems.length > 0
        ? faqItems.map(
            (item: { title: string; description: string; message: string }) => ({
              question: item.title || "",
              text: item.description || "",
              answer: item.message || "",
            })
          )
        : DEMO_FAQ.items;

    return {
      title: faqConfig.faqTitle || DEMO_FAQ.title,
      background_image: "",
      items,
    };
  } catch (error) {
    console.error("❌ Error fetching FAQ data:", error);
    return {
      title: DEMO_FAQ.title,
      background_image: "",
      items: DEMO_FAQ.items,
    };
  }
}
